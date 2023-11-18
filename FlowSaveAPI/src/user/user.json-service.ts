import { User } from "./user";
import { UserService } from "./user.service";

export class UserJSONService implements UserService {
  getUser(id: number): User | null {
    var fs = require("fs");
    var database = JSON.parse(fs.readFileSync("./src/database/database.json"));
    var users = database.users;
    var user = users.find((user: any) => user.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  getInfos(id: number): object | null {
    var fs = require("fs");
    var infos = [] as any;
    var database = JSON.parse(fs.readFileSync("./src/database/database.json"));
    var users = database.users;
    var user = users.find((user: any) => user.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    var user_accounts = database.user_accounts;
    var user_account = user_accounts.find(
      (user_account: any) => user_account.userID === id
    );
    var account = database.accounts.find(
      (account: any) => account.id === user_account.accountID
    );
    if (!account) {
      return [];
    }
    var infostmp = {
      id: user.id,
      email: user.email,
      name: user.name,
      balance: account.balance,
      currency: account.currency,
      salary: account.salary,
      save: account.save
    };

    return infostmp;
  }

  getSteps(id: number): number | null {
    var fs = require("fs");
    var database = JSON.parse(fs.readFileSync("./src/database/database.json"));
    var steps = database.steps;
    var step = steps.find((step: any) => step.userID === id);
    if (!step) {
      throw new Error("Steps not found");
    }
    return step;
  }

  setSalary(id: number, salary: number): number | null {
    var fs = require("fs");
    var database = JSON.parse(fs.readFileSync("./src/database/database.json"));
    var users = database.users;
    var user = users.find((user: any) => user.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    var user_accounts = database.user_accounts;
    var user_account = user_accounts.find(
      (user_account: any) => user_account.userID === id
    );
    var account = database.accounts.find(
      (account: any) => account.id === user_account.accountID
    );
    if (!account) {
      var newAccount = {
        id: database.accounts.length + 1,
        name: "Salary",
        balance: 0,
        currency: "EUR",
        salary: 0,
      };
      database.accounts.push(newAccount);
      user_account.accountID = newAccount.id;
      var steps = database.steps;
      var step = steps.find((step: any) => step.userID === id);
      step.stepID = 2;
      fs.writeFileSync(
        "./src/database/database.json",
        JSON.stringify(database)
      );
    } else {
      account.salary = salary;
      var steps = database.steps;
      var step = steps.find((step: any) => step.userID === id);
      step.stepID = 2;
      fs.writeFileSync(
        "./src/database/database.json",
        JSON.stringify(database)
      );
    }

    return account.salary;
  }
  setSave(id: number, save: number): number | null {
    var fs = require("fs");
    var database = JSON.parse(fs.readFileSync("./src/database/database.json"));
    var users = database.users;
    var user = users.find((user: any) => user.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    var user_accounts = database.user_accounts;
    var user_account = user_accounts.find(
      (user_account: any) => user_account.userID === id
    );
    var account = database.accounts.find(
      (account: any) => account.id === user_account.accountID
    );
    if (!account) {
      var newAccount = {
        id: database.accounts.length + 1,
        name: "Save",
        balance: 0,
        currency: "EUR",
        save: 0,
      };
      database.accounts.push(newAccount);
      user_account.accountID = newAccount.id;
      var steps = database.steps;
      var step = steps.find((step: any) => step.userID === id);
      step.stepID = 3;
      fs.writeFileSync(
        "./src/database/database.json",
        JSON.stringify(database)
      );
    } else {
      account.save = save;
      var steps = database.steps;
      var step = steps.find((step: any) => step.userID === id);
      step.stepID = 3;
      fs.writeFileSync(
        "./src/database/database.json",
        JSON.stringify(database)
      );
    }

    return account.save;
  }
  setStep(id: number, step: number): number | null {
    var fs = require("fs");
    var database = JSON.parse(fs.readFileSync("./src/database/database.json"));
    var steps = database.steps;
    var stepValue = steps.find((stepValue: any) => stepValue.userID === id);
    if (!step) {
      throw new Error("Steps not found");
    }
    stepValue.stepID = step;
    fs.writeFileSync("./src/database/database.json", JSON.stringify(database));
    return stepValue.stepID;
  }
}
