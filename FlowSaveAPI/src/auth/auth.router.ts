import { Router } from 'express';
import { AuthController } from './auth.controller';
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export class AuthRouter {
    router = Router();

    constructor(private authController: AuthController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.post('/login', async (req, res, next) => {
            try {
                const { email, password } = req.body;
                const response = await this.authController.login(email, password);
                // @ts-ignore
                res.status(200).json(response);
            }
            catch (err) {
                next(err);
            }
        });
        this.router.post('/register', async (req, res, next) => {
            try {
                const { password, email, firstName, lastName } = req.body;
                const token = this.authController.register(password, email, firstName, lastName);
                res.send(token);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
