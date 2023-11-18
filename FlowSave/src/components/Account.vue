<script lang="ts" setup>
import Navbar from '../components/Navbar.vue';
import { ref, onMounted, computed } from 'vue';
import Axios from '../tools/Axios';
import moment from 'moment/min/moment-with-locales';
import { Add } from '@vicons/ionicons5';
import { Icon } from '@vicons/utils'
import { FwbTab, FwbTabs } from 'flowbite-vue'

const activeTab = ref('first')
moment.locale('fr');
const transactions = ref([]);
const accounts = ref([]);
const nbAccounts = ref(0);
let intervalId = null;
const token = localStorage.getItem('token') || '';
const fakeDate = moment().format('YYYY-MM-DD HH:mm:ss');
const DateHour = ref(moment(fakeDate).fromNow());

onMounted(() => {
    intervalId = setInterval(() => {
        DateHour.value = moment(fakeDate).fromNow();
    }, 1000);
});
const props = defineProps(['infos', 'DateHour']);
const getTransactions = async (token: string, id: number) => {
    if (token) {
        Axios.get(`/account/${id}/transactions`, {
            headers: {
                Authorization: `${token}`,
            },
        })
            .then((response: any) => {
                var last10 = Object.keys(response.data)
                    .sort()
                    .slice(-6)
                    .reduce((result: any, key: any) => {
                        result[key] = response.data[key];
                        return result;
                    }, {});
                console.log(last10);
                return (transactions.value[id] = last10 as never);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }
};
const getAllAccounts = async (token: string) => {
    if (token) {
        Axios.get('/account', {
            headers: {
                Authorization: `${token}`,
            },
        })
            .then((response: any) => {
                Object.keys(response.data).forEach((key: any) => {
                    getTransactions(token, response.data[key].id);
                });
                nbAccounts.value = Object.keys(response.data).length;

                var last3Accounts = Object.keys(response.data)
                    .sort()
                    .slice(-3)
                    .reduce((result: any, key: any) => {
                        result[key] = response.data[key];
                        return result;
                    }, {});

                return (accounts.value = last3Accounts);
            })
            .catch((error: any) => {
                console.log(error);
            });
    } else {
        return;
    }
};

onMounted(async () => {
    await getAllAccounts(token);
});
const test = "test2";
</script>

<template>
    <div class="row overflow-hidden h-screen">
        <Navbar />

        <div class="bg-primary-100 h-screen">
            <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
                <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab"
                    data-tabs-toggle="#default-tab-content" role="tablist">
                    <li class="mr-2" role="presentation">
                        <button class="inline-block p-4 border-b-2 rounded-t-lg" id="profile-tab"
                            data-tabs-target="#profile" type="button" role="tab" aria-controls="profile"
                            aria-selected="false">Profile</button>
                    </li>
                    <li class="mr-2" role="presentation">
                        <button
                            class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                            id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab"
                            aria-controls="dashboard" aria-selected="false">Dashboard</button>
                    </li>
                    <li class="mr-2" role="presentation">
                        <button
                            class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                            id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings"
                            aria-selected="false">Settings</button>
                    </li>
                    <li role="presentation">
                        <button
                            class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                            id="contacts-tab" data-tabs-target="#contacts" type="button" role="tab" aria-controls="contacts"
                            aria-selected="false">Contacts</button>
                    </li>
                </ul>
            </div>
            <div id="default-tab-content">
                <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="profile" role="tabpanel"
                    aria-labelledby="profile-tab">
                    <p class="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong
                            class="font-medium text-gray-800 dark:text-white">Profile tab's associated content</strong>.
                        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps
                        classes to control the content visibility and styling.</p>
                </div>
                <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="dashboard" role="tabpanel"
                    aria-labelledby="dashboard-tab">
                    <p class="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong
                            class="font-medium text-gray-800 dark:text-white">Dashboard tab's associated content</strong>.
                        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps
                        classes to control the content visibility and styling.</p>
                </div>
                <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="settings" role="tabpanel"
                    aria-labelledby="settings-tab">
                    <p class="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong
                            class="font-medium text-gray-800 dark:text-white">Settings tab's associated content</strong>.
                        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps
                        classes to control the content visibility and styling.</p>
                </div>
                <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="contacts" role="tabpanel"
                    aria-labelledby="contacts-tab">
                    <p class="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong
                            class="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</strong>.
                        Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps
                        classes to control the content visibility and styling.</p>
                </div>
            </div>
        </div>

        <Suspense>
            <div class="container p-4">
                <fwb-tabs v-model="activeTab" variant="pills" class="p-5">
                    <fwb-tab name="Compte perso" title="Compte perso">
                        <div class="bg-primary-100">

                            <span class="positive flex items-center justify-between">
                                <p class="text-white">
                                    Solde actuel:
                                </p>
                                {{ Intl.NumberFormat('fr-FR', {
                                    style: 'currency', currency: "EUR"
                                }).format(accounts[0]['balance' as keyof object]) }}
                            </span>

                            <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                                <li class="pb-3 sm:pb-4" v-for="transaction in transactions[accounts[0]['id']]"
                                    :key="transaction['id' as keyof object]">
                                    <div class="flex items-center space-x-4 w-full">

                                        <div class="flex-1 min-w-0 p-1">
                                            <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                {{ transaction['description' as keyof object] }}
                                            </p>
                                            <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                                {{ moment(transaction['date' as keyof object]).format('DD/MM/YYYY') }}
                                            </p>

                                        </div>
                                        <div class="inline-flex items-center text-base font-semibold text-green-500"
                                            v-if="transaction['type' as keyof object] == 'income'">
                                            + {{ Intl.NumberFormat('fr-FR', {
                                                style: 'currency', currency: 'EUR'
                                            }).format(transaction['amount' as keyof object]) }}
                                        </div>
                                        <div class="inline-flex items-center text-base font-semibold text-red-500" v-else>
                                            - {{ Intl.NumberFormat('fr-FR', {
                                                style: 'currency', currency: 'EUR'
                                            }).format(transaction['amount' as keyof object]) }}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                    </fwb-tab>
                    <fwb-tab name="Compte pro" title="Compte pro">
                        <span class="positive flex items-center justify-between">
                            <p class="text-white">
                                Solde actuel:
                            </p>
                            {{ Intl.NumberFormat('fr-FR', {
                                style: 'currency', currency: "EUR"
                            }).format(accounts[1]['balance' as keyof object]) }}
                        </span>
                    </fwb-tab>
                    <fwb-tab name="Compte epargne" title="Compte eparge">
                        <span class="positive flex items-center justify-between">
                            <p class="text-white">
                                Solde actuel:
                            </p>
                            {{ Intl.NumberFormat('fr-FR', {
                                style: 'currency', currency: "EUR"
                            }).format(accounts[1]['balance' as keyof object]) }}
                        </span>
                    </fwb-tab>

                </fwb-tabs>
            </div>
        </Suspense>
        <!-- <Suspense>

            <div class="container  py-3">
                <div class="header px-3">
                    <h1 class=" text-white font-bold text-2xl flex">
                        Comptes
                    </h1>
                </div>
                <div class="content h-4/5 w-full overflow-hidden">
                    <div class="row h-full w-full flex gap-3">
                        <div class=" h-full w-1/3 py-3  shadow-lg  rounded-lg bg-dark-300  p-6 shadow-primary-300 flex flex-col justify-between"
                            v-for="account in accounts" :key="account['id']">
                            <div class="card">
                                <div class="card-header flex flex-col gap-4 items-center">
                                    <h3 class="text-center text-white font-bold text-4xl">
                                        {{ account['name'] }}
                                    </h3>
                                    <p class="text-center text-white text-sm">
                                        Dernière mise à jour : {{ DateHour }}
                                    </p>
                                    <span class="positive flex items-center justify-between" v-if="account['balance'] > 0">
                                        <p class="text-white">
                                            Solde actuel:
                                        </p>
                                        {{ Intl.NumberFormat('fr-FR', {
                                            style: 'currency', currency: "EUR"
                                        }).format(account['balance' as keyof object]) }}
                                    </span>

                                    <span v-else class="negative flex items-center justify-between">
                                        <p>
                                            Solde actuel:
                                        </p>
                                        {{ Intl.NumberFormat('fr-FR', {
                                            style: 'currency', currency: "EUR"
                                        }).format(account['balance' as keyof object]) }}
                                    </span>
                                </div>

                                <hr />
                                <div class="card-body">
                                    <div class="header flex row justify-between p-3">
                                        <p class="font-bold text-white">
                                            Date
                                        </p>
                                        <p class="font-bold text-white">

                                            Libellé
                                        </p>
                                        <p class="font-bold text-white">
                                            Montant
                                        </p>
                                    </div>
                                    <hr />
                                    <div class="transactions flex flex-col gap-2 items-center mt-2 ">


                                        <div class="transaction flex row justify-between p-3 "
                                            v-for="transaction in transactions[account['id']]"
                                            :key="transaction['id' as keyof object]">
                                            <p class="text-white">
                                                {{ moment(transaction['date' as keyof object]).format('DD/MM/YYYY') }}
                                            </p>
                                            <p class="text-white text-ellipsis">
                                                {{ transaction['description' as keyof object] }}
                                            </p>
                                            <p v-if="transaction['type' as keyof object] == 'income'" class="text-green">
                                                + {{ Intl.NumberFormat('fr-FR', {
                                                    style: 'currency', currency: 'EUR'
                                                }).format(transaction['amount' as keyof object]) }}
                                            </p>
                                            <p v-else class="text-red">
                                                - {{ Intl.NumberFormat('fr-FR', {
                                                    style: 'currency', currency: 'EUR'
                                                }).format(transaction['amount' as keyof object]) }}
                                            </p>
                                        </div>
                                        <div v-if="Object.keys(transactions[account['id']]).length == 0">
                                            <p class="text-white">
                                                Aucune transaction
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <router-link
                                class="text-center py-2.5 px-5 mx-2 mb-2 font-medium text-white  focus:outline-none bg-primary-300 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-600 hover:bg-primary-100 focus:z-10 focus:ring-4 focus:ring-gray-200"
                                :to="{ name: 'account-id', params: { id: account['id'] } }">
                                Voir plus

                            </router-link>
                        </div>
                        <div v-if="nbAccounts < 3"
                            class="flex flex-col justify-center items-center bg-mixed-400 h-full w-1/4 py-3 rounded-xl ">
                            <RouterLink :to="{ name: 'account' }"
                                class="flex flex-col justify-center items-center gap-2 bg-primary-600 p-3 rounded-xl hover:bg-primary-100  transition ease-in-out delay-150">
                                <Icon class="text-white" size="3em">
                                    <Add />
                                </Icon>
                                <p class="text-white font-bold text-2xl">
                                    Ajouter un compte
                                </p>
                            </RouterLink>

                        </div>
                    </div>
                </div>
            </div>
        </Suspense> -->
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