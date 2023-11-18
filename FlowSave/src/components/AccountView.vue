<script lang="ts" setup>

import { ref, onMounted, computed } from 'vue';
import Axios from '../tools/Axios';
import Navbar from './Navbar.vue';
import { ArrowBack } from '@vicons/ionicons5';
import { Icon } from '@vicons/utils';
const props = defineProps(['id']);

const token = localStorage.getItem('token') || '';
const accounts = ref([]);
const transactions = ref([]);
const getAccount = async (token: string, id: number) => {
    if (token) {
        Axios.get(`/account/${id}`, {
            headers: {
                Authorization: `${token}`,
            },
        })
            .then((response: any) => {
                getTransactions(token, id);
                return (accounts.value = response.data as never);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }
};
const getTransactions = async (token: string, id: number) => {
    if (token) {
        Axios.get(`/account/${id}/transactions`, {
            headers: {
                Authorization: `${token}`,
            },
        })
            .then((response: any) => {
                return (transactions.value = response.data as never);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }
};
const addTransaction = async (
    token: string,
    id: number,
    description: string,
    amount: number,
    type: string,
    date: string
) => {
    if (token) {
        Axios.post(
            `/account/${id}/transactions`,
            {
                description: description,
                amount: amount,
                type: type,
                date: date,
            },
            {
                headers: {
                    Authorization: `${token}`,
                },
            }
        )
            .then((response: any) => {
                getAccount(token, id);

                return (transactions.value = response.data as never);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }
};
// const DateHour = computed(() => {
//     const fakeDate = accounts.value['updated_at' as keyof object];
//     return moment(fakeDate).fromNow();
// });

const description = ref('');
const amount = ref(0);
const type = ref('income');
const date = ref('');


onMounted(() => {
    getAccount(token, props.id);
});



</script>


<template>
    <div class="row overflow-hidden">
        <Navbar />
        <Suspense>
            <div class="col-12 relative py-3 px-6  w-full">
                <div class="row  w-full">
                    <div class=" w-full">
                        <div class="text-white font-bold text-3xl">
                            Compte n°{{ accounts['id' as keyof object] }} : {{ accounts['name' as keyof object] }}
                        </div>
                        <div class="flex w-full gap-3">
                            <div class="flex w-1/2 gap-2">
                                <div class="card w-full bg-mixed-500 rounded-xl">
                                    <div class="card   bg-mixed-500 p-4 rounded-xl">
                                        <div class="card-header text-white font-bold text-2xl flex justify-between">
                                            <p>
                                                Solde :
                                            </p>
                                            <p v-if="accounts['balance' as keyof object] > 0"
                                                class="text-green-500 text-2xl">
                                                {{ Intl.NumberFormat('fr-FR', {
                                                    style: 'currency', currency: 'EUR'
                                                }).format(accounts['balance' as keyof object]) }}
                                            </p>
                                            <p v-else class="text-red-500 text-2xl">
                                                {{ Intl.NumberFormat('fr-FR', {
                                                    style: 'currency', currency: 'EUR'
                                                }).format(accounts['balance' as keyof object]) }}
                                            </p>
                                        </div>
                                        <div class="card-body h-full flex flex-col gap-2 bg-mixed-200 p-3 rounded-xl">
                                            <div v-for="transaction in transactions" :key="transaction['id']"
                                                class="flex justify-between gap-2 h-full border-b-2">
                                                <p class="text-white text-xl">
                                                    {{ transaction['description'] }}

                                                </p>
                                                <p class="text-green-500 text-xl" v-if="transaction['type'] == 'income'">

                                                    + {{ Intl.NumberFormat('fr-FR', {
                                                        style: 'currency', currency: 'EUR'
                                                    }).format(transaction['amount']) }}
                                                </p>
                                                <p class="text-red-500 text-xl" v-else>

                                                    - {{ Intl.NumberFormat('fr-FR', {
                                                        style: 'currency', currency: 'EUR'
                                                    }).format(transaction['amount']) }}
                                                </p>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="card w-2/4  bg-mixed-500 p-4 rounded-xl">
                                    <div class="card-header text-white font-bold text-2xl">
                                        Ajouter une transaction
                                    </div>
                                    <div>
                                        <div class="card-body flex flex-col gap-2 bg-mixed-200 p-3 rounded-xl">
                                            <div class="flex flex-col gap-2">
                                                <label for="description" class="text-white text-xl">Description</label>
                                                <input type="text" name="description" id="description"
                                                    class="rounded-xl p-2 bg-mixed-300 text-white" v-model="description"
                                                    placeholder="Libellé" />
                                            </div>
                                            <div class="flex flex-col gap-2">
                                                <label for="amount" class="text-white text-xl">Montant</label>
                                                <input type="number" name="amount" id="amount"
                                                    class="rounded-xl p-2 bg-mixed-300 text-white" v-model="amount" />
                                            </div>
                                            <div class="flex flex-col gap-2">
                                                <label for="type" class="text-white text-xl">Type</label>
                                                <select name="type" id="type" class="rounded-xl p-2 bg-mixed-300 text-white"
                                                    v-model="type">
                                                    <option value="income">Revenu</option>
                                                    <option value="expense">Dépense</option>
                                                    <option value="save">
                                                        Économie
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="flex flex-col gap-2">
                                                <label for="date" class="text-white text-xl">Date</label>
                                                <input type="date" name="date" id="date"
                                                    class="rounded-xl p-2 bg-mixed-300 text-white" v-model="date" />
                                            </div>
                                            <div class="flex flex-col gap-2">
                                                <button class="bg-green-500 rounded-xl p-2 text-white"
                                                    @click="addTransaction(token, accounts['id' as keyof object], description, amount, type, date)">Ajouter</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex w-1/3">
                                <div class="card w-full bg-mixed-500 rounded-xl">
                                    <div class="card   bg-mixed-500 p-4 rounded-xl">
                                        <div class="card-header text-white font-bold text-2xl flex justify-between">
                                            <p>
                                                Économies :
                                            </p>
                                            <p v-if="accounts['actualSave' as keyof object] > accounts['save' as keyof object] / 3"
                                                class="text-green-500 text-2xl">
                                                {{ Intl.NumberFormat('fr-FR', {
                                                    style: 'currency', currency: 'EUR'
                                                }).format(accounts['actualSave' as keyof object]) }} /
                                                {{ Intl.NumberFormat('fr-FR', {
                                                    style: 'currency', currency:
                                                        'EUR'
                                                }).format(accounts['save' as keyof object]) }}
                                            </p>
                                            <p v-else class="text-red-500 text-2xl">
                                                {{ Intl.NumberFormat('fr-FR', {
                                                    style: 'currency', currency: 'EUR'
                                                }).format(accounts['actualSave' as keyof object]) }}
                                                /
                                                {{ Intl.NumberFormat('fr-FR', {
                                                    style: 'currency', currency:
                                                        'EUR'
                                                }).format(accounts['save' as keyof object]) }}
                                            </p>
                                        </div>
                                        <div class="card-body flex flex-col gap-2 bg-mixed-200 p-3 rounded-xl">
                                            <div v-for="transaction in Object.values(transactions).filter(transaction => transaction['type'] == 'save')"
                                                :key="transaction['id']" class="flex justify-between gap-2 border-b-2">
                                                <p class="text-white text-xl">
                                                    {{ transaction['description'] }}

                                                </p>
                                                <p class="text-green-500 text-xl" v-if="transaction['type'] == 'save'">

                                                    + {{ Intl.NumberFormat('fr-FR', {
                                                        style: 'currency', currency: 'EUR'
                                                    }).format(transaction['amount']) }}
                                                </p>
                                                <p class="text-red-500 text-xl" v-else>

                                                    - {{ Intl.NumberFormat('fr-FR', {
                                                        style: 'currency', currency: 'EUR'
                                                    }).format(transaction['amount']) }}
                                                </p>

                                            </div>

                                        </div>
                                        <!-- <div>
                                            <button class="bg-green-500 rounded-xl p-2 text-white"
                                                @click="getAccount(token, accounts['id' as keyof object])">
                                                Voir mon budget
                                            </button>
                                        </div> -->
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class=" bg-primary-200 text-white flex items-center justify-center rounded-md p-4 py-1 absolute
                            left-2 bottom-2">
                    <router-link to="/account" class="flex items-center gap-2 h-full">
                        <Icon size="24" color="white">
                            <ArrowBack />
                        </Icon>
                    </router-link>
                </div>
            </div>
        </Suspense>
    </div>
</template>


