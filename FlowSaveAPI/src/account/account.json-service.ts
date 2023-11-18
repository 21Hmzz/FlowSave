import { AccountService } from "./account.service";


export class AccountJSONService implements AccountService {
    getTransactions(id: number, userId: number): object | null {
        var fs = require('fs');
        var database = JSON.parse(fs.readFileSync('./src/database/database.json'));
        var accounts = database.accounts;
        var user_accounts = database.user_accounts.filter(
            (user_account: any) => user_account.userID === userId
        );

        switch (id) {
            case 1:

                let temp = user_accounts.find((user_account: any) => user_account.type === 'perso');
                let account = accounts.find((account: any) => account.id === temp.accountID);
                if (!account) {
                    throw new Error('Account not found');
                }
                var transactions = database.transactions.filter(
                    (transaction: any) => transaction.accountID === account.id
                );
                return Object.assign({}, transactions);
            case 2:
                let temp2 = user_accounts.find((user_account: any) => user_account.type === 'pro');
                let account2 = accounts.find((account: any) => account.id === temp2.accountID);
                if (!account2) {
                    throw new Error('Account not found');
                }
                var transactions2 = database.transactions.filter(
                    (transaction: any) => transaction.accountID === account2.id
                );
                return Object.assign({}, transactions2);
            default:
                let temp3 = user_accounts.find((user_account: any) => user_account.type === 'save');
                let account3 = accounts.find((account: any) => account.id === temp3.accountID);
                if (!account3) {
                    throw new Error('Account not found');
                }
                var transactions3 = database.transactions.filter(
                    (transaction: any) => transaction.accountID === account3.id
                );
                return Object.assign({}, transactions3);
        }


    }
    getAccount(id: number): object | null {
        var fs = require('fs');
        var database = JSON.parse(fs.readFileSync('./src/database/database.json'));
        var accounts = database.accounts;
        var account = accounts.find((account: any) => account.id === id);
        if (!account) {
            throw new Error('Account not found');
        }
        return account;
    }
    getAccounts(id: number): object | null {
        var fs = require('fs');
        var database = JSON.parse(fs.readFileSync('./src/database/database.json'));
        var user_accounts = database.user_accounts;
        var user_account = user_accounts.filter(
            (user_account: any) => user_account.userID === id
        );
        var accounts = database.accounts;
        for (var i = 0; i < user_account.length; i++) {
            user_account[i] = accounts.find(
                (account: any) => account.id === user_account[i].accountID
            );
        }
        return Object.assign({}, user_account);
    }
    addTransactions(id: number, amount: number, type: string, description: string, date: string): object | null {
        var fs = require('fs');
        var database = JSON.parse(fs.readFileSync('./src/database/database.json'));
        var accounts = database.accounts;
        var account = accounts.find((account: any) => account.id === id);
        if (!account) {
            throw new Error('Account not found');
        }
        var account_balance = account.balance;
        if (type === 'expense') {
            account_balance = account_balance - amount;
        } else if (type === 'income') {
            account_balance = account_balance + amount;
        } else if (type === 'save') {
            account_balance = account_balance - amount;
            if (account.actualSave == null) {
                account.actualSave = 0;
            }
            account.actualSave = account.actualSave + amount;
        }
        account.balance = account_balance;
        var transactions = database.transactions;
        var transaction = {
            id: transactions.length + 1,
            accountID: id,
            amount: amount,
            type: type,
            description: description,
            date: date
        };
        transactions.push(transaction);
        fs.writeFileSync('./src/database/database.json', JSON.stringify(database));
        return Object.assign({}, transaction);
    }
    getAllAccounts(id: number): object | null {
        var fs = require('fs');
        var database = JSON.parse(fs.readFileSync('./src/database/database.json'));
        var user_accounts = database.user_accounts.filter(
            (user_account: any) => user_account.userID === id
        );
        //get alls account based on user_accounts.accountID
        var accounts = database.accounts;
        for (var i = 0; i < user_accounts.length; i++) {
            user_accounts[i] = accounts.find(
                (account: any) => account.id === user_accounts[i].accountID
            );
        }
        return Object.assign({}, user_accounts);



    }
}
