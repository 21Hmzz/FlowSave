<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import Axios from '../tools/Axios';

const $toast = useToast();
const router = useRouter();
const name = ref('');
const firstname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

function register(name: string, firstname: string, email: string, password: string, confirmPassword: string) {
    if (!name || !firstname || !email || !password || !confirmPassword) {
        $toast.open({
            message: 'Veuillez remplir tous les champs',
            type: 'error',
            dismissible: true,
            pauseOnHover: true,
            duration: 3000
        });
        return;
    }

    if (password === confirmPassword) {
        Axios.post('/auth/register', {
            name: name,
            firstname: firstname,
            email: email,
            password: password
        }).then((response: any) => {
            $toast.open({
                message: 'Inscription réussie',
                type: 'success',
                dismissible: true,
                pauseOnHover: true,
                duration: 3000
            });
        }).catch((error: any) => {
            $toast.open({
                message: 'Une erreur est survenue',
                type: 'error',
                dismissible: true,
                pauseOnHover: true,
                duration: 3000
            });
        });
    } else {
        $toast.open({
            message: 'Les mots de passe ne correspondent pas',
            type: 'error',
            dismissible: true,
            pauseOnHover: true,
            duration: 3000
        });
    }
}





</script>


<template>
    <div class="header-home" @click="router.push('/')" style="cursor: pointer;">
        <img src="../assets/png/logo-no-background.png" alt="Logo de FlowSave" />
    </div>
    <h2 class="title">
        Inscrivez vous pour commencer à économiser !
    </h2>
    <div class="auth">

        <div class="form">
            <form action="">
                <div>
                    <label for="name">Nom</label>
                    <input type="text" name="name" id="name" v-model="name" />
                </div>
                <div>
                    <label for="firstname">Prénom</label>
                    <input type="text" name="firstname" id="firstname" v-model="firstname" />
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" v-model="email" />
                </div>
                <div>
                    <label for="password">Mot de passe</label>
                    <input type="password" name="password" id="password" v-model="password" />
                </div>
                <div>
                    <label for="password">Confirmer le mot de passe</label>
                    <input type="password" name="password" id="password" v-model="confirmPassword" />
                </div>
                <div>
                    <button type="submit" @click.prevent="register(name, firstname, email, password, confirmPassword)">
                        S'inscrire
                    </button>

                </div>

            </form>
        </div>
        <div class="login">
            <p>Déjà inscrit ? <a href="/login">Se connecter</a></p>
        </div>

    </div>
</template>
<style>
@media screen and (min-width:900px) {
    .auth {
        display: flex;
        flex-direction: row;
        height: 100vh;
    }

    .title {
        margin-top: 0;
        padding: 0 10%;
        font-size: 28px;
        text-align: center;
        border-bottom: 1px solid #00000039;

        margin-bottom: 20px;
    }

    .form {
        width: 60%;
        padding: 4%;
        height: fit-content;
    }

    .login {
        width: 40%;
        padding: 2%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: fit-content;
        border-left: 1px solid #000;
    }

    .login p {
        font-size: 28px;

    }

    .form form {
        display: flex;
        flex-direction: column;
        border-radius: 10px;
    }

    .form form div {
        display: flex;
        flex-direction: column;
        margin: 10px;
    }

    .form form div label {
        margin-bottom: 5px;
    }

    .form form div input {
        border-radius: 5px;
        border: 1px solid #000;
        padding: 5px;
        min-width: 300px;
    }

    .form form div button {
        border-radius: 5px;
        border: 1px solid #000;
        padding: 5px;
        min-width: 300px;
        background-color: #000;
        color: #fff;
    }

    .form form div button:hover {
        background-color: #fff;
        color: #000;
        cursor: pointer;
        transition: 0.5s;
    }



}
</style>