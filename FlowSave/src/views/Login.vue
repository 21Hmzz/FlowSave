<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import Axios from '../tools/Axios';

const $toast = useToast();
const router = useRouter();
const email = ref('');
const password = ref('');

function login(email: string, password: string) {
    if (!email || !password) {
        $toast.open({
            message: 'Veuillez remplir tous les champs',
            type: 'error',
            dismissible: true,
            pauseOnHover: true,
            duration: 3000
        });
        return;
    }

    Axios.post('/auth/login', {
        email: email,
        password: password
    }).then((response: any) => {
        $toast.open({
            message: 'Connexion réussie',
            type: 'success',
            dismissible: true,
            pauseOnHover: true,
            duration: 3000
        });
        localStorage.setItem('token', response.data.token);
        router.push('/dashboard');
    }).catch((error: any) => {
        $toast.open({
            message: 'Une erreur est survenue',
            type: 'error',
            dismissible: true,
            pauseOnHover: true,
            duration: 3000
        });
    });
}
</script>

<template>
    <div class="login">
        <h2>
            Connectez vous
        </h2>

        <div class="form">
            <form action="">
                <div>
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" v-model="email" />
                </div>
                <div>
                    <label for="password">Mot de passe</label>
                    <input type="password" name="password" id="password" v-model="password" />
                </div>
                <div>
                    <button type="submit" @click.prevent="login(email, password)">
                        Se connecter
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>