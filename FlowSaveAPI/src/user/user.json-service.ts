import { User } from './user';
import { UserService } from './user.service';

export class UserJSONService implements UserService {

    getUser(id: number): User | null {
        var fs = require('fs');
        var database = JSON.parse(fs.readFileSync('./src/database/database.json'));
        var users = database.users;
        var user = users.find((user: any) => user.id === id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    getSteps(id: number): number | null {
        var fs = require('fs');
        var database = JSON.parse(fs.readFileSync('./src/database/database.json'));
        var steps = database.steps;
        var step = steps.find((step: any) => step.userID === id);
        if (!step) {
            throw new Error('Steps not found');
        }
        return step;
    }




}