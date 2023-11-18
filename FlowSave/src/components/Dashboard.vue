<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import Navbar from './Navbar.vue';
import SideBar from './SideBar.vue';
import Axios from '../tools/Axios';
import moment from 'moment';
import 'moment/locale/fr';
import ApexCharts from 'apexcharts';
import { UserData, UserTransactions } from '@/tools/UserData';






moment.locale('fr');
const token = localStorage.getItem('token') || '';
const $toast = useToast();
const router = useRouter();
const infos = ref([]);
const DateHour = moment().fromNow();
const data = ref([]);
const getAllInfosDashboard = async (token: string) => {
    if (token) {
        Axios.get('/user/dashboard', {
            headers: {
                Authorization: `${token}`
            }
        }).then((response: any) => {
            return infos.value = response.data.info;
        }).catch((error: any) => {
            console.log(error);
        });

    } else {
        return;
    }
}
const selectedAccount = ref(localStorage.getItem('selectedAccount') || 'Compte perso');
const selectedAccountID = ref(selectedAccount.value == 'Compte perso' ? 0 : 1);
function refreshChartData(selectedAccount: any) {
    localStorage.setItem('selectedAccount', selectedAccount);

    window.location.reload();
}
onMounted(async () => {
    let entreeTab = 0;
    let sortieTab = 0;
    let epargneTab = 0;
    const tmp = await UserData(token);

    data.value = tmp[selectedAccountID.value];
    let transactions = await UserTransactions(token, selectedAccount.value);
    Object.keys(transactions).forEach((key: any) => {
        console.log(transactions[key].type)
        if (transactions[key].type === 'income') {
            entreeTab += transactions[key].amount;
        } else if (transactions[key].type === 'expense') {
            sortieTab += transactions[key].amount;
        } else if (transactions[key].type === 'save') {
            epargneTab += transactions[key].amount;
        }
    });


    await getAllInfosDashboard(token);
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
                    formatter: function (_, { seriesIndex, w }) {
                        const label = w.config.labels[seriesIndex];
                        return label
                    }
                },
                y: {
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

</script>

<template>
    <Navbar :infos="infos" />

    <div class="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <SideBar />
        <Suspense>
            <div class="p-4 sm:ml-64 w-screen h-screen">
                <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">

                    <div
                        class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                        <div
                            class="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                            <div>
                                <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">Synthèse de mon compte
                                    principal</h3>
                                <span class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">{{
                                    selectedAccount }}</span>
                            </div>
                            <select v-model="selectedAccount" @change="refreshChartData(selectedAccount)"
                                class="w-32 h-10 px-3 text-base text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                                <option value="Compte perso">Compte perso</option>
                                <option value="Compte pro">Compte pro</option>
                            </select>
                        </div>
                        <div id="traffic-by-device"></div>
                        <!-- Card Footer -->
                        <div class="flex items-center justify-between pt-4 lg:justify-evenly sm:pt-6">
                            <div>
                                <svg class="w-8 h-8 mb-1 text-gray-500 dark:text-gray-400" fill="currentColor"
                                    viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clip-rule="evenodd" fill-rule="evenodd"
                                        d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z">
                                    </path>
                                </svg>
                                <h3 class="text-gray-500 dark:text-gray-400">
                                    Solde
                                </h3>
                                <h4 class="text-xl font-bold dark:text-white">
                                    {{
                                        Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(data.balance)
                                    }}

                                </h4>
                                <p class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span class="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clip-rule="evenodd" fill-rule="evenodd"
                                                d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z">
                                            </path>
                                        </svg>
                                        4%
                                    </span>
                                    vs last month
                                </p>
                            </div>
                            <div>
                                <svg class="w-8 h-8 mb-1 text-gray-500 dark:text-gray-400" fill="currentColor"
                                    viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M8 16.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z">
                                    </path>
                                    <path clip-rule="evenodd" fill-rule="evenodd"
                                        d="M4 4a3 3 0 013-3h6a3 3 0 013 3v12a3 3 0 01-3 3H7a3 3 0 01-3-3V4zm4-1.5v.75c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75V2.5h1A1.5 1.5 0 0114.5 4v12a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 16V4A1.5 1.5 0 017 2.5h1z">
                                    </path>
                                </svg>
                                <h3 class="text-gray-500 dark:text-gray-400">Phone</h3>
                                <h4 class="text-xl font-bold dark:text-white">
                                    94k
                                </h4>
                                <p class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span class="flex items-center mr-1.5 text-sm text-red-600 dark:text-red-500">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clip-rule="evenodd" fill-rule="evenodd"
                                                d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z">
                                            </path>
                                        </svg>
                                        1%
                                    </span>
                                    vs last month
                                </p>
                            </div>
                            <div>
                                <svg class="w-8 h-8 mb-1 text-gray-500 dark:text-gray-400" fill="currentColor"
                                    viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clip-rule="evenodd" fill-rule="evenodd"
                                        d="M5 1a3 3 0 00-3 3v12a3 3 0 003 3h10a3 3 0 003-3V4a3 3 0 00-3-3H5zM3.5 4A1.5 1.5 0 015 2.5h10A1.5 1.5 0 0116.5 4v12a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 16V4zm5.25 11.5a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z">
                                    </path>
                                </svg>
                                <h3 class="text-gray-500 dark:text-gray-400">Tablet</h3>
                                <h4 class="text-xl font-bold dark:text-white">
                                    16k
                                </h4>
                                <p class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span class="flex items-center mr-1.5 text-sm text-red-600 dark:text-red-500">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clip-rule="evenodd" fill-rule="evenodd"
                                                d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z">
                                            </path>
                                        </svg>
                                        0,6%
                                    </span>
                                    vs last month
                                </p>
                            </div>
                        </div>
                    </div>
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
