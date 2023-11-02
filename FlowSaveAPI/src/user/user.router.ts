import { Router } from 'express';
import { UserController } from './user.controller';
const jwt = require('jsonwebtoken');

export class UserRouter {
    router = Router();

    constructor(private userController: UserController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.get('/', (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    throw new Error('No token provided');
                }
                jwt.verify(token, 'secret', (err: any, decoded: any) => {
                    if (!decoded) {
                        throw new Error('No id provided');
                    }
                    const id = decoded.id;
                    if (err) {
                        throw new Error('Failed to authenticate token');
                    }
                    const user = this.userController.getUser(parseInt(id));
                    if (!user) {
                        throw new Error('User not found');
                    }
                    res.status(200).json(user);
                });
            }
            catch (err) {
                next(err);
            }
        });

        this.router.get('/steps', (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    throw new Error('No token provided');
                }
                jwt.verify(token, 'secret', (err: any, decoded: any) => {
                    const id = decoded.id;
                    if (err) {
                        throw new Error('Failed to authenticate token');
                    }
                    const steps = this.userController.getSteps(parseInt(id));
                    if (!steps) {
                        throw new Error('Steps not found');
                    }
                    res.status(200).json(steps);
                });
            }
            catch (err) {
                next(err);
            }
        }
        );
        this.router.post('/user/salary', (req, res, next) => {
            try {
                const token = req.headers.authorization;
                if (!token) {
                    throw new Error('No token provided');
                }
                jwt.verify(token, 'secret', (err: any, decoded: any) => {
                    const id = decoded.id;
                    if (err) {
                        throw new Error('Failed to authenticate token');
                    }
                    const salary = this.userController.getSalary(parseInt(id));
                    if (!salary) {
                        throw new Error('Salary not found');
                    }
                    res.status(200).json(salary);
                });
            }
            catch (err) {
                next(err);
            }
        }
        );

    }
}
