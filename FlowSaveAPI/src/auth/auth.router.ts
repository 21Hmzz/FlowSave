import {Router} from 'express';
import {PrismaClient} from "@prisma/client";
import CryptoJS from "crypto-js";

const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

export class AuthRouter {
    router = Router();

    constructor() {
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.post('/login', async (req, res, next) => {
            try {
                let {email, password} = req.body;
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });
                if (!user) {
                    return {
                        message: 'User not found'
                    }
                }
                if (CryptoJS.SHA1(password).toString() !== user.password) {
                    return {
                        message: 'Wrong password' + user.password
                    }
                }

                const token = jwt.sign({id: user.id}, 'secret', {expiresIn: '1d'});
                const decodedToken = jwt.decode(token);
                const expireTime = decodedToken ? decodedToken.exp : null;

                const response = {
                    token,
                    expireTime
                };
                res.send(response);
            } catch (err) {
                next(err);
            }
        });
        this.router.post('/register', async (req, res, next) => {
            try {
                let {password, email, firstName, lastName} = req.body;
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });
                if (user) {
                    res.status(400).json({
                        message: 'User already exists'
                    });

                }
                password = CryptoJS.SHA1(password).toString();
                const newUser = await prisma.user.create({
                    data: {
                        email,
                        password,
                        firstName,
                        lastName
                    },
                })

                if (!newUser) {
                    res.status(400).json({
                        message: 'User not created'
                    });
                }

                res.status(200).json({
                    message: 'User created'
                });

            } catch (err) {
                next(err);
            }

        });
    }
}
