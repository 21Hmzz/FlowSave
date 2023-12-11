import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Account from '../views/Account.vue'
import Transactions from "@/views/Transactions.vue";
import Transaction from "@/views/Transaction.vue";
import Settings from "@/views/Settings.vue";
import UserSettings from "@/views/UserSettings.vue";
import Budget from "@/views/Budget.vue";
import AddAccount from "@/components/AddAccount.vue";
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
            beforeEnter: (to, from, next) => {
                if (user.verifyToken()) {
                    toast.info('Vous êtes déjà connecté');
                    return next({ name: 'dashboard' });
                }
                return next();
            }
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            beforeEnter : function (to, from, next) {
                authMiddleWare(to, from, next);
                document.title = 'FlowSave - Dashboard';
            }

        },
        {
            path: '/account',
            name: 'account',
            component: Account,
            beforeEnter: function (to, from, next) {
                authMiddleWare(to, from, next);
                document.title = 'FlowSave - Comptes';
            }
        },
        {
            path: '/account/transactions',
            component: Transactions,
            beforeEnter: function (to, from, next) {
                authMiddleWare(to, from, next);
                document.title = 'FlowSave - Transactions';
            }
        },
        {
            path: '/account/settings',
            component: Settings,
            beforeEnter: function (to, from, next) {
                authMiddleWare(to, from, next);
                document.title = 'FlowSave - Paramètres';
            }
        },
        {
            path: '/account/:id',
            name: 'account-id',
            component: Account,
            beforeEnter: function (to, from, next) {
                authMiddleWare(to, from, next);
                document.title = 'FlowSave - Compte';
            }
        },
        {
            path: '/budget/:id/:isCustom',
            name: 'budget-id',
            component: Budget,
            props: true,
            beforeEnter: function (to, from, next) {
                authMiddleWare(to, from, next);
                document.title = 'FlowSave - Budget';
            }
        },
        {
            path: '/budget',
            name: 'budget',
            component: Budget,
            props: true,
            beforeEnter: function (to, from, next) {
                authMiddleWare(to, from, next);
                document.title = 'FlowSave - Budget';
            }

        },
        {
            path: '/add-account',
            name: 'add-account',
            component: AddAccount,
            beforeEnter: function (to, from, next) {
                authMiddleWare(to, from, next);
                document.title = 'FlowSave - Ajouter un compte';
            }
        },
        {
            path: '/transaction/:id',
            name: 'transaction-id',
            component: Transaction,
            props: true,
            beforeEnter: function (to, from, next) {
                authMiddleWare(to, from, next);
                document.title = 'FlowSave - Transaction';
            }
        },
        {
            path:'/settings/security',
            name: 'security',
            component: UserSettings,
            beforeEnter: function (to, from, next) {
                authMiddleWare(to, from, next);
                document.title = 'FlowSave - Sécurité';
            }
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
