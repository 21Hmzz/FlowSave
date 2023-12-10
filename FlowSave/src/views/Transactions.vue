<script lang="ts" setup>
import Navbar from '../components/Navbar.vue';
import {ref, onMounted, computed, watch} from 'vue';
import SideBar from "../components/SideBar.vue";
import Axios from "@/tools/Axios";
import moment from "moment";
import {useToast} from "vue-toast-notification";
import router from "@/router";
import {Modal, ModalInterface} from "flowbite";

const $toast = useToast();
const infos = ref([]);
const data = ref([]);
const account = ref({});
const page = ref(1);
const search = ref('');
const allCategories = ref([]);
const defaultCategory = ref([]);
const customCategory = ref([]);
const selectedCategory = ref('');
const selectedCustomCategory = ref('');
const EditingTransactionId = ref('');
const DeleteTransactionId = ref('');

const newTransaction = ref({
  name: '',
  amount: '',
  date: '',
  type: '',
  account: '',
  comment: ''
});
const selectedTransaction = ref({});

const countTransactions = ref(0);
const totalPage = ref(0);
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
const transactions = ref([]);
const selectedAccount = ref(localStorage.getItem('selectedAccountType') || 'personnel');

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (token) {
    const tmpData = await getAllInfosDashboard(token);
    if (tmpData && tmpData.accounts) {
      data.value = tmpData.accounts;
      account.value = data.value.find((account: any) => account.type === selectedAccount.value) || {}
      customCategory.value = tmpData.customCategories;
      defaultCategory.value = tmpData.allBasicCategories;
      allCategories.value.push(...tmpData.allBasicCategories, ...tmpData.customCategories)


      countTransactions.value = account.value.transactions.length;
      totalPage.value = Math.ceil(countTransactions.value / 20);
      transactions.value = account.value.transactions.slice(page.value * 20 - 20, page.value * 20);

    }
  }

  watch(page, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (page.value > totalPage.value) {
        page.value = totalPage.value;
      } else if (page.value < 1) {
        page.value = 1;
      }

      transactions.value = account.value.transactions.slice(page.value * 20 - 20, page.value * 20);

    }
  });

});

function changeCategory() {
  if (selectedCategory.value) {
    transactions.value = account.value.transactions.filter((transaction: any) => transaction.categoryId === selectedCategory.value);
  } else {
    transactions.value = account.value.transactions.slice(page.value * 20 - 20, page.value * 20);
  }
}

function changeCustomCategory() {
  if (selectedCustomCategory.value) {
    transactions.value = account.value.transactions.filter((transaction: any) => transaction.customCategoryId === selectedCustomCategory.value);
  } else {
    transactions.value = account.value.transactions.slice(page.value * 20 - 20, page.value * 20);
  }
}

