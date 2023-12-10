import {Router} from "express";
import {UserController} from "./user.controller";
import {PrismaClient, User, Account, Category, CustomCategory} from "@prisma/client";

const jwt = require("jsonwebtoken");

const prisma = new PrismaClient()

export class UserRouter {
    router = Router();

    constructor(private userController: UserController) {
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
                        return  res.status(401).json({message: "No id provided"});
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
                    res.status(401).json({message: "No token provided"});
                }
                jwt.verify(token, "secret", async (err: any, decoded: any) => {
                    if (!decoded) {
                        res.status(401).json({message: "No id provided"});
                    }
                    const id = decoded.id;
                    const newInfo = req.body.user;
                    if (err) {
                        res.status(401).json({message: "Failed to authenticate token"});
                    }
                    const user = await prisma.user.update({
                        where: {
                            id: parseInt(id),
                        },
                        data: {
                            email: newInfo.email,
                            firstName: newInfo.firstName,
                            lastName: newInfo.lastName,
                            // @ts-ignore
                            forfait: newInfo.forfait,
                            password: newInfo.password,
                            step: newInfo.step,
                        }
                    });
                    //update accounts
                    for (const account of newInfo.accounts) {

                        const accountResponse = <Account>await prisma.account.findUnique({
                            where: {
                                id: account.id,
                            },
                            include: {
                                saves: true,
                            }
                        });
                        if (!accountResponse) {
                            return res.status(401).json({message: "Account not found"});
                        }
                        //@ts-ignore
                        if (account.saves.length < accountResponse.saves.length) {
                            //@ts-ignore
                            for (const save of accountResponse.saves) {
                                if (!account.saves.find((s: any) => s.id == save.id)) {
                                    await prisma.save.delete({
                                        where: {
                                            id: save.id,
                                        }
                                    });
                                }
                            }
                            return res.status(200).json({message: "Account updated"});
                        }
                        await prisma.account.update({
                            where: {
                                id: account.id,
                            },
                            data: {
                                name: account.name,
                                companyName: account.companyName,
                                type: account.type,
                                nameBank: account.nameBank,
                            }
                        });
                        if (account.saves) {
                            for (const save of account.saves) {
                                if (save.id === 0) {
                                    await prisma.save.create({
                                        data: {
                                            amount: save.amount,
                                            comment: save.comment,
                                            createdAt: save.createdAt ? save.createdAt : new Date(),
                                            account: {
                                                connect: {
                                                    id: account.id,
                                                }
                                            }
                                        }
                                    });
                                } else {
                                    await prisma.save.update({
                                        where: {
                                            id: save.id,
                                        },
                                        data: {
                                            amount: save.amount,
                                            comment: save.comment,
                                        }
                                    });
                                }
                            }
                        }
                    }
                    const allCategories = await prisma.customCategory.findMany({
                        where: {
                            userId: user.id,
                        }
                    });
                    if (allCategories.length != newInfo.customCategories.length) {
                        for (const category of allCategories) {
                            if (!newInfo.customCategories.find((c: CustomCategory) => c.id == category.id)) {
                                await prisma.customCategory.delete({
                                    where: {
                                        id: category.id,
                                    }
                                });
                            }
                        }
                    }
                    for (const category of newInfo.customCategories) {

                        if (!category.id) {
                            await prisma.customCategory.create({
                                data: {
                                    name: category.name,
                                    userId: user.id,
                                    type: category.type,
                                    color: category.color,
                                    maxAmount: category.maxAmount,
                                }
                            });
                        } else {
                            await prisma.customCategory.update({
                                where: {
                                    id: category.id,
                                },
                                data: {
                                    name: category.name,
                                    color: category.color,
                                    maxAmount: category.maxAmount,
                                }
                            });
                        }

                    }


                    if (!user) {
                        return res.status(401).json({message: "User not found"});
                    }
                    return  res.status(200).json(user);
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
                        return  res.status(401).json({message: "No id provided"});
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
        this.router.get("/steps", (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    return res.status(401).json({message: "No token provided"});
                }
                jwt.verify(token, "secret", (err: any, decoded: any) => {
                    const id = decoded.id;
                    if (err) {
                        return res.status(401).json({message: "Failed to authenticate token"});
                    }
                    const steps = this.userController.getSteps(parseInt(id));
                    if (!steps) {
                        return res.status(401).json({message: "Steps not found"});
                    }
                    return res.status(200).json(steps);
                });
            } catch (err) {
                next(err);
            }
        });
        this.router.post("/salary", (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    res.status(401).json({message: "No token provided"});
                }
                jwt.verify(token, "secret", (err: any, decoded: any) => {
                    if (!decoded) {
                        res.status(401).json({message: "No id provided"});
                    }
                    const id = decoded.id;
                    const salary = req.body.salary;
                    if (err) {
                        res.status(401).json({message: "Failed to authenticate token"});
                    }
                    const salaryResponse = this.userController.setSalary(
                        parseInt(id),
                        salary
                    );
                    if (!salary) {
                        throw new Error("Salary not found");
                    }
                    res.status(200).json(salaryResponse);
                });
            } catch (err) {
                next(err);
            }
        });
        this.router.post("/save", (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    res.status(401).json({message: "No token provided"});
                }
                jwt.verify(token, "secret", (err: any, decoded: any) => {
                    if (!decoded) {
                        res.status(401).json({message: "No id provided"});
                    }
                    const id = decoded.id;
                    const save = req.body.save;
                    if (err) {
                        res.status(401).json({message: "Failed to authenticate token"});
                    }
                    const saveResponse = this.userController.setSave(parseInt(id), save);
                    if (!save) {
                        res.status(401).json({message: "Save not found"});
                    }
                    res.status(200).json(saveResponse);
                });
            } catch (err) {
                next(err);
            }
        });
        this.router.patch("/step/edit", (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    res.status(401).json({message: "No token provided"});
                }
                jwt.verify(token, "secret", (err: any, decoded: any) => {
                    if (!decoded) {
                        res.status(401).json({message: "No id provided"});
                    }
                    const id = decoded.id;
                    const step = req.body.step;
                    if (err) {
                        res.status(401).json({message: "Failed to authenticate token"});
                    }
                    const stepResponse = this.userController.setStep(parseInt(id), step);
                    if (!step) {
                        res.status(401).json({message: "Step not found"});
                    }
                    res.status(200).json(stepResponse);
                });
            } catch (err) {
                next(err);
            }
        });
    }
}
