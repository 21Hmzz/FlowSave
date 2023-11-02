export interface AuthService {
    login(email: string, password: string): string | null;
    register(
        password: string,
        email: string,
        firstName: string,
        lastName: string,
    ): string | null;
}