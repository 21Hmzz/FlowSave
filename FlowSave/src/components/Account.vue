<script lang="ts" setup>
import Navbar from '../components/Navbar.vue';
import {ref, onMounted, computed, watch} from 'vue';
import SideBar from "@/components/SideBar.vue";
import Axios from "@/tools/Axios";
import moment from "moment";
import {useToast} from "vue-toast-notification";
import router from "@/router";
import User from "@/tools/User";




const userInfos = ref<any>({});
const toast = useToast();
const selectedAccount = ref<string>(localStorage.getItem('selectedAccountType') || 'personnel');
const accountChoosed = ref<any>({})
const token = <string>localStorage.getItem('token');

watch(selectedAccount, async (newValue) => {
  localStorage.setItem('selectedAccountType', newValue);
  changeAccount();
});

onMounted(async () => {
  const user = new User(token||'');
  userInfos.value = await user.getInfos();
    if (userInfos.value) {
      console.log(userInfos.value);
      const account = userInfos.value.accounts.find((account: any) => account.type === selectedAccount.value);
      console.log(selectedAccount.value);
      accountChoosed.value = account;
      accountChoosed.value.totalExpenses = account.transactions.reduce((acc: any, transaction: any) => {
        if (transaction.type === 'expense') {
          acc += transaction.amount;
        }
        return acc;
      }, 0);
      accountChoosed.value.totalRevenues = account.transactions.reduce((acc: any, transaction: any) => {
        if (transaction.type === 'income') {
          acc += transaction.amount;
        }
        return acc;
      }, 0);
      accountChoosed.value.MonthSavings = account.saves.reduce((acc: any, save: any) => {
        if (moment(save.date).format('MM') === moment().format('MM')) {
          acc += save.amount;
        }
        return acc;
      }, 0);
      accountChoosed.value.savings = account.saves.reduce((acc: any, save: any) => {
        acc += save.amount;
        return acc;
      }, 0);
    }
});

function changeAccount() {
  const account = userInfos.value.accounts.find((account: any) => account.type === selectedAccount.value);
  accountChoosed.value = account;
  accountChoosed.value.totalExpenses = account.transactions.reduce((acc: any, transaction: any) => {
    if (transaction.type === 'expense') {
      acc += transaction.amount;
    }
    return acc;
  }, 0);
  accountChoosed.value.totalRevenues = account.transactions.reduce((acc: any, transaction: any) => {
    if (transaction.type === 'income') {
      acc += transaction.amount;
    }
    return acc;
  }, 0);
  accountChoosed.value.MonthSavings = account.saves.reduce((acc: any, save: any) => {
    if (moment(save.date).format('MM') === moment().format('MM')) {
      acc += save.amount;
    }
    return acc;
  }, 0);
  accountChoosed.value.savings = account.saves.reduce((acc: any, save: any) => {
    acc += save.amount;
    return acc;
  }, 0);
  localStorage.setItem('selectedAccountType', selectedAccount.value);
}

</script>

<template>
  <div class="row overflow-hidden h-screen">
    <Navbar :infos="userInfos"/>

    <div class="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <SideBar/>
      <suspense>
        <div class="relative w-screen overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900 px-4 pt-6">
          <div>
            <select
                class="block w-1/4 mt-4 ml-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                aria-label="Default select example" v-model="selectedAccount" @change="changeAccount">

              <option :selected="selectedAccount === ''" value="">
                Choix du compte
              </option>
              <option v-for="account in userInfos.accounts" :key="account.id" :value="account.type">
                {{ account.name }}
              </option>

            </select>
          </div>
          <div class="grid w-full grid-cols-1 gap-4 mt-4 xl:grid-cols-2 2xl:grid-cols-3">
            <div
                class=" items-center  justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
              <div class="w-full">
                <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">
                  Solde au {{ moment().format('DD/MM/YYYY') }}
                </h3>
                <span class="text-2xl font-bold leading-none  sm:text-3xl text-green-400-accent"
                      v-if="accountChoosed.balance > 0">
                +{{ Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(accountChoosed.balance) }}
              </span>
                <span class="text-2xl font-bold leading-none  sm:text-3xl text-red-400-accent" v-else>
                {{ Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(accountChoosed.balance) }}
              </span>
              </div>
            </div>
            <div
                class=" items-center  justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
              <div class="w-full">
                <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">
                  Total des dépenses au {{ moment().format('DD/MM/YYYY') }}
                </h3>
                <span class="text-2xl font-bold leading-none  sm:text-3xl text-red-400-accent">
                -{{
                    Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(accountChoosed.totalExpenses)
                  }}
              </span>
              </div>
            </div>

            <div
                class="  items-center  justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
              <div class="w-full">
                <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">
                  Total des revenus au {{ moment().format('DD/MM/YYYY') }}
                </h3>
                <span class="text-2xl font-bold leading-none  sm:text-3xl text-green-400-accent">
                +{{
                    Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(accountChoosed.totalRevenues)
                  }}
              </span>
              </div>
            </div>
            <div
                class=" items-center  justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
              <div class="w-full flex flex-col">
                <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">
                  Mes économies du mois
                </h3>
                <span class="text-2xl font-bold leading-none  sm:text-3xl text-green-400-accent">
                +{{
                    Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(accountChoosed.MonthSavings)
                  }}
              </span>
                <small>
                  économies total : {{
                    Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(accountChoosed.savings)
                  }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </suspense>
    </div>
  </div>
</template>
<style>
.transaction {
  background-color: var(--mixed-300);
  border-radius: 10px;
  width: 95%;

}

.positive {
  background-color: var(--green-500);
  color: white;
  padding: 4px 8px;
  text-align: center;
  border-radius: 5px;
  width: 90%;
  margin: 0 auto;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}


.negative {
  background-color: var(--red-500);
  color: white;
  padding: 4px 8px;
  text-align: center;
  border-radius: 5px;
  width: 90%;
  margin: 0 auto;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
</style>