import {AuthService} from "./auth.service";
import {PrismaClient} from "@prisma/client";

const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();


export class AuthJSONService implements AuthService {
    async login(email: string, password: string): Promise<object | null> {
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
        if (user.password !== password) {
            return {
                message: 'Wrong password'
            }
        }

        const token = jwt.sign({id: user.id}, 'secret', {expiresIn: '1d'});
        const decodedToken = jwt.decode(token);
        const expireTime = decodedToken ? decodedToken.exp : null;

        return {
            token,
            expireTime
        };

    }

    async register(password: string, email: string, firstName: string, lastName: string): Promise<object | null> {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (user) {
            return {
                message: 'User already exists'
            }
        }
        const newUser = await prisma.user.create({
            data: {
                email,
                password,
                firstName,
                lastName
            },
        })

        if(!newUser){
            return {
                message: 'User not created'
            }
        }

        return this.login(email, password);


    }
}