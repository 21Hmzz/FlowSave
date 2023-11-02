import { AuthService } from "./auth.service";
const jwt = require('jsonwebtoken');

export class AuthJSONService implements AuthService {
    login(email: string, password: string): string | null {
        var fs = require('fs');
        var database = JSON.parse(fs.readFileSync('./src/database/database.json'));
        var users = database.users;
        var user = users.find((user: any) => user.email === email && user.password === password);
        if (!user) {
            throw new Error('User not found');
        }
        const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
        return token;
    }
    register(password: string, email: string, firstName: string, lastName: string): string | null {
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