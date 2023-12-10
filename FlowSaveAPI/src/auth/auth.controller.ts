
import { AuthService } from "./auth.service";
export class AuthController {
    constructor(private authService: AuthService) { }
    async register(
        password: string,
        email: string,
        firstName: string,
        lastName: string,
    ): Promise<object | null> {
        return this.authService.register(password, email, firstName, lastName);
    }
    async login(email: string, password: string): Promise<object | null> {
        return this.authService.login(email, password);
    }

}