<script lang="ts" setup>
import {ref, onMounted, Suspense} from 'vue';
import User from "@/tools/User";
import Navbar from "@/components/Navbar.vue";
import SideBar from "@/components/SideBar.vue";
import {useRoute, useRouter} from "vue-router";
import BudgetOverView from "@/components/BudgetOverView.vue";



const route = useRoute();
const token = localStorage.getItem('token') || '';
const userInfos = ref<any>({});
const userAccounts = ref<any>([]);
const userBudgets = ref<any>([]);
const userCategories = ref<any>([]);
const maxBudget = ref<any>(4000);
const actualProgress = ref<any>(0);
const actualProgressPourcent = ref<any>(0);
const actualProgressColor = ref<any>('#34D399');


onMounted(async () => {
  const user = new User(token);
  userInfos.value = await user.getInfos();
  userAccounts.value = await user.getAccounts();
  userBudgets.value = await user.getBudgets();
  userCategories.value = await user.getCategories();
  userBudgets.value.forEach((budget: any) => {
    actualProgress.value += budget.amount;
  });
  actualProgressPourcent.value = (actualProgress.value / maxBudget.value) * 100;
  if (actualProgressPourcent.value < 0) actualProgressColor.value = '#34D399';
  if (actualProgressPourcent.value > 50) actualProgressColor.value = '#FBBF24';
  if (actualProgressPourcent.value > 75) actualProgressColor.value = '#F87171';
  if (actualProgressPourcent.value == 100) actualProgressColor.value = '#F87171';
  if (actualProgressPourcent.value > 100) actualProgressPourcent.value = 100;
  userCategories.value.forEach((categorie: any) => {

    categorie.pourcent = calculerBudget(categorie).pourcent;
  });
  userCategories.value.sort((a: any, b: any) => {
    return b.pourcent - a.pourcent;
  });

});

function calculerBudget(categorie: any) {
  let total = 0;
  let max = categorie.maxAmount;
  let color = '#F87171';
  userBudgets.value.forEach((budgetUser: any) => {

    if (categorie.isCustom) {
      if (budgetUser.customCategoryId === categorie.id) {
        total += budgetUser.amount;
      }
    } else {
      if (budgetUser.categoryId === categorie.id) {
        total += budgetUser.amount;
      }
    }

  });
  if (Math.round((total / max) * 100) < 50) color = '#34D399';
  if (Math.round((total / max) * 100) > 50) color = '#FBBF24';
  if (Math.round((total / max) * 100) > 75) color = '#F87171';
  if (Math.round((total / max) * 100) == 100) color = '#F87171';
  return {
    total: total,
    pourcent: Math.round((total / max) * 100) > 100 ? 100 : Math.round((total / max) * 100),
    max: max,
    color: color
  }
}

</script>
<template>
  <div class="row overflow-hidden h-screen">
    <Navbar :infos="userInfos"/>
    <div class="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <SideBar/>
      <Suspense v-if="!$route.params.id">
        <div class="relative p-2 w-screen overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900">
          <div
              class="p-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div class="w-full mb-1">
              <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">
                Suivi mois de {{ new Date().toLocaleString('fr-FR', {month: 'long'}) }}
              </h1>
              <h4 class="text-sm text-gray-500 dark:text-gray-400">
                Progression du budget : {{ Math.round((actualProgressPourcent)) }}%
              </h4>

              <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 group mt-2 mb-4">
                <div class="bg-blue-600 h-2.5 rounded-full cursor-help"
                     :style="{width: actualProgressPourcent+'%',backgroundColor: actualProgressColor}"></div>
                <div class="hidden group-hover:block p-4">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Dépenses actuel : {{ actualProgress }}€</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Budget max : {{ maxBudget }}€</p>
                </div>
              </div>

            </div>
            <div class="flex flex-col">
              <div v-for="categorie in userCategories" class="w-full mb-1">
                <div class="flex justify-between">
                  <h1 class="text-md font-semibold text-gray-800 dark:text-white">
                    {{ categorie.name }}
                  </h1>
                  <button
                      @click="$router.push({name:'budget-id',params:{id:categorie.id,isCustom:categorie.isCustom}})"
                      class="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full float-right">
                    Voir
                  </button>
                </div>
                <h4 class="text-sm text-gray-500 dark:text-gray-400">
                  Progression du budget : {{ calculerBudget(categorie).pourcent }}%
                </h4>

                <div class="relative w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 group mt-2 mb-4 z-0">
                  <div class="bg-blue-600 h-2.5 rounded-full cursor-help"
                       :style="{width: calculerBudget(categorie).pourcent+'%',backgroundColor: calculerBudget(categorie).color}"></div>

                  <div class="hidden group-hover:block absolute p-4 bg-blue-100 z-50 rounded-md">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Dépenses actuelles : {{ calculerBudget(categorie).total }}€
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Budget max : {{ calculerBudget(categorie).max }}€
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </Suspense>
      <Suspense v-if="$route.params.id">

        <div class="relative p-2 w-screen overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900">
          <div
              class="p-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div class="w-full mb-1">
              <BudgetOverView :id="parseInt($route.params.id.toString())" :isCustom="$route.params.isCustom === 'true'"/>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  </div>
</template>