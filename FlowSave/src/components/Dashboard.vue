<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useToast} from 'vue-toast-notification';
import Navbar from './Navbar.vue';
import SideBar from './SideBar.vue';
import Axios from '../tools/Axios';
import moment from 'moment';
import 'moment/locale/fr';
import ApexCharts from 'apexcharts';

interface Account {
  id: number;
  name: string;
  type: string;
  transactions: Transaction[];
  saves: Save[];
}

interface Transaction {
  id: number;
  name: string;
  amount: number;
  date: string;
  type: string;
  comments: string;
}

interface Save {
  id: number;
  amount: number;
  comment: string;
  createdAt: string;
}

moment.locale('fr');
const token = localStorage.getItem('token') || '';
const $toast = useToast();
const router = useRouter();
const infos = ref([]);
const DateHour = moment().fromNow();
const data = ref([]);
const accounts = ref<Account[]>([]);
const transactions = ref<Transaction[]>([]);
const showModal = ref(false);
const newSave = ref({
  amount: '',
  comment: '',
  date: ''
});
const getAllInfosDashboard = async (token: string) => {
  if (token) {
    try {
      const response = await Axios.get('/user/dashboard', {
        headers: {
          Authorization: `${token}`
        }
      });

      infos.value = response.data.info;
      return response.data.info;
    } catch (error) {
      console.error(error);
      throw error;
    }
  } else {
    return null;
  }
};

const selectedAccount = ref(localStorage.getItem('selectedAccountType') || 'personnel');
const totalTransactionsPositive = ref(0);
const totalTransactionsNegative = ref(0);
const totalTransactionsPositiveLastMonth = ref(0);
const totalTransactionsNegativeLastMonth = ref(0);
const totalSavings = ref(0);
const totalSavingsLastMonth = ref(0);
const totalSavingsAll = ref(0);
const account = ref<Account>({
  id: 0,
  name: '',
  type: '',
  transactions: [],
  saves: []
});

function refreshChartData(selectedAccount: any) {
  localStorage.setItem('selectedAccountType', selectedAccount);
  window.location.reload();
}

