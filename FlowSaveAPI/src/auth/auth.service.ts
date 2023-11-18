export interface AuthService {
    login(email: string, password: string): object | null;
    register(
        password: string,
        email: string,
        firstName: string,
        lastName: string,
    ): object | null;
}