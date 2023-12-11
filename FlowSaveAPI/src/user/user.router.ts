import {Router} from "express";
import {PrismaClient, Category, CustomCategory} from "@prisma/client";

const jwt = require("jsonwebtoken");

const prisma = new PrismaClient()

export class UserRouter {
    router = Router();

    constructor() {
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.get("/", async (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    res.status(401).json({message: "No token provided"});
                }
                jwt.verify(token, "secret", async (err: any, decoded: any) => {
                    if (!decoded) {
                        return res.status(401).json({message: "No id provided"});
                    }
                    const id = decoded.id;
                    if (err) {
                        return res.status(401).json({message: "Failed to authenticate token"});
                    }
                    // @ts-ignore
                    const info = await prisma.user.findUnique({
                        where: {
                            id: parseInt(id),
                        },
                        include: {
                            accounts: {
                                include: {
                                    // @ts-ignore
                                    transactions: {
                                        orderBy: {
                                            createdAt: "desc"
                                        },
                                        include: {
                                            category: true,
                                            customCategory: true,
                                        }
                                    },
                                    saves: true,
                                }
                            },
                            // @ts-ignore
                            customCategories: true,


                        }
                    });
                    const allBasicCategories = await prisma.category.findMany();
                    if (!info) {
                        return res.status(401).json({message: "Infos not found"});
                    }
                    // @ts-ignore
                    info.allBasicCategories = allBasicCategories as Category[];
                    return res.status(200).json({info});
                });
            } catch (err) {
                next(err);
            }
        });

        this.router.put("/edit", async (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    return res.status(401).json({message: "No token provided"});
                }

                jwt.verify(token, "secret", async (err: any, decoded: any) => {
                    if (!decoded) {
                        return res.status(401).json({message: "No id provided"});
                    }

                    const id = decoded.id;
                    const newInfo = req.body.user;

                    if (err) {
                        return res.status(401).json({message: "Failed to authenticate token"});
                    }

                   // tableau d'opérations à effectuer
                    const updateOperations = [];

                    // Mise à jour des infos de l'utilisateur
                    updateOperations.push(
                        prisma.user.update({
                            where: {id: parseInt(id)},
                            data: {
                                email: newInfo.email,
                                firstName: newInfo.firstName,
                                lastName: newInfo.lastName,
                                forfait: newInfo.forfait,
                                salaire: newInfo.salaire,
                                save: newInfo.save,
                                updatedAt: new Date(),
                                password: newInfo.password,
                                step: newInfo.step,
                            },
                        })
                    );

                    // J'update ou je crée les comptes
                    for (const account of newInfo.accounts) {
                        if (!account.id) {
                            // Create a new account
                            updateOperations.push(
                                prisma.account.create({
                                    data: {
                                        name: account.name,
                                        companyName: account.companyName,
                                        type: account.type,
                                        balance: account.balance,
                                        nameBank: account.nameBank,
                                        userId: parseInt(id),
                                    },
                                })
                            );
                        } else {
                            // J'update les comptes existants
                            updateOperations.push(
                                prisma.account.update({
                                    where: {id: account.id},
                                    data: {
                                        name: account.name,
                                        companyName: account.companyName,
                                        type: account.type,
                                        nameBank: account.nameBank,
                                    },
                                })
                            );

                            // J'update  les transactions
                            for (const transaction of account.transactions) {
                                updateOperations.push(
                                    prisma.transaction.update({
                                        where: {id: transaction.id},
                                        data: {
                                            name: transaction.name,
                                            amount: transaction.amount,
                                            type: transaction.type,
                                            comments: transaction.comments,
                                            createdAt: new Date(transaction.createdAt).toISOString() ? new Date(transaction.createdAt).toISOString() : new Date(),
                                            updatedAt: new Date(),
                                        },
                                    })
                                );
                                if(transaction.category) {
                                    updateOperations.push(
                                        prisma.transaction.update({
                                            where: {id: transaction.id},
                                            data: {
                                                category: {
                                                    connect: {
                                                        id: transaction.categoryId
                                                    },
                                                },
                                            },
                                        })
                                    );
                                }
                                if(transaction.customCategory) {
                                    updateOperations.push(
                                        prisma.transaction.update({
                                            where: {id: transaction.id},
                                            data: {
                                                customCategory: {
                                                    connect: {
                                                        id: transaction.customCategory.id,
                                                    },
                                                },
                                            },
                                        })
                                    );
                                }
                            }

                            // J'update ou je crée les épargnes
                            if (account.saves) {
                                for (const save of account.saves) {
                                    if (save.id === 0) {
                                        updateOperations.push(
                                            prisma.save.create({
                                                data: {
                                                    amount: save.amount,
                                                    comment: save.comment,
                                                    createdAt: save.createdAt ? save.createdAt : new Date(),
                                                    account: {
                                                        connect: {
                                                            id: account.id,
                                                        },
                                                    },
                                                },
                                            })
                                        );
                                    } else {
                                        updateOperations.push(
                                            prisma.save.update({
                                                where: {id: save.id},
                                                data: {
                                                    amount: save.amount,
                                                    comment: save.comment,
                                                },
                                            })
                                        );
                                    }
                                }
                            }
                        }
                    }

                    // J'update les catégories
                    const allCategories = await prisma.customCategory.findMany({
                        where: {
                            userId: parseInt(id),
                        },
                    });

                    if (allCategories.length !== newInfo.customCategories.length) {
                        for (const category of allCategories) {
                            if (!newInfo.customCategories.find((c: CustomCategory) => c.id === category.id)) {
                                updateOperations.push(
                                    prisma.customCategory.delete({
                                        where: {id: category.id},
                                    })
                                );
                            }
                        }
                    }

                    for (const category of newInfo.customCategories) {
                        if (!category.id) {
                            // je crée une nouvelle catégorie
                            updateOperations.push(
                                prisma.customCategory.create({
                                    data: {
                                        name: category.name,
                                        userId: parseInt(id),
                                        type: category.type,
                                        color: category.color,
                                        maxAmount: category.maxAmount,
                                    },
                                })
                            );
                        } else {
                            // J'update les catégories existantes
                            updateOperations.push(
                                prisma.customCategory.update({
                                    where: {id: category.id},
                                    data: {
                                        name: category.name,
                                        color: category.color,
                                        maxAmount: category.maxAmount,
                                    },
                                })
                            );
                        }
                    }

                    // j'update le compte de l'utilisateur
                    await prisma.$transaction(updateOperations);

                    return res.status(200).json({message: "Les informations ont bien été mises à jour"});
                });
            } catch (err) {
                next(err);
            }
        });
        this.router.get("/dashboard", (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    res.status(401).json({message: "No token provided"});
                }
                jwt.verify(token, "secret", async (err: any, decoded: any) => {
                    if (!decoded) {
                        return res.status(401).json({message: "No id provided"});
                    }
                    const id = decoded.id;
                    if (err) {
                        return res.status(401).json({message: "Failed to authenticate token"});
                    }
                    // @ts-ignore
                    const info = await prisma.user.findUnique({
                        where: {
                            id: parseInt(id),
                        },
                        include: {
                            accounts: {
                                include: {
                                    // @ts-ignore
                                    transactions: {
                                        orderBy: {
                                            createdAt: "desc"
                                        },
                                        include: {
                                            category: true,
                                            customCategory: true,
                                        }
                                    },
                                    saves: true,
                                }
                            },
                            // @ts-ignore
                            customCategories: true,


                        }
                    });
                    const allBasicCategories = await prisma.category.findMany();
                    if (!info) {
                        return res.status(401).json({message: "Infos not found"});
                    }
                    // @ts-ignore
                    info.allBasicCategories = allBasicCategories as Category[];
                    return res.status(200).json({info});
                });
            } catch (err) {
                next(err);
            }
        });
        this.router.put('/password', async (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    res.status(401).json({message: "No token provided"});
                }
                jwt.verify(token, "secret", async (err: any, decoded: any) => {
                    if (!decoded) {
                        res.status(401).json({message: "No id provided"});
                    }
                    const id = decoded.id;
                    const password = req.body.password;
                    if (err) {
                        res.status(401).json({message: "Failed to authenticate token"});
                    }
                    const user = await prisma.user.update({
                        where: {
                            id: parseInt(id),
                        },
                        data: {
                            password: password,
                        }
                    });
                    if (!user) {
                        return res.status(401).json({message: "User not found"});
                    }
                    return res.status(200).json(user);
                });
            } catch (err) {
                next(err);
            }
        });
    }
}