function changeAccount() {
  localStorage.setItem('selectedAccountType', selectedAccount.value);
  account.value = data.value.find((account: any) => account.type === selectedAccount.value) || {}
  transactions.value = account.value.transactions.slice(page.value * 20 - 20, page.value * 20);
  transactions.value.sort((a: any, b: any) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function searchTransaction() {
  if (search.value) {
    transactions.value = account.value.transactions.filter((transaction: any) => transaction.name.toLowerCase().includes(search.value.toLowerCase()));
  } else {
    transactions.value = account.value.transactions.slice(page.value * 20 - 20, page.value * 20);
  }
}

function addTransaction(accountId: number) {
  if (newTransaction.value.name && newTransaction.value.amount && newTransaction.value.date && newTransaction.value.type) {
    if (newTransaction.value.amount == 0) {
      $toast.error('Le montant ne peut pas être égal à 0');
      return;
    } else if (newTransaction.value.amount < 0) {
      $toast.error('Le montant ne peut pas être inférieur à 0');
      return;
    } else if (isNaN(newTransaction.value.amount)) {
      $toast.error('Le montant doit être un nombre');
      return;
    }
    const token = localStorage.getItem('token');
    if (token) {
      Axios.post('/account/' + accountId + '/transactions', {
        name: newTransaction.value.name,
        amount: newTransaction.value.amount,
        date: newTransaction.value.date,
        type: newTransaction.value.type,
        account: accountId,
        comment: newTransaction.value.comment,
        categoryId: newTransaction.value.categoryId,
        customCategoryId: newTransaction.value.customCategoryId,
      }, {
        headers: {
          Authorization: `${token}`
        }
      }).then((response) => {
        if (response.data) {
          $toast.success('La transaction a bien été ajoutée');
          const tmpData = getAllInfosDashboard(token);
          if (tmpData && tmpData.accounts) {
            data.value = tmpData.accounts;
            let accounts = data.value.find((account: any) => account.type === selectedAccount.value) || {}
            transactions.value = accounts.transactions;
          }
          window.location.reload();
        } else {
          $toast.error('Une erreur est survenue');
        }
      }).catch((error) => {
        console.error(error);
        $toast.error('Une erreur est survenue');
      });
    }
  } else {
    $toast.error('Veuillez remplir tous les champs');
  }
}

function updateTransaction() {
  if (selectedTransaction.value.name && selectedTransaction.value.amount && selectedTransaction.value.createdAt && selectedTransaction.value.type) {
    if (selectedTransaction.value.amount == 0) {
      $toast.error('Le montant ne peut pas être égal à 0');
      return;
    } else if (selectedTransaction.value.amount < 0) {
      $toast.error('Le montant ne peut pas être inférieur à 0');
      return;
    } else if (isNaN(selectedTransaction.value.amount)) {
      $toast.error('Le montant doit être un nombre');
      return;
    }
    const token = localStorage.getItem('token');
    if (token) {
      Axios.put('/account/transactions/' + selectedTransaction.value.id, {
        name: selectedTransaction.value.name,
        amount: selectedTransaction.value.amount,
        date: selectedTransaction.value.createdAt,
        type: selectedTransaction.value.type,
        account: selectedTransaction.value.account,
        comment: selectedTransaction.value.comment,
        categoryId: selectedTransaction.value.categoryId,
        customCategoryId: selectedTransaction.value.customCategoryId,
      }, {
        headers: {
          Authorization: `${token}`
        }
      }).then((response) => {
        if (response.data) {
          $toast.success('La transaction a bien été modifiée');
          const tmpData = getAllInfosDashboard(token);
          if (tmpData && tmpData.accounts) {
            data.value = tmpData.accounts;
            let accounts = data.value.find((account: any) => account.type === selectedAccount.value) || {}
            transactions.value = accounts.transactions;
          }
          window.location.reload();
        } else {
          $toast.error('Une erreur est survenue');
        }
      }).catch((error) => {
        console.error(error);
        $toast.error('Une erreur est survenue');
      });
    }
  } else {
    $toast.error('Veuillez remplir tous les champs');
  }
}




function deleteTransaction(id: string) {
  const token = localStorage.getItem('token');
  if (token) {
    Axios.delete('/account/transactions/' + id, {
      headers: {
        Authorization: `${token}`
      }
    }).then((response) => {
      if (response.data) {
        $toast.success('La transaction a bien été supprimée');
        const tmpData = getAllInfosDashboard(token);
        if (tmpData && tmpData.accounts) {
          data.value = tmpData.accounts;
          let accounts = data.value.find((account: any) => account.type === selectedAccount.value) || {}
          transactions.value = accounts.transactions;
        }
        window.location.reload();
      } else {
        $toast.error('Une erreur est survenue');
      }
    }).catch((error) => {
      console.error(error);
      $toast.error('Une erreur est survenue');
    });
  }
}

function createEditModal(id: string) {
  let modal : ModalInterface =  new Modal(document.getElementById('edit' + id), {
    closable: true,
  });
  modal.toggle();
}
function createDeleteModal(id: string) {
  let modal : ModalInterface =  new Modal(document.getElementById('delete' + id), {
    closable: true,
  });
  modal.toggle();
}
function CloseDeleteModal(id: string) {
  let modal = new Modal(document.getElementById('delete' + id), {
    placement: 'center',
  });
  modal._destroyBackdropEl();
  modal.hide();
  const backdropElement = document.querySelector('[class*="bg-opacity-80"]') as HTMLDivElement | null;

  if (backdropElement) {
    backdropElement.parentNode?.removeChild(backdropElement);
  }

}
function OpenEditModal(id: string) {
  createEditModal(id)
  selectedTransaction.value = transactions.value.find((transaction: any) => transaction.id === id) || {};
}

function closeEditModal(id: string) {
  let modal = new Modal(document.getElementById('edit' + id), {
    placement: 'center',
  });
  modal._destroyBackdropEl();
  modal.hide();
  const backdropElement = document.querySelector('[class*="bg-opacity-80"]') as HTMLDivElement | null;

  if (backdropElement) {
    backdropElement.parentNode?.removeChild(backdropElement);
  }

}

function exportTransactions() {
  if (infos.value.forfait == 'free') {
    $toast.open({
      message: 'Vous devez être premium pour pouvoir exporter vos transactions',
      type: 'info',
      duration: 5000,
      dismissible: true,
      onClick() {
        router.push('/subscription/upgrade');
      },

    })
    return;
  }

  let csv = 'Date;Libellé;Montant;Type\n';
  transactions.value.forEach((transaction: any) => {
    csv += moment(transaction.createdAt).format('DD/MM/YYYY') + ';' + transaction.name + ';' + transaction.amount + ';' + transaction.type + '\n';
  });
  const blob = new Blob([csv], {type: 'text/csv'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'transactions.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

}

function selectAll() {
  if (document.getElementById('checkbox-all').checked) {
    checkAll();
  } else {
    uncheckAll();
  }

}

function checkAll() {
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });
}

function uncheckAll() {
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

function deleteSelection() {
  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  let ids = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      ids.push(checkbox.id.split('-')[1]);
    }
  });
  if (ids.length > 0) {
    const token = localStorage.getItem('token');
    ids.forEach((id) => {
      Axios.delete('/account/transactions/' + id, {
        headers: {
          Authorization: `${token}`
        }
      }).then((response) => {
        if (response.data) {
          $toast.success('La transaction a bien été supprimée');
          window.location.reload();
        } else {
          $toast.error('Une erreur est survenue');
        }
      }).catch((error) => {
        console.error(error);
        $toast.error('Une erreur est survenue');
      });
    });
  } else {
    $toast.error('Veuillez sélectionner au moins une transaction');
  }
}

