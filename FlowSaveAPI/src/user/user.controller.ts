import { User } from "./user";
import { UserService } from "./user.service";

export class UserController {
  constructor(private userService: UserService) {}

  getUser(id: number): User | null {
    return this.userService.getUser(id);
  }

  getInfos(id: number): object | null {
    return this.userService.getInfos(id);
  }
  getSteps(id: number): number | null {
    return this.userService.getSteps(id);
  }
  setSalary(id: number, salary: number): number | null {
    return this.userService.setSalary(id, salary);
  }
  setSave(id: number, save: number): number | null {
    return this.userService.setSave(id, save);
  }
  setStep(id: number, step: number): number | null {
    return this.userService.setStep(id, step);
  }
}
