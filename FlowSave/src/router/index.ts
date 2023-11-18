import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Account from '../views/Account.vue'
import { isTokenValid } from '@/tools/IsTokenValid'
import { useToast } from 'vue-toast-notification'

const toast = useToast();

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
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (token) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (token) {
          if (isTokenValid(token)) {
            next({ name: 'dashboard' })
          } else {
            toast.error('Votre session a expiré, veuillez vous reconnecter')
            next()
          }
        } else {
          next()
        }
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next({ name: 'login' })
        } else {
          if (isTokenValid(token)) {
            next()
          } else {
            toast.error('Votre session a expiré, veuillez vous reconnecter')
            next({ name: 'login' })
          }
        }
      }
    },
    {
      path: '/account',
      name: 'account',
      component: Account,

    },
    {
      path: '/account/:id',
      name: 'account-id',
      component: Account,
    },
    {
      path: '/budget',
      name: 'budget',
      component: () => import('../views/Budget.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (to, from, next) => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('step')
        next({ name: 'home' })
      }
    }

  ]
})

export default router