function isLightColor(color: string) {
  const rgb = parseInt(color.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128;
}

function limitToOneCategory() {
  console.log(selectedTransaction.value.categoryId);
  console.log(selectedTransaction.value.customCategoryId);
  if (selectedTransaction.value.categoryId != null && selectedTransaction.value.customCategoryId != null) {
    $toast.error('Vous ne pouvez pas choisir une catégorie et une catégorie personnalisée simultanément');
    selectedTransaction.value.categoryId = null;
    selectedTransaction.value.customCategoryId = null;
  }
}
</script>

<template>
  <div class="row overflow-hidden h-screen">
    <Navbar :infos="infos"/>

    <div class="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <SideBar/>


      <Suspense>

        <div class="relative  w-screen overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900">
          <div
              class="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
            <div class="w-full mb-1">

              <div class="mb-4">
                <nav class="flex mb-5" aria-label="Breadcrumb">
                  <ol class="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
                    <li class="inline-flex items-center">
                      <a href="#"
                         class="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
                        <svg class="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                          <path
                              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                        </svg>
                        Tableau de bord
                      </a>
                    </li>
                    <li>
                      <div class="flex items-center">
                        <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"></path>
                        </svg>
                        <a href="#"
                           class="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white">Mes
                          comptes</a>
                      </div>
                    </li>
                    <li>
                      <div class="flex items-center">
                        <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"></path>
                        </svg>
                        <span class="ml-1 text-gray-400 md:ml-2 dark:text-gray-500"
                              aria-current="page">Transactions</span>
                      </div>
                    </li>
                  </ol>
                </nav>
                <div>
                  <select
                      class="block w-1/4 mt-4 mb-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      aria-label="Default select example" v-model="selectedAccount" @change="changeAccount">

                    <option :selected="selectedAccount === ''" value="">
                      Choix du compte
                    </option>
                    <option v-for="account in infos.accounts" :key="account.id" :value="account.type">
                      {{ account.name }}
                    </option>

                  </select>
                </div>
                <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                  Mes transactions
                </h1>
              </div>
              <div class="sm:flex">
                <div
                    class="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
                  <form class="lg:pr-3 flex items-center gap-2" action="#" method="GET">
                    <label for="users-search" class="sr-only">
                      Recherche
                    </label>
                    <div class="relative mt-1 lg:w-64 xl:w-96">
                      <input type="text" name="libelle" id="users-search"
                             class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                             placeholder="Rechercher..." autocomplete="off" v-model="search"
                             @keyup="searchTransaction()">
                    </div>
                    <select
                        class="block w-1/4 mt-4 mb-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        aria-label="Default select example" v-model="selectedCategory" @change="changeCategory">

                      <option :selected="selectedCategory === ''" value="">
                        Choix de la catégorie
                      </option>
                      <option v-for="category in defaultCategory" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>

                    <select
                        class="block w-1/4 mt-4 mb-2 text-gray-700 bg-white  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500  sm:text-sm"
                        aria-label="Default select example" v-model="selectedCustomCategory"
                        @change="changeCustomCategory">

                      <option :selected="selectedCustomCategory === ''" value="">
                        Choix de la catégorie personnalisée
                      </option>
                      <option v-for="category in customCategory" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </form>


                  <div class="flex pl-0 mt-3 space-x-1 sm:pl-2 sm:mt-0">
                    <a href="#"
                       class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                              clip-rule="evenodd"></path>
                      </svg>
                    </a>
                    <a href="#"
                       @click="deleteSelection"
                       class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clip-rule="evenodd"></path>
                      </svg>
                    </a>
                    <a href="#"
                       class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clip-rule="evenodd"></path>
                      </svg>
                    </a>
                    <a href="#"
                       class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
                <div class="flex items-center ml-auto space-x-2 sm:space-x-3">
                  <button type="button" data-modal-target="add-user-modal" data-modal-toggle="add-user-modal"
                          class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    <svg class="w-5 h-5 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clip-rule="evenodd"></path>
                    </svg>
                    Ajouter
                  </button>
                  <a href="#"
                     class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                     @click="exportTransactions()">
                    <svg class="w-5 h-5 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                            clip-rule="evenodd"></path>
                    </svg>
                    Exporter
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="">
              <div class="inline-block min-w-full align-middle">
                <div class="overflow-hidden shadow">
                  <table class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                    <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th scope="col" class="p-4">
                        <div class="flex items-center">
                          <input id="checkbox-all" aria-describedby="checkbox-1" type="checkbox"
                                 @click="selectAll"
                                 class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                          <label for="checkbox-all" class="sr-only">checkbox</label>
                        </div>
                      </th>
                      <th scope="col"
                          class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                        Date
                      </th>
                      <th scope="col"
                          class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                        Catégorie
                      </th>
                      <th scope="col"
                          class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                        Libellé
                      </th>
                      <th scope="col"
                          class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                        Montant
                      </th>
                      <th scope="col"
                          class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">

                    <tr class="hover:bg-gray-100 dark:hover:bg-gray-700" v-for="transaction in transactions"
                        :key="transaction.id">
                      <td class="w-4 p-4">
                        <div class="flex items-center">
                          <input :id="'checkbox-' + transaction.id"
                                 aria-describedby="checkbox-1" type="checkbox"
                                 class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
                          <label for="checkbox-{{transaction.id}}" class="sr-only">checkbox</label>
                        </div>
                      </td>
                      <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                        {{ moment(transaction.createdAt).format('DD/MM/YYYY') }}
                      </td>
                      <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white w-1/12 ">
                        <div v-if="transaction.category && transaction.category.name"
                             :style="{backgroundColor: transaction.category.color,color: isLightColor(transaction.category.color) ? 'black' : 'white'}"
                             class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded  flex items-center justify-center cursor-pointer"
                             @click="router.push({name: 'budget-id', params: {id: transaction.category.id,isCustom : false}})"
                          >
                          {{ transaction.category.name }}
                        </div>
                        <div v-else-if="transaction.customCategory && transaction.customCategory.name"
                             :style="{backgroundColor: transaction.customCategory.color,color: isLightColor(transaction.customCategory.color) ? 'black' : 'white'}"
                             class="text-sm font-medium me-2 px-2.5 py-1 rounded flex items-center justify-center cursor-pointer"
                             @click="router.push({name: 'budget-id', params: {id: transaction.customCategory.id,isCustom : true}})">
                          {{ transaction.customCategory.name }}
                        </div>

                      </td>

                      <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                        <p>
                          {{ transaction.name }}
                        </p>
                        <small class="text-gray-500 dark:text-gray-400 truncate">
                          {{ transaction.comments.substring(0, 50) }}{{ transaction.comments.length > 50 ? '...' : '' }}
                        </small>
                      </td>
                      <td class="p-4 text-base font-medium text-green-400-accent whitespace-nowrap"
                          v-if="transaction.type === 'income'">
                        + {{
                          Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(transaction.amount)
                        }}
                      </td>
                      <td v-else class="p-4 text-base font-medium text-red-400-accent whitespace-nowrap">
                        - {{
                          Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(transaction.amount)
                        }}
                      </td>
                      <td class="p-4 space-x-2 whitespace-nowrap">
                        <button type="button"
                                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                @click="OpenEditModal(transaction.id)">
                          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                            <path fill-rule="evenodd"
                                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                  clip-rule="evenodd"></path>
                          </svg>
                          Modifier
                        </button>
                        <button type="button" :data-modal-target="'delete'+transaction.id"
                                :data-modal-toggle="'delete'+transaction.id"
                                class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                                @click="createDeleteModal(transaction.id)">
                          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"
                               xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clip-rule="evenodd"></path>
                          </svg>
                          Supprimer
                        </button>
                        <div
                            class="fixed left-0 right-0 z-50 items-center justify-center hidden overflow-x-hidden overflow-y-auto top-4 md:inset-0 h-modal sm:h-full"
                            :id="'delete'+transaction.id">
                          <div class="relative w-full h-full max-w-md px-4 md:h-auto">
                            <!-- Modal content -->
                            <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
                              <!-- Modal header -->
                              <div class="flex justify-end p-2">
                                <button type="button"
                                        @click="CloseDeleteModal(transaction.id)"
                                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
                                        :data-modal-hide="'delete'+transaction.id">
                                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                       xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clip-rule="evenodd"></path>
                                  </svg>
                                </button>
                              </div>
                              <!-- Modal body -->
                              <div class="p-6 pt-0 text-center">
                                <svg class="w-16 h-16 mx-auto text-red-600" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <h3 class="mt-5 mb-6 text-lg text-gray-500 dark:text-gray-400">
                                  Voulez vous vraiment supprimer cet transaction ?
                                </h3>
                                <a href="#"
                                   class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2 dark:focus:ring-red-800"
                                   @click="deleteTransaction(transaction.id)">
                                  Oui, supprimer
                                </a>
                                <a href="#"
                                   @click="CloseDeleteModal(transaction.id)"
                                   class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                                   :data-modal-hide="'delete'+transaction.id">
                                  Annuler
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                            class="fixed left-0 right-0 z-50 items-center justify-center hidden overflow-x-hidden overflow-y-auto top-4 md:inset-0 h-modal sm:h-full"
                            :id="'edit'+transaction.id">
                          <div class="relative w-full h-full max-w-2xl px-4 md:h-auto">
                            <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
                              <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-700">
                                <h3 class="text-xl font-semibold dark:text-white">
                                  Modifier une transaction
                                </h3>
                                <button type="button"
                                        @click="closeEditModal(transaction.id)"

                                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                       xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clip-rule="evenodd"></path>
                                  </svg>
                                </button>
                              </div>
                              <div class="p-6 space-y-6">
                                <form action="#">
                                  <div class="grid grid-cols-6 gap-6">
                                    <div class="col-span-6 sm:col-span-3">
                                      <label for="first-name"
                                             class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                                      <input type="date" name="date" id="addDate"
                                             class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                             required v-model="selectedTransaction.createdAt">
                                    </div>
                                    <div class="col-span-6 sm:col-span-3">
                                      <label for="last-name"
                                             class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Libellé
                                      </label>
                                      <input type="text" name="libelle" id="libelle"
                                             class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                             placeholder="Facture.." required v-model="selectedTransaction.name">
                                    </div>
                                    <div class="col-span-6 sm:col-span-3">
                                      <label for="email"
                                             class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Montant</label>
                                      <input type="number" name="amount" id="amount"
                                             class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                             placeholder="1000" required v-model="selectedTransaction.amount">
                                    </div>
                                    <div class="col-span-6 sm:col-span-3">
                                      <label for="position"
                                             class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                                      <select name="type" id="type"
                                              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full py-2.5 pl-3 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                              required v-model="selectedTransaction.type">
                                        <option value="income">Revenu</option>
                                        <option value="expense">Dépense</option>
                                      </select>
                                    </div>
                                    <div class="col-span-6 sm:col-span-3">
                                      <label for="position"
                                             class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Catégorie
                                        FlowSave</label>
                                      <select name="category" id="category"
                                              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full py-2.5 pl-3 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                              required v-model="selectedTransaction.categoryId"
                                              @change="limitToOneCategory(selectedTransaction)">
                                        <option :selected="selectedTransaction.categoryId === ''" value="">
                                          Choix de la catégorie
                                        </option>
                                        <option v-for="category in infos.allBasicCategories" :key="category.id"
                                                :value="category.id">
                                          {{ category.name }}
                                        </option>
                                      </select>
                                    </div>
                                    <div class="col-span-6 sm:col-span-3">
                                      <label for="position"
                                             class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Catégorie
                                        personnalisée</label>
                                      <select name="customCategory" id="customCategory"
                                              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full py-2.5 pl-3 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                              required v-model="selectedTransaction.customCategoryId"
                                              @change="limitToOneCategory(selectedTransaction)">
                                        <option :selected="selectedTransaction.customCategoryId === ''" value="">
                                          Choix de la catégorie
                                        </option>
                                        <option v-for="customCategory in infos.customCategories"
                                                :key="customCategory.id"
                                                :value="customCategory.id">
                                          {{ customCategory.name }}
                                        </option>
                                      </select>
                                    </div>
                                    <div class="col-span-6">
                                      <label for="commentaire"
                                             class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Commentaire
                                        supplémentaire</label>
                                      <textarea id="commentaire" rows="4"
                                                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                v-model="selectedTransaction.comment">

                            </textarea>
                                    </div>
                                  </div>
                                </form>


                              </div>
                              <!-- Modal footer -->
                              <div class="items-center p-6 border-t border-gray-200 rounded-b dark:border-gray-700">
                                <button
                                    class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    type="submit" @click="updateTransaction()">
                                  Enregistrer
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>


                      </td>
                    </tr>


                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div
              class="sticky bottom-0 right-0 items-center w-full p-4 bg-white border-t border-gray-200 sm:flex sm:justify-between dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center mb-4 sm:mb-0">
              <a href="#"
                 @click="page--"
                 class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd"></path>
                </svg>
              </a>
              <a href="#"
                 @click="page++"
                 class="inline-flex justify-center p-1 mr-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"></path>
                </svg>
              </a>
              <span
                  class="text-sm font-normal text-gray-500 dark:text-gray-400">{{
                  countTransactions
                }} résultats</span>
            </div>
            <div class="flex items-center space-x-3">
              <a href="#"
                 class="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                 @click="page--">
                <svg class="w-5 h-5 mr-1 -ml-1" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd"></path>
                </svg>
                Précédent
              </a>
              <a href="#"
                 class="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                 @click="page++">
                Suivant
                <svg class="w-5 h-5 ml-1 -mr-1" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          <div
              class="fixed left-0 right-0 z-50 items-center justify-center hidden overflow-x-hidden overflow-y-auto top-4 md:inset-0 h-modal sm:h-full"
              id="add-user-modal">
            <div class="relative w-full h-full max-w-2xl px-4 md:h-auto">
              <!-- Modal content -->
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
                <!-- Modal header -->
                <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-700">
                  <h3 class="text-xl font-semibold dark:text-white">
                    Ajouter une transaction
                  </h3>
                  <button type="button"
                          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
                          data-modal-toggle="add-user-modal">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
                <!-- Modal body -->
                <div class="p-6 space-y-6">
                  <form action="#">
                    <div class="grid grid-cols-6 gap-6">
                      <div class="col-span-6 sm:col-span-3">
                        <label for="first-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                        <input type="date" name="date" id="addDate"
                               class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               required v-model="newTransaction.date">
                      </div>
                      <div class="col-span-6 sm:col-span-3">
                        <label for="last-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Libellé
                        </label>
                        <input type="text" name="libelle" id="libelle"
                               class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="Facture.." required v-model="newTransaction.name">
                      </div>
                      <div class="col-span-6 sm:col-span-3">
                        <label for="email"
                               class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Montant</label>
                        <input type="number" name="amount" id="amount"
                               class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                               placeholder="1000" required v-model="newTransaction.amount">
                      </div>
                      <div class="col-span-6 sm:col-span-3">
                        <label for="position"
                               class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                        <select name="type" id="type"
                                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full py-2.5 pl-3 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                required v-model="newTransaction.type">
                          <option value="income">Revenu</option>
                          <option value="expense">Dépense</option>
                        </select>
                      </div>
                      <div class="col-span-6 sm:col-span-3">
                        <label for="position"
                               class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Catégorie
                          FlowSave</label>
                        <select name="category" id="category"
                                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full py-2.5 pl-3 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                required v-model="newTransaction.categoryId"
                                @change="limitToOneCategory(newTransaction)">
                          <option :selected="newTransaction.categoryId === ''" value="">
                            Choix de la catégorie
                          </option>
                          <option v-for="category in infos.allBasicCategories" :key="category.id" :value="category.id">
                            {{ category.name }}
                          </option>
                        </select>
                      </div>
                      <div class="col-span-6 sm:col-span-3">
                        <label for="position"
                               class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Catégorie
                          personnalisée</label>
                        <select name="customCategory" id="customCategory"
                                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full py-2.5 pl-3 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                required v-model="newTransaction.customCategoryId"
                                @change="limitToOneCategory(newTransaction)">
                          <option :selected="newTransaction.customCategoryId === ''" value="">
                            Choix de la catégorie
                          </option>
                          <option v-for="customCategory in infos.customCategories" :key="customCategory.id"
                                  :value="customCategory.id">
                            {{ customCategory.name }}
                          </option>
                        </select>
                      </div>
                      <div class="col-span-6">
                        <label for="commentaire" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Commentaire
                          supplémentaire</label>
                        <textarea id="commentaire" rows="4"
                                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                  v-model="newTransaction.comment">

                            </textarea>
                      </div>
                    </div>
                  </form>

                </div>
                <!-- Modal footer -->
                <div class="items-center p-6 border-t border-gray-200 rounded-b dark:border-gray-700">
                  <button
                      class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      type="submit" @click="addTransaction(account.id)">
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Delete User Modal -->
        </div>
      </Suspense>
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