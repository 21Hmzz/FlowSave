import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Account from '../views/Account.vue'
import Transactions from "@/views/Transactions.vue";
import Transaction from "@/views/Transaction.vue";
import Settings from "@/views/Settings.vue";
import Budget from "@/views/Budget.vue";
import {useToast} from 'vue-toast-notification'
import User from "@/tools/User";

const toast = useToast();
const token = localStorage.getItem('token');
const user = new User(token ? token : '');


// @ts-ignore
function authMiddleWare(to, from, next) {
    if(from.name === 'login'){
        return next();
    }
    let isAuth = user.verifyToken();
    if (!isAuth) {
        toast.error('Vous devez être connecté pour accéder à cette page');
        return next({ name: 'login' });
    }

    return next();
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/start',
            name: 'start',
            component: Register,
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            beforeEnter: authMiddleWare
        },
        {
            path: '/account',
            name: 'account',
            component: Account,
            beforeEnter: authMiddleWare
        },
        {
            path: '/account/transactions',
            component: Transactions,
            beforeEnter: authMiddleWare
        },
        {
            path: '/account/settings',
            component: Settings,
            beforeEnter: authMiddleWare
        },
        {
            path: '/account/:id',
            name: 'account-id',
            component: Account,
            beforeEnter: authMiddleWare
        },
        {
            path: '/budget/:id/:isCustom',
            name: 'budget-id',
            component: Budget,
            props: true,
            beforeEnter: authMiddleWare
        },
        {
            path: '/budget',
            name: 'budget',
            component: Budget,
            props: true,
            beforeEnter: authMiddleWare

        },
        {
            path: '/transaction/:id',
            name: 'transaction-id',
            component: Transaction,
            props: true,
            beforeEnter: authMiddleWare
        },
        {
            path: '/logout',
            name: 'logout',
            component: Login,
            beforeEnter: (to, from, next) => {
                user.logout();
                toast.success('Vous êtes maintenant déconnecté');
                return next({ name: 'login' });
            }
        }
    ]
})



export default router
