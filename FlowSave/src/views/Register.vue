<script lang="ts" setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import Axios from '../tools/Axios';

const $toast = useToast();
const router = useRouter();
const lastName = ref('');
const firstName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const terms = ref(false);

function register(lastName: string, firstName: string, email: string, password: string, confirmPassword: string, terms: boolean) {
  if (!lastName || !firstName || !email || !password || !confirmPassword) {
    $toast.open({
      message: 'Veuillez remplir tous les champs',
      type: 'error',
      dismissible: true,
      pauseOnHover: true,
      duration: 3000
    });
    return;
  }
  if (!terms) {
    $toast.open({
      message: 'Veuillez accepter les conditions d\'utilisation',
      type: 'error',
      dismissible: true,
      pauseOnHover: true,
      duration: 3000
    });
    return;
  }

  if (password === confirmPassword) {
    Axios.post('/auth/register', {
      lastName: lastName,
      firstName: firstName,
      email: email,
      password: password,
    }).then((response: any) => {
      $toast.open({
        message: 'Inscription réussie',
        type: 'success',
        dismissible: true,
        pauseOnHover: true,
        duration: 3000
      });
      router.push('/login');
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
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img class="w-20  mr-2" src="../assets/png/logo-no-background.png" alt="Logo">

      </a>
      <div
          class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Commencez à gérer vos flux :)
          </h1>
          <form class="space-y-4 md:space-y-6" action="#">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input type="email" name="email" id="email"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder="name@company.com" required v-model="email">
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de
                passe</label>
              <input type="password" name="password" id="password" placeholder="••••••••"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required v-model="password">
            </div>
            <div>
              <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmer
                le mot de passe</label>
              <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required v-model="confirmPassword">
            </div>
            <div>
              <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prénom</label>
              <input type="text" name="firstName" id="firstName" placeholder=""
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required v-model="firstName">
            </div>
            <div>
              <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
              <input type="text" name="lastName" id="lastName" placeholder=""
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     required v-model="lastName">
            </div>

            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="terms" aria-describedby="terms" type="checkbox"
                       class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                       required v-model="terms">
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-light text-gray-500 dark:text-gray-300">J'accepte les <a
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">
                  conditions d'utilisation
                </a></label>
              </div>
            </div>
            <button type="submit"
                    @click.prevent="register(lastName, firstName, email, password, confirmPassword, terms)"
                    class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              S'inscrire
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Déja un compte ? <a href="/login"
                                  class="font-medium text-primary-600 hover:underline dark:text-primary-500">Connectez
              vous</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
<style>
@media screen and (min-width: 900px) {
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