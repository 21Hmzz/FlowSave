import Axios from "./Axios";

export const UserData = async (token: string) => {
    let response = await Axios.get('/account', {
        headers: {
            Authorization: `${token}`
        }
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error);
    });
    const account = await response;
    return account;
}

export const UserTransactions = async (token: string, selectedAccount: string) => {
    if (selectedAccount == "Compte perso") {
        const response = await Axios.get(`/account/1/transactions`, {
            headers: {
                Authorization: `${token}`
            }
        }).then((response) => {
            return response.data;
        }).catch((error) => {
            console.log(error);
        });
        const transactions = await response;
        return transactions;
    }
    else if (selectedAccount == "Compte pro") {
        const response = await Axios.get(`/account/2/transactions`, {
            headers: {
                Authorization: `${token}`
            }
        }).then((response) => {
            return response.data;
        }).catch((error) => {
            console.log(error);
        });
        const transactions = await response;
        return transactions;
    }
    else {
        const response = await Axios.get(`/account/3/transactions`, {
            headers: {
                Authorization: `${token}`
            }
        }).then((response) => {
            return response.data;
        }).catch((error) => {
            console.log(error);
        });
        const transactions = await response;
        return transactions;
    }

}