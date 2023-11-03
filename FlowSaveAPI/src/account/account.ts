import { User } from "../user/user";

class Account {
  constructor(
    public id: number,
    public name: string,
    public balance: number,
    public user: User
  ) {}
}
