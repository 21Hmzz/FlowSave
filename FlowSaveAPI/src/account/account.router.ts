import { Router } from "express";
import { AccountController } from "./account.controller";
const jwt = require("jsonwebtoken");

export class AccountRouter {
    router = Router();

    constructor(private accountController: AccountController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.get("/:id/transactions", (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    throw new Error("No token provided");
                }
                jwt.verify(token, "secret", (err: any, decoded: any) => {
                    const { id } = req.params;
                    if (err) {
                        throw new Error("Failed to authenticate token");
                    }
                    const transactions = this.accountController.getTransactions(parseInt(id), decoded.id);
                    if (!transactions) {
                        throw new Error("Account not found");
                    }
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
                    throw new Error("No token provided");
                }
                jwt.verify(token, "secret", (err: any, decoded: any) => {
                    const { id } = req.params;
                    const { amount, type, description, date } = req.body;
                    if (err) {
                        throw new Error("Failed to authenticate token");
                    }
                    const transactions = this.accountController.addTransactions(parseInt(id), amount, type, description, date);
                    if (!transactions) {
                        throw new Error("Account not found");
                    }
                    res.status(200).json(transactions);
                });
            } catch (err) {
                next(err);
            }
        });
        this.router.get("/:id", (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    throw new Error("No token provided");
                }
                jwt.verify(token, "secret", (err: any, decoded: any) => {
                    const { id } = req.params;
                    if (err) {
                        throw new Error("Failed to authenticate token");
                    }
                    const account = this.accountController.getAccount(parseInt(id));
                    if (!account) {
                        throw new Error("Account not found");
                    }
                    res.status(200).json(account);
                });
            } catch (err) {
                next(err);
            }
        });
        this.router.get("/", (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    throw new Error("No token provided");
                }
                jwt.verify(token, "secret", (err: any, decoded: any) => {
                    if (!decoded) {
                        throw new Error("Failed to authenticate token");
                    }
                    const id = decoded.id;
                    if (err) {
                        throw new Error("Failed to authenticate token");
                    }
                    const accounts = this.accountController.getAccounts(id);
                    res.status(200).json(accounts);
                });
            } catch (err) {
                next(err);
            }
        });
        this.router.get('/all', (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    throw new Error("No token provided");
                }
                jwt.verify(token, "secret", (err: any, decoded: any) => {
                    if (!decoded) {
                        throw new Error("Failed to authenticate token");
                    }
                    const id = decoded.id;
                    if (err) {
                        throw new Error("Failed to authenticate token");
                    }
                    const accounts = this.accountController.getAllAccounts(id);
                    res.status(200).json(accounts);
                });
            } catch (err) {
                next(err);
            }
        });
    }
}
