
export interface AccountService {
    getTransactions(id: number, userId: number): object | null;
    getAccount(id: number): object | null;
    getAccounts(id: number): object | null;
    addTransactions(id: number, amount: number, type: string, description: string, date: string): object | null;
    getAllAccounts(id: number): object | null;
}
