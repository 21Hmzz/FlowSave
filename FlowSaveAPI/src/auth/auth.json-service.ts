import { AuthService } from "./auth.service";
const jwt = require('jsonwebtoken');

export class AuthJSONService implements AuthService {
    login(email: string, password: string): object | null {
        var fs = require('fs');
        var database = JSON.parse(fs.readFileSync('./src/database/database.json'));
        var users = database.users;
        var user = users.find((user: any) => user.email === email && user.password === password);
        if (!user) {
            throw new Error('User not found');
        }
        const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' });
        const decodedToken = jwt.decode(token);
        const expireTime = decodedToken ? decodedToken.exp : null;
        const response = {
            token,
            expireTime
        };

        return response;
    }
    register(password: string, email: string, firstName: string, lastName: string): object | null {
        var fs = require('fs');
        var database = JSON.parse(fs.readFileSync('./src/database/database.json'));
        var users = database.users;
        var user = users.find((user: any) => user.email === email);
        if (user) {
            throw new Error('User already exists');
        }
        var newUser = {
            id: users.length + 1,
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            accounts: []
        };
        var steps = database.steps;
        var newSteps = {
            id: users.length + 1,
            steps: 1
        };

        steps.push(newSteps);
        users.push(newUser);
        fs.writeFileSync('./src/database/database.json', JSON.stringify(database), (err: any) => {
            if (err) throw err;
        });

        return this.login(email, password);


    }
}