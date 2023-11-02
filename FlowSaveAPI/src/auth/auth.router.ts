import { Router } from 'express';
import { AuthController } from './auth.controller';

export class AuthRouter {
    router = Router();

    constructor(private authController: AuthController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.post('/login', (req, res, next) => {
            try {
                const { email, password } = req.body;
                const token = this.authController.login(email, password);
                const response = {
                    token: token,
                    message: 'OK'
                }
                res.status(200).json(response);
            }
            catch (err) {
                next(err);
            }
        });
        this.router.post('/register', (req, res, next) => {
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
