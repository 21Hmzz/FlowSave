import { User } from "./user";

export interface UserService {
  getUser(id: number): User | null;
  getSteps(id: number): number | null;
  getInfos(id: number): object | null;
  setSalary(id: number, salary: number): number | null;
  setSave(id: number, save: number): number | null;
  setStep(id: number, step: number): number | null;
}
