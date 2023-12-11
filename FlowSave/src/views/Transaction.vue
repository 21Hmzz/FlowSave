<script lang="ts" setup>

import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import User from "@/tools/User";
import SideBar from "@/components/SideBar.vue";
import Navbar from "@/components/Navbar.vue";
import moment from "moment";
import {useToast} from "vue-toast-notification";

const route = useRoute();
const $toast = useToast();
const IdTransaction: number = parseInt(route.params.id.toString());
const token = localStorage.getItem('token') || '';
const user = new User(token);
const userInfos = ref<any>({});
const transaction = ref<any>({});
const transactionCategory = ref<any>({});
onMounted(async () => {
  userInfos.value = await user.getInfos();
  transaction.value = await user.getTransaction(IdTransaction);
  transactionCategory.value = user.getCategory(transaction.value.categoryId, !transaction.value.categoryId);
});

const saveTransaction = async () => {
  await user.updateTransaction(transaction.value);
  $toast.open({
    message: 'Transaction enregistrée',
    type: 'success',
    position: 'top-right',
    duration: 5000,
  });
}

</script>

<template>
  <div class="row overflow-hidden h-screen">
    <Navbar :infos="userInfos"/>

    <div class="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <SideBar/>


      <Suspense>

        <div class="relative  w-screen overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900">
          <div
              class="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex justify-between items-center w-full ">

              <h3 class="first-letter:uppercase">Transaction n°{{ IdTransaction }}</h3>
              <h3>
                {{ moment(transaction.createdAt).format('DD/MM/YYYY') }}
              </h3>
            </div>
          </div>
          <div class="flex ">


            <div
                class="w-1/3 mt-3 ml-3 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

              <div class="px-5 pb-5 mt-4">
                <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                  <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white first-letter:uppercase">
                    {{ transaction.name }}
                  </h5>
                </a>
                <div class="flex items-center mt-2.5 mb-5">
                  <span
                      class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800"
                  >
                    {{ transactionCategory.name }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-3xl font-bold text-gray-900 dark:text-white">
                    {{ Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(transaction.amount) }}
                  </span>

                </div>
              </div>
            </div>
            <div
                class="w-full mt-3 ml-3 mr-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

              <div class="px-5 pb-5 mt-4">
                <h3 class="text-sm font-semibold tracking-tight text-gray-900 dark:text-white first-letter:uppercase">
                  Ajoutez des notes, des photos, des pièces jointes, des tags, des personnes et plus encore à cette
                  transaction.
                </h3>
                <div class="flex flex-col items-center w-full mt-2.5 mb-5 ">

                  <div class="mt-1 w-full flex items-center gap-1.5">
                    <label for="name" class="block w-1/4  text-sm font-medium text-gray-700 dark:text-gray-200">
                      Nom
                    </label>
                    <input type="text" name="name" id="name" autocomplete="given-name"
                           class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                           v-model="transaction.name">
                  </div>
                  <div class="mt-1 w-full flex items-center gap-1.5">
                    <label for="amount" class="w-1/4 block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Montant
                    </label>
                    <input type="number" name="amount" id="amount" autocomplete="given-name"
                           class="w-3/4 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                           v-model="transaction.amount">
                  </div>
                  <div class="mt-1 w-full flex items-center gap-1.5">
                    <label for="date" class=" w-1/4  block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Date
                    </label>
                    <input type="date" name="date" id="date" autocomplete="given-name"
                           class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                           v-model="transaction.createdAt">
                  </div>
                  <div class="mt-1 w-full flex items-center gap-1.5">
                    <label for="category" class="w-1/4  block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Catégorie
                    </label>
                    <select name="category" id="category" autocomplete="given-name"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            v-model="transaction.categoryId">
                      <option value="0">Aucune</option>
                      <option v-for="category in userInfos.allBasicCategories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  <div class="mt-1 w-full flex items-center gap-1.5">
                    <label for="category" class="w-1/4  block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Catégorie personnalisée
                    </label>
                    <select name="category" id="category" autocomplete="given-name"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            v-model="transaction.customCategoryId">
                      <option value="0">Aucune</option>
                      <option v-for="category in userInfos.customCategories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  <div class="mt-1 w-full flex items-center gap-1.5">
                    <label for="category" class="w-1/4  block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Reçu ou Note
                    </label>
                    <input type="file" name="category" id="category" autocomplete="given-name"
                           class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                  </div>
                </div>
              </div>
            </div>


          </div>
          <div class="flex justify-center mt-5 mr-5 gap-2">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    @click="saveTransaction"
            >
              Enregistrer
            </button>
            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Supprimer
            </button>
          </div>
        </div>
      </Suspense>
    </div>
  </div>

</template>

<style scoped>

</style>