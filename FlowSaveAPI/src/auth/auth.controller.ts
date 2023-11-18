
import { AuthService } from "./auth.service";
export class AuthController {
    constructor(private authService: AuthService) { }
    register(
        password: string,
        email: string,
        firstName: string,
        lastName: string,
    ): object | null {
        return this.authService.register(password, email, firstName, lastName);
    }
    login(email: string, password: string): object | null {
        return this.authService.login(email, password);
    }

}