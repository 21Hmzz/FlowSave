import { Router } from "express";
import {PrismaClient} from "@prisma/client";
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const updateBalance = async (accountId: number) => {
    const transactions = await prisma.transaction.findMany({
        where: {
            accountId: accountId
        }
    });
    let balance = 0;
    transactions.forEach((transaction) => {
        if (transaction.type === "expense") {
            balance -= transaction.amount;
        } else if (transaction.type === "income") {
            balance += transaction.amount;
        }
    });
    await prisma.account.update({
        where: {
            id: accountId
        },
        data: {
            balance: balance
        }
    });
}

export class AccountRouter {
    router = Router();

    constructor() {
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.put("/transactions/:transactionId", (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                   res.status(401).json({ message: "No token provided" });
                }
                jwt.verify(token, "secret", async (err: any) => {
                    const { transactionId } = req.params;
                    const { amount, type, comment, date,name,categoryId,customCategoryId } = req.body;
                    if (err) {
                        throw new Error("Failed to authenticate token");
                    }
                    const transactions = await prisma.transaction.update({
                        where: {
                            id: parseInt(transactionId)
                        },
                        data: {
                            amount: amount,
                            type: type,
                            name: name,
                            comments: comment,
                            createdAt: date != '' ? new Date(date).toISOString() : new Date().toISOString(),
                            categoryId: categoryId,
                            customCategoryId: customCategoryId
                        }
                    });

                    if (!transactions) {
                        throw new Error("Account not found");
                    }
                    await updateBalance(transactions.accountId);
                    res.status(200).json(transactions);
                });
            } catch (err) {
                next(err);
            }
        });
        this.router.post("/:id/transactions", (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    res.status(400).json({ message: "No token provided" });
                }
                jwt.verify(token, "secret", async (err: any) => {
                    const { id } = req.params;
                    const { amount, type, comment, date,name,categoryId,customCategoryId } = req.body;
                    if (err) {
                        res.status(400).json({ message: "Failed to authenticate token" });
                    }
                    const transactions = await prisma.transaction.create({
                        data: {
                            amount: amount,
                            type: type,
                            name: name,
                            comments: comment,
                            createdAt: date != '' ? new Date(date).toISOString() : new Date().toISOString(),
                            accountId: parseInt(id),
                            categoryId: categoryId,
                            customCategoryId: customCategoryId

                        }
                    });
                    if (!transactions) {
                        res.status(400).json({ message: "Account not found" });
                    }
                    await updateBalance(transactions.accountId);
                    res.status(200).json(transactions);
                });
            } catch (err) {
                next(err);
            }
        });
        this.router.delete("/transactions/:transactionId", (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    res.status(400).json({ message: "No token provided" });
                }
                jwt.verify(token, "secret", async (err: any) => {
                    const { transactionId } = req.params;
                    if (err) {
                        res.status(400).json({ message: "Failed to authenticate token" });
                    }
                    const transactions = await prisma.transaction.delete({
                        where: {
                            id: parseInt(transactionId)
                        }
                    });
                    if (!transactions) {
                        res.status(400).json({ message: "Account not found" });
                    }
                    await updateBalance(transactions.accountId);
                    res.status(200).json(transactions);
                });
            } catch (err) {
                next(err);
            }
        });
    }
}
