<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import User from "../tools/User";
import moment from "moment";
import router from "@/router";

interface Category {
  id: number,
  name: string,
  maxAmount: number,
  actualAmount: number,
  pourcent: number,
  isCustom: boolean,
  depenses: any[]
}

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  isCustom: {
    type: Boolean,
    required: true
  }
});
const idCategory = props.id;
const isCustom = props.isCustom;
const route = useRoute();
const token = localStorage.getItem('token') || '';
const throttleUpdateBudget = useThrottle(updateBudget, 2000);

const user = new User(token);
const userInfos = ref<any>({});
const userBudgets = ref<any>([]);
const userCategory = ref<Category>({
  id: 0,
  name: '',
  maxAmount: 0,
  actualAmount: 0,
  pourcent: 0,
  isCustom: false,
  depenses: []
});
onMounted(async () => {
  userInfos.value = await user.getInfos();
  // @ts-ignore
  userCategory.value = await user.getCategory(idCategory, isCustom);
  userBudgets.value = await user.getBudgets();
  // @ts-ignore
  userCategory.value.actualAmount = calculerBudget(userCategory.value).total;
  userCategory.value.pourcent = calculerBudget(userCategory.value).pourcent;
  userCategory.value.depenses = await user.getDepenses(userCategory.value.id, userCategory.value.isCustom);

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

function updateBudget() {
  user.updateCategoryBudget(userCategory.value.id, userCategory.value.maxAmount, userCategory.value.isCustom);
  userCategory.value.actualAmount = calculerBudget(userCategory.value).total;
  userCategory.value.pourcent = calculerBudget(userCategory.value).pourcent;

  user.save();
}

type ThrottleFunction = (...args: any[]) => void;


function useThrottle(func: ThrottleFunction, delay: number): ThrottleFunction {
  //@ts-ignore
  let timeoutId;

  const throttledFunc = function (...args: any[]) {
    const context = this;

    if (!timeoutId) {
      func.apply(context, args);

      timeoutId = setTimeout(() => {
        timeoutId = null;
      }, delay);
    }
  };

  onBeforeUnmount(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return throttledFunc;
}

</script>

<template>
  <h3 class="text-2xl font-bold text-gray-800 first-letter:uppercase underline mb-4">
    {{ userCategory.name }}
  </h3>
  <div>
    <div class="flex flex-row justify-between">
      <div class="flex flex-col">
        <p class="text-gray-800 text-lg font-bold">Budget max</p>
        <div>
          <input type="number" class="border-2 border-gray-300 p-2 rounded w-full mt-2" placeholder="Nouveau budget"
                 v-model="userCategory.maxAmount" @change="throttleUpdateBudget">
        </div>
      </div>
      <div class="flex flex-col items-center">
        <p class="text-gray-800 text-lg font-bold ">
          Dépenses actuelles
        </p>
        <p class="text-gray-800 text-lg font-bold">{{ userCategory.actualAmount }}€</p>
      </div>
      <div class="flex flex-col">
        <p class="text-gray-800 text-lg font-bold">Pourcentage</p>
        <p class="text-gray-800 text-lg font-bold">{{ userCategory.pourcent }}%</p>
        <div class="relative w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 group mt-2 mb-4 z-0">
          <div class="bg-blue-600 h-2.5 rounded-full cursor-help"
               :style="{width: userCategory.pourcent+'%',backgroundColor: calculerBudget(userCategory).color}"></div>
        </div>
      </div>
    </div>
    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th class="px-4 py-2 text-gray-800 text-center">Nom</th>
          <th class="px-4 py-2 text-gray-800 text-center">Montant</th>
          <th class="px-4 py-2 text-gray-800 text-center">Date</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="depense in userCategory.depenses" :key="depense.id" class="border-b border-gray-200 hover:bg-gray-100 cursor-pointer" @click="router.push({name: 'transaction-id', params: {id: depense.id}})">
          <td class="border px-4 py-2 text-center">{{ depense.name }}</td>
          <td class="border px-4 py-2 text-center">{{ depense.amount }}€</td>
          <td class="border px-4 py-2 text-center">{{ moment(depense.date).format('DD/MM/YYYY') }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>


</template>

<style scoped>

</style>