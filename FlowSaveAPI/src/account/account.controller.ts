import { AccountService } from "./account.service";

export class AccountController {
    constructor(private accountService: AccountService) { }

    getTransactions(id: number, userId: number): object | null {
        return this.accountService.getTransactions(id, userId);
    }
    getAccount(id: number): object | null {
        return this.accountService.getAccount(id);
    }
    getAccounts(id: number): object | null {
        return this.accountService.getAccounts(id);
    }
    addTransactions(id: number, amount: number, type: string, description: string, date: string): object | null {
        return this.accountService.addTransactions(id, amount, type, description, date);
    }
    getAllAccounts(id: number): object | null {
        return this.accountService.getAllAccounts(id);
    }

}
