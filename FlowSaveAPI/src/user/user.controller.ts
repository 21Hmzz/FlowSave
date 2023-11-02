import { User } from './user';
import { UserService } from './user.service';

export class UserController {
    constructor(private userService: UserService) { }

    getUser(id: number): User | null {
        return this.userService.getUser(id);
    }

    getSteps(id: number): number | null {
        return this.userService.getSteps(id);
    }


}