onMounted(async () => {
  let entreeTab = 0;
  let sortieTab = 0;
  let epargneTab = 0;

  const tmpData = await getAllInfosDashboard(token);

  if (tmpData && tmpData.accounts) {
    data.value = tmpData;
    accounts.value = tmpData.accounts;
    const selectedAccountType = selectedAccount.value;
    account.value = accounts.value.find((account: any) => account.type === selectedAccountType) || {
      id: 0,
      name: '',
      type: '',
      transactions: [],
      saves: []
    };
    transactions.value = account.value.transactions || {id: 0, name: '', amount: 0, date: '', type: '', comments: ''}
    transactions.value.forEach((transaction: any) => {
      let date = moment(transaction.date).format('M');
      if (date === moment().format('M')) {
        if (transaction.type === 'income') {
          entreeTab += 1;
          totalTransactionsPositive.value += transaction.amount;
        } else if (transaction.type === 'expense') {
          sortieTab += 1;
          totalTransactionsNegative.value += transaction.amount;
        }
      } else if (date === moment().subtract(1, 'months').format('M')) {
        if (transaction.type === 'income') {
          totalTransactionsPositiveLastMonth.value += transaction.amount;
        } else if (transaction.type === 'expense') {
          totalTransactionsNegativeLastMonth.value += transaction.amount;
        }
      }
    });
    account.value.saves.forEach((save: any) => {
      let date = moment(save.createdAt).format('M');
      if (date === moment().format('M')) {
        epargneTab += 1;
        totalSavings.value += save.amount;
      } else if (date === moment().subtract(1, 'months').format('M')) {
        totalSavingsLastMonth.value += save.amount;
      }
      totalSavingsAll.value += save.amount;
    });
    const total = entreeTab + sortieTab + epargneTab;
    entreeTab = Math.round((entreeTab / total) * 100);
    sortieTab = Math.round((sortieTab / total) * 100);
    epargneTab = Math.round((epargneTab / total) * 100);
    $toast.open({
      message: 'Données chargées',
      type: 'success',
      position: 'top-right',
      duration: 2000
    });
  } else {
    $toast.open({
      message: 'Une erreur est survenue',
      type: 'error',
      position: 'top-right',
      duration: 5000
    });
  }

  const getTrafficChannelsChartOptions = () => {

    let trafficChannelsChartColors = {}


    if (document.documentElement.classList.contains('dark')) {
      trafficChannelsChartColors = {
        strokeColor: '#1f2937'
      };
    } else {
      trafficChannelsChartColors = {
        strokeColor: '#ffffff'
      }
    }

    return {
      series: [entreeTab, sortieTab, epargneTab],
      labels: ['Entrée', 'Sortie', 'Epargne'],
      colors: ['#16BDCA', '#FDBA8C', '#1A56DB'],
      chart: {
        type: 'donut',
        height: 400,
        fontFamily: 'Inter, sans-serif',
        toolbar: {
          show: true
        },
      },
      responsive: [{
        breakpoint: 430,
        options: {
          chart: {
            height: 300
          }
        }
      }],
      stroke: {
        //@ts-ignore
        colors: [trafficChannelsChartColors.strokeColor]
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.9
          }
        }
      },
      tooltip: {
        shared: true,
        followCursor: false,
        fillSeriesColor: false,
        inverseOrder: true,
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif'
        },
        x: {
          show: true,
          // @ts-ignore
          formatter: function (_, {seriesIndex, w}) {
            const label = w.config.labels[seriesIndex];
            return label
          }
        },
        y: {
          // @ts-ignore
          formatter: function (value) {
            return value + '%';
          }
        }
      },
      grid: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
    };
  }
  if (document.getElementById('traffic-by-device')) {
    const chart = new ApexCharts(document.getElementById('traffic-by-device'), getTrafficChannelsChartOptions());
    chart.render();

    // init again when toggling dark mode
    document.addEventListener('dark-mode', function () {
      chart.updateOptions(getTrafficChannelsChartOptions());
    });
  }
});

function addSave(isDelete: boolean = false) {
  if (!isDelete) {
    account.value.saves.push({
      id: 0,
      amount: parseFloat(newSave.value.amount),
      comment: newSave.value.comment,
      createdAt: newSave.value.date
    });
  }

  Axios.put('/user/edit', {
    user: infos.value,
  }, {
    headers: {
      Authorization: `${token}`
    }
  }).then((response) => {
    if (response.status === 200) {
      if(isDelete) {
        $toast.open({
          message: 'Economie supprimée',
          type: 'success',
          position: 'top-right',
          duration: 2000
        });
      } else {
        $toast.open({
          message: 'Economie ajoutée',
          type: 'success',
          position: 'top-right',
          duration: 2000
        });
      }
      showModal.value = false;
      //window.location.reload();
    }
  }).catch((error) => {
    $toast.open({
      message: 'Une erreur est survenue',
      type: 'error',
      position: 'top-right',
      duration: 5000
    });
    console.error(error);
  });
}

</script>

<template>
  <Navbar :infos="infos"/>
  <div class="flex pt-16  bg-gray-50 dark:bg-gray-900">
    <SideBar/>
    <Suspense fallback="Loading...">
      <div class="p-4 lg:ml-64 w-screen h-screen">

        <div
            class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <div
              class="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">Synthèse de mon compte
                principal</h3>
              <span class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">{{
                  account.name
                }}</span>
            </div>
            <select v-model="selectedAccount" @change="refreshChartData(selectedAccount)"
                    class=" h-10 px-3 text-base text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700">
              <option v-for="account in accounts" :key="account.id" :value="account.type">
                {{ account.name }}
              </option>
            </select>
          </div>
          <div v-if="transactions.length > 0" class="flex items-center justify-between pb-4 mb-4">
            <div>
              <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">Dernière transaction</h3>
              <span class="text-xl font-bold leading-none text-gray-900 dark:text-white">{{
                  transactions[0].name
                }}</span>
            </div>
            <div>
              <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">Montant</h3>
              <span class="text-xl font-bold leading-none text-gray-900  dark:text-white">{{
                  Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(transactions[0].amount)
                }}</span>
            </div>
            <div>
              <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">Date</h3>
              <span class="text-xl font-bold leading-none text-gray-900 dark:text-white">{{
                  moment(transactions[0].date).format('DD/MM/YYYY')
                }}</span>
            </div>
          </div>
          <div id="traffic-by-device"></div>
          {{ transactions.length === 0 ? 'Aucune transaction' : '' }}
          <!-- Card Footer -->
          <div class="flex items-center justify-between pt-4 lg:justify-evenly sm:pt-6">
            <div>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor" viewBox="0 0 20 21">
                <path
                    d="M15 14H7.78l-.5-2H16a1 1 0 0 0 .962-.726l.473-1.655A2.968 2.968 0 0 1 16 10a3 3 0 0 1-3-3 3 3 0 0 1-3-3 2.97 2.97 0 0 1 .184-1H4.77L4.175.745A1 1 0 0 0 3.208 0H1a1 1 0 0 0 0 2h1.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 10 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3Zm-8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
                <path d="M19 3h-2V1a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V5h2a1 1 0 1 0 0-2Z"/>
              </svg>
              <h3 class="text-gray-500 dark:text-gray-400">
                Dépenses
              </h3>
              <h4 class="text-xl font-bold dark:text-white">
                {{
                  Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(totalTransactionsNegative)
                }}

              </h4>
              <p class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span class="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400"
                                          v-if="totalTransactionsNegativeLastMonth < totalTransactionsNegative">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clip-rule="evenodd" fill-rule="evenodd"
                                                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z">
                                            </path>
                                        </svg>

                                    </span>
                <span class="flex items-center mr-1.5 text-sm text-red-600 dark:text-red-500" v-else>
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clip-rule="evenodd" fill-rule="evenodd"
                                                  d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z">
                                            </path>
                                        </svg>
                                    </span>
                {{ totalTransactionsNegativeLastMonth > totalTransactionsNegative ? 'En baisse' : 'En hausse' }} par
                rapport au mois dernier


              </p>
            </div>
            <div>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1M2 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
              </svg>
              <h3 class="text-gray-500 dark:text-gray-400">
                Entrées
              </h3>
              <h4 class="text-xl font-bold dark:text-white">
                {{
                  Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(totalTransactionsPositive)
                }}
              </h4>
              <p class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span class="flex items-center mr-1.5 text-sm text-red-600 dark:text-red-500"
                                          v-if="totalTransactionsPositiveLastMonth > totalTransactionsPositive">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clip-rule="evenodd" fill-rule="evenodd"
                                                  d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z">
                                            </path>
                                        </svg>

                                    </span>
                <span class="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400" v-else>
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clip-rule="evenodd" fill-rule="evenodd"
                                                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z">
                                            </path>
                                        </svg>
                                    </span>
                {{ totalTransactionsPositiveLastMonth > totalTransactionsPositive ? 'En baisse' : 'En hausse' }} par
                rapport au mois dernier

              </p>
            </div>
            <div>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 18 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M1 1v14h16m0-9-3-2-3 5-3-2-3 4"/>
              </svg>
              <h3 class="text-gray-500 dark:text-gray-400">
                Epargne
              </h3>
              <h4 class="text-xl font-bold dark:text-white">
                {{
                  Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(totalSavings)
                }}
              </h4>
              <p class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span class="flex items-center mr-1.5 text-sm text-red-600 dark:text-red-500"
                                          v-if="totalSavingsLastMonth > totalSavings">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clip-rule="evenodd" fill-rule="evenodd"
                                                  d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z">
                                            </path>
                                        </svg>

                                    </span>
                <span class="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400" v-else>
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clip-rule="evenodd" fill-rule="evenodd"
                                                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z">
                                            </path>
                                        </svg>
                                    </span>
                {{ totalSavingsLastMonth > totalSavings ? 'En baisse' : 'En hausse' }} par rapport au mois dernier

              </p>
            </div>
          </div>
        </div>
        <div
            class="p-4 mt-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <div
              class="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
              Mes économies
            </h3>

            <div>
              Total :
              {{
                Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(totalSavingsAll)
              }}
            </div>
            <div>
              <button data-modal-target="save-modal" data-modal-toggle="save-modal"
                      class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      type="button">
                Ajouter une économie
              </button>
            </div>
            <div id="save-modal" tabindex="-1" aria-hidden="true"
                 class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div class="relative p-4 w-full max-w-md max-h-full">
                <!-- Modal content -->
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <!-- Modal header -->
                  <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      Ajouter une économie
                    </h3>
                    <button type="button"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-toggle="save-modal">
                      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                           viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                      <span class="sr-only">
                        Fermer
                      </span>
                    </button>
                  </div>
                  <!-- Modal body -->
                  <form class="p-4 md:p-5">
                    <div class="grid gap-4 mb-4 grid-cols-2">

                      <div class="col-span-2 ">
                        <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Montant
                        </label>
                        <input type="number" name="amount" id="amount" v-model="newSave.amount"
                               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="2999" required min="0">
                      </div>
                      <div class="col-span-2 ">
                        <label for="date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Date
                        </label>
                        <input type="date" name="date" id="date" v-model="newSave.date"
                               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="21/07/2002">
                      </div>

                      <div class="col-span-2">
                        <label for="comments" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Commentaires
                        </label>
                        <textarea
                            v-model="newSave.comment"
                            name="comments"
                            id="comments" rows="4"
                            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Commentaire sur l'épargne"></textarea>
                      </div>
                    </div>
                    <button type="submit"
                            class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            @click.prevent="addSave(false)">
                      <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                           xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                              clip-rule="evenodd"></path>
                      </svg>
                      Ajouter
                    </button>
                  </form>
                </div>
              </div>
            </div>


          </div>
          <div v-if="account.saves === undefined" class="flex items-center justify-between pb-4 mb-4">
            <div>
              <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">Aucune économie</h3>
            </div>
          </div>
          <table class="w-full mb-4 text-gray-700 bg-white rounded-lg dark:bg-gray-800 dark:text-gray-400">
            <thead class="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th class="p-3 font-bold uppercase dark:text-gray-300 text-center">
                Commentaires
              </th>
              <th class="p-3 font-bold uppercase dark:text-gray-300">Montant</th>
              <th class="p-3 font-bold uppercase dark:text-gray-300">Date</th>
              <th class="p-3 font-bold uppercase dark:text-gray-300">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="save in account.saves" :key="save.id" class="border-b border-gray-200 dark:border-gray-700">
              <td class="p-3 dark:text-gray-300 text-center">{{
                  save.comment ? save.comment : 'Aucun commentaire'
                }}
              </td>
              <td class="p-3 dark:text-gray-300 text-center">
                {{
                  Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(save.amount)
                }}
              </td>
              <td class="p-3 dark:text-gray-300 text-center">{{ moment(save.createdAt).format('DD/MM/YYYY') }}</td>
              <td class="p-3 text-center">
                <div class="flex justify-center item-center">
                  <div
                      class="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer"
                      @click="() => {
                        account.saves.splice(account.saves.indexOf(save), 1) ;
                        addSave(true);
                      }">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"/>
                    </svg>
                  </div>

                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>


      </div>

    </Suspense>
  </div>
</template>

<style>
.row {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.dashboard {
  padding: 2%;
  display: flex;
  height: fit-content;
  gap: 2%;
}
</style>
