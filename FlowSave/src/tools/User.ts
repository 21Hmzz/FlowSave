import Axios from "@/tools/Axios";
import CryptoJS from 'crypto-js';

type Category = {
    id: number,
    name: string,
    maxAmount: number,
    isCustom: boolean,
    isExpense: boolean,
    isIncome: boolean,
    isDeleted: boolean,
    isDefault: boolean,
    createdAt: Date,
    updatedAt: Date,
    transactions: any[],
    userId: number,
    categoryId: number,
    customCategoryId: number,
    type: string,
    color: string,
}
type Account = {
    id: number,
    name: string,
    balance: number,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date,
    transactions: any[],
    userId: number,
    saves: any[],
}
type Transaction = {
    id: number,
    name: string,
    amount: number,
    type: string,
    comments: string,
    createdAt: Date,
    updatedAt: Date,
    accountId: number,
    categoryId: number,
    customCategoryId: number,
    account: Account,
    category: Category,
    customCategory: Category,

}
type userInfos = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    step: number,
    salaire: number,
    forfait: string,
    save: number,
    createdAt: Date,
    updatedAt: Date,
    accounts: Account[],
    customCategories: Category[],
    allBasicCategories: Category[],
    transactions: Transaction[],
    budgets: any[],
    userId: number,
    categoryId: number,
    customCategoryId: number,
    type: string,
}

class User {

    public infos: userInfos = {} as userInfos;
    private token: string;

    constructor(
        token: string
    ) {
        this.token = token;
        if (this.verifyToken()) {
            this.getInfos();
        } else {
            localStorage.removeItem('token');
        }
    }

    public getInfos() {
        return Axios.get('/user/', {
            headers: {
                Authorization: `${this.token}`
            }
        }).then((res) => {
            this.infos = res.data.info;
            return res.data.info;
        }).catch((err) => {
            console.error(err);
        });
    }

    public verifyToken() {
        if (!this.token) {
            return false;
        }
        let token = JSON.parse(atob(this.token.split('.')[1]));
        let exp = token.exp;
        let date = new Date();
        let timestamp = date.getTime() / 1000;
        return timestamp < exp;
    }

    public logout() {
        localStorage.removeItem('token');
        return true;
    }

    public async changePassword(newPassword: string) {
        const api = await Axios.put('/user/password', {
            password: CryptoJS.SHA1(newPassword).toString()
        }, {
            headers: {
                Authorization: `${this.token}`
            }
        }).then(async (res) => {
            await this.getInfos();
            return res.data.info;
        }).catch((err) => {
            console.error(err);
        });

        return !!api;
    }

    public getAccounts() {
        let account;
        return account = this.infos.accounts;
    }

    public getAccount(id: number) {
        let account;
        return account = this.infos.accounts.find((account: Account) => {
            return account.id === id;
        });
    }


    public async getTransaction(id: number) {
        let transaction;

        try {
            await this.getInfos();

            let accounts = this.getAccounts();
            accounts.forEach((account: Account) => {
                const foundTransaction = account.transactions.find((transaction: Transaction) => {
                    return transaction.id === id;
                });
                if (foundTransaction) {
                    transaction = foundTransaction;
                    return;
                }
            });
        } catch (error) {
            console.error(error);
        }

        return transaction;
    }

    public updateTransaction(updatedTransaction: Transaction): Transaction | undefined {
        let accounts = this.getAccounts();
        let foundTransaction: Transaction | undefined;

        accounts.forEach(async (account: Account) => {
            const found = account.transactions.find((transaction: Transaction) => {
                return transaction.id === updatedTransaction.id;
            });

            if (found) {
                foundTransaction = found;
                console.log(foundTransaction);
                this.save();
            }
        });

        return foundTransaction;
    }


    public getBudgets() {
        let budget: any = [];
        let accounts = this.getAccounts();
        accounts.forEach((account: Account) => {
            account.transactions.forEach((transac: Transaction) => {
                budget.push(transac);
            });
        });
        return budget.filter((transac: Transaction) => {
            return transac.type === 'expense';
        });
    }

    public getCategories() {
        let category: any = [];

        this.infos.customCategories.forEach((cat: any) => {
            category.push(cat);
        });
        this.infos.allBasicCategories.forEach((cat: any) => {
            category.push(cat);
        });
        return category;
    }

    public getCategory(id: number, isCustom: boolean) {
        let category;

        if (isCustom) {
            category = this.infos.customCategories.find((cat: any) => {
                return cat.id === id;
            });
        } else {
            category = this.infos.allBasicCategories.find((cat: any) => {
                return cat.id === id;
            });
        }
        return category;
    }

    public getDepenses(idCategory: number, isCustom: boolean) {
        let depenses: any = [];
        let accounts = this.getAccounts();
        accounts.forEach((account: Account) => {
            account.transactions.filter((category: Category) => {
                if (isCustom) {
                    return category.customCategoryId === idCategory;
                } else {
                    return category.categoryId === idCategory;
                }
            }).forEach((transac: Category) => {
                depenses.push(transac);
            });
        });

        return depenses.filter((transac: Transaction) => {
            return transac.type === 'expense';
        });
    }

    public updateCategoryBudget(id: number, newMax: number, isCustom: boolean) {
        let category;
        if (isCustom) {

            category = this.infos.customCategories.find((cat: any) => {
                return cat.id === id;
            });
        } else {
            category = this.infos.allBasicCategories.find((cat: any) => {
                return cat.id === id;
            });
        }
        if (!category) {
            return;
        }
        category.maxAmount = newMax
        console.log(category.maxAmount);
        return category;
    }

    public async save() {
        const api = await Axios.put('/user/edit', {
            user: this.infos
        }, {
            headers: {
                Authorization: `${this.token}`
            }
        }).then(async (res) => {
            await this.getInfos();
            return res.data.info;
        }).catch((err) => {
            console.error(err);
        });

        return !!api;
    }


}

export default User;
