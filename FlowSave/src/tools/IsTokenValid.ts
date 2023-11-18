import Axios from './Axios';

export const isTokenValid = async (token: string) => {
    const expiration = localStorage.getItem('expireTime');
    const now = new Date().getTime() / 1000;
    if (expiration && parseInt(expiration) - now > 0) {
        return true;
    }
    return false;
};