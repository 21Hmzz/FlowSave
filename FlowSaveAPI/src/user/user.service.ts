import { User } from "./user";

export interface UserService {
    getUser(id: number): User | null,
    getSteps(id: number): number | null,
}