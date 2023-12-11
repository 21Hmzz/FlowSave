<script lang="ts" setup>
import Navbar from '../components/Navbar.vue';
import SideBar from "@/components/SideBar.vue";
import {onMounted, ref, watch} from "vue";
import {useToast} from "vue-toast-notification";
import User from "@/tools/User";

interface Account {
  name: string,
  type: string,
  companyName: string,
  nameBank: string,
}

const $toast = useToast();
const token = <string>localStorage.getItem('token');
const user = new User(token || '');
const account = ref<Account>({
  name: '',
  type: '',
  companyName: '',
  nameBank: '',
});
const tmpAccount = ref<Account>({
  name: '',
  type: '',
  companyName: '',
  nameBank: '',
});
const unsavedAlert = ref(false);
const selectedAccount = ref(localStorage.getItem('selectedAccount') || '');
const newCategory = ref('');

onMounted(async () => {
  await user.getInfos();

  if (selectedAccount.value !== '') {
    //@ts-ignore
    account.value = user.infos.accounts.find((account: any) => account.id === parseInt(selectedAccount.value));
    tmpAccount.value = { ...account.value };
  }
  console.log(tmpAccount.value);
  watch(account.value, (newValue) => {
    console.log(newValue);
    if (
        newValue.name !== tmpAccount.value.name ||
        newValue.type !== tmpAccount.value.type ||
        newValue.companyName !== tmpAccount.value.companyName ||
        newValue.nameBank !== tmpAccount.value.nameBank
    ) {
      unsavedAlert.value = true;
      console.log('changed');
    }
  });
})


function changeAccount() {
  if (selectedAccount.value !== '') {
    //@ts-ignore
    account.value = user.infos.accounts.find((account: any) => account.id === parseInt(selectedAccount.value));
  }
}

function addCategory() {
  if (user.infos.forfait !== 'free') {
    if (newCategory.value !== '') {
      //@ts-ignore
      user.infos.customCategories.push({name: newCategory.value, type: 'expense'});
      newCategory.value = '';
    }
  } else {
    if (user.infos.customCategories.length < 10) {
      if (newCategory.value !== '') {
        //@ts-ignore
        user.infos.customCategories.push({name: newCategory.value, type: 'expense'});
        newCategory.value = '';
      }
    } else {
      $toast.open({
        message: 'Vous avez atteint le nombre maximum de catégories pour votre forfait',
        type: 'warning'
      });
    }
  }
}


function saveAccount() {
  user.save();
}
function deleteAccount() {
  //@ts-ignore
  user.infos.accounts.splice(user.infos.accounts.indexOf(account.value), 1);
  user.save();
  //@ts-ignore
  localStorage.setItem('selectedAccount',user.infos.accounts[0].id);
  window.location.reload();
}
</script>


<template>

  <div class="row overflow-hidden h-screen">
    <Navbar :infos="user.infos"/>
    <div class="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <SideBar/>
      <suspense>
        <div class="relative w-screen overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900">
          <div
              class="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center w-screen gap-5 ">
              <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">
                Paramètres du compte : {{ account.name }}
              </h1>
              <div class="w-96">
                <select
                    class="block text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    aria-label="Default select example" v-model="selectedAccount" @change="changeAccount">

                  <option :selected="selectedAccount === ''" value="">
                    Choix du compte
                  </option>
                  <option v-for="account in user.infos.accounts" :key="account.id" :value="account.id">
                    {{ account.name }}
                  </option>

                </select>
              </div>
            </div>
            <div class="flex items-center">
              <button
                  class="flex mx-3 items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-blue"
                  aria-label="Delete"
                  @click="deleteAccount"
              >
                <span>Supprimer</span>
              </button>
              <button
                  class="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                  aria-label="Edit"
                  @click="saveAccount"
              >
                <span>Enregistrer</span>

              </button>
            </div>
          </div>
          <div v-if="unsavedAlert" class="m-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
               role="alert">
            <strong class="font-bold">Attention !</strong>
            <span class="block sm:inline"> Vous avez des modifications non enregistrées.</span>
            <small>
              Pensez à enregistrer avant de quitter la page.
            </small>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg @click="unsavedAlert = false" class="fill-current h-6 w-6 text-red-500" role="button"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Close</title>
                  <path
                      d="M14.348 14.849a1 1 0 01-1.414 0L10 11.414l-2.93 2.93a1 1 0 01-1.414-1.414l2.93-2.93-2.93-2.93a1 1 0 111.414-1.414l2.93 2.93 2.93-2.93a1 1 0 111.414 1.414l-2.93 2.93 2.93 2.93a1 1 0 010 1.414z">
                  </path>
                </svg>
              </span>


          </div>
          <div class="flex flex-col flex-wrap w-full sm:flex-row">
            <div class="p-4 w-full sm:w-1/2 flex flex-col ">
              <div class="p-4  bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                  <div class="col-span-2">
                    <label class="text-gray-700 dark:text-gray-200" for="username">Nom du compte</label>
                    <input
                        v-model="account.name"
                        type="text"
                        id="name"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray form-input"
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="text-gray-700 dark:text-gray-200" for="username">Type de compte</label>
                    <select
                        v-model="account.type" id="type" name="type" autocomplete="type"
                        class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option value="personnel">Personnel</option>
                      <option value="pro">Entreprise</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="p-4 mt-3 bg-white rounded-lg shadow-md dark:bg-gray-800" v-if="account.type === 'pro'">
                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                  <div class="col-span-2">
                    <label class="text-gray-700 dark:text-gray-200" for="username">Nom de l'entreprise</label>
                    <input
                        v-model="account.companyName"
                        type="text"
                        id="username"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray form-input"
                    />
                  </div>

                </div>
              </div>
            </div>
            <div class="p-4 w-full sm:w-1/2 flex flex-col ">
              <div class="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                  <div class="col-span-2">
                    <label class="text-gray-700 dark:text-gray-200" for="nameBank">
                      Nom de la banque
                    </label>
                    <input
                        v-model="account.nameBank"
                        type="text"
                        id="username"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray form-input"
                    />
                  </div>
                </div>
              </div>
              <div class="p-4 bg-white mt-3 rounded-lg shadow-md dark:bg-gray-800">
                <h3 class="text-lg  font-medium text-gray-900 dark:text-gray-200">
                  Mes catégories de dépenses
                </h3>
                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2" v-for="category in user.infos.customCategories">
                  <div class="col-span-2 flex justify-between items-center">
                  <span class="text-gray-700 dark:text-gray-200 font-medium">
                    {{ category.name }}
                  </span>
                    <div class="flex items-center space-x-4">
                      <input type="color" v-model="category.color" class="w-8 h-8 rounded-full"/>

                      <button
                          class="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-blue"
                          aria-label="Delete"
                          @click="user.infos.customCategories.splice(user.infos.customCategories.indexOf(category), 1)"
                      >
                        <span>Supprimer</span>
                      </button>
                      <button
                          class="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                          aria-label="Edit"

                      >
                        <span>Modifier</span>
                      </button>
                    </div>


                  </div>

                </div>
                <div class="col-span-2 mt-2 flex justify-between items-center">
                  <input
                      v-model="newCategory"
                      placeholder="Nouvelle catégorie"
                      type="text"
                      id="username"
                      class="block w-3/4 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray form-input"
                  />
                  <button class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          @click="addCategory">
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </suspense>
    </div>
  </div>
</template>


