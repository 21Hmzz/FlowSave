<script lang="ts" setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useToast} from 'vue-toast-notification';
import User from "@/tools/User";

const props = defineProps({
  steps: {
    type: Number,
    required: true
  }
});
console.log(props.steps);
const emit = defineEmits(['update:steps']);

const $toast = useToast();
const router = useRouter();
const salary = ref(0);
const save = ref(0);
const token = localStorage.getItem('token') || '';
const user = new User(token);
const newAccount = ref({
  name: '',
  type: '',
  balance: 0,
  companyName: '',
  nameBank: '',
});
const saveSalary = (salary: number) => {
  user.infos.salaire = salary;
  user.infos.step = 2;
  user.save();
  localStorage.setItem('steps', '2');
  window.location.reload();
}
const saveSaving = (save: number) => {
  user.infos.save = save;
  user.infos.step = 3;
  user.save();
  localStorage.setItem('steps', '3');
  window.location.reload();
}
const saveAccount = (account: any) => {
  account.userId = user.infos.id;
  user.infos.accounts.push(account);
  user.infos.step = 4;
  localStorage.setItem('steps', '4');
  user.save();
  window.location.reload();
}

const showDashboard = () => {
  user.infos.step = 5;
  user.save();
  localStorage.setItem('steps', '5');
  window.location.reload();
}


</script>

<template>
  <h2>
    Étape {{ steps }} / 3
  </h2>
  <div v-if="steps === 1" class="step1">
    <h2>
      1ere étape
    </h2>
    <p>
      Pour commencer à économiser, nous avons besoin de quelques informations.
    </p>
    <p>
      Combien gagnez vous par mois ?
    </p>
    <div class="form">
      <form action="">
        <div>
          <label for="salary">Salaire</label>
          <input type="number" name="salary" id="salary" v-model="salary"/>
        </div>
        <div>
          <button type="submit" @click.prevent="saveSalary(salary)">
            Suivant
          </button>
        </div>
      </form>

    </div>
  </div>
  <div v-if="steps === 2" class="step1">
    <h2>
      2eme étape
    </h2>
    <p>
      Combien souhaitez vous économiser par mois ?
    </p>
    <div class="form">
      <form action="">
        <div>
          <label for="salary">
            Économie
          </label>
          <input type="number" name="save" id="save" v-model="save"/>
        </div>
        <div>
          <button type="submit" @click.prevent="saveSaving(save)">
            Suivant
          </button>
        </div>
      </form>

    </div>

  </div>
  <div v-if="steps === 3" class="step1">
    <h2>
      3eme étape
    </h2>
    <p>
      Ajoutez votre premier compte bancaire
    </p>
    <form class="form">
      <div class="mt-1 w-full flex items-center gap-1.5">
        <label for="name" class="w-1/4 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Nom du compte
        </label>
        <input type="text" name="name" id="name" v-model="newAccount.name" class="border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" >
      </div>
      <div class="mt-1 w-full flex items-center gap-1.5">
        <label for="amount" class="w-1/4  block text-sm font-medium text-gray-700 dark:text-gray-200">
          Type de compte
        </label>
        <select name="type" id="type" v-model="newAccount.type" class="border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" >
          <option value="0">Personnel</option>
          <option value="1">Pro</option>
        </select>
      </div>
      <div class="mt-1 w-full flex items-center gap-1.5">
        <label for="amount" class="w-1/4  block text-sm font-medium text-gray-700 dark:text-gray-200">
          Solde
        </label>
        <input type="number" name="amount" id="amount" v-model="newAccount.balance" class=" border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" >
      </div>
      <div v-if="newAccount.type=='pro'" class="mt-1 w-full flex items-center gap-1.5">
        <label for="amount" class="w-1/4  block text-sm font-medium text-gray-700 dark:text-gray-200">
          Nom de l'entreprise
        </label>
        <input type="text" name="amount" id="amount" v-model="newAccount.companyName" class=" border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" >
      </div>
      <div class="mt-1 w-full flex items-center gap-1.5">
        <label for="amount" class="w-1/4  block text-sm font-medium text-gray-700 dark:text-gray-200">
          Nom de la banque
        </label>
        <input type="text" name="amount" id="amount" v-model="newAccount.nameBank" class="border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" >
      </div>
      <div>
        <button type="submit" @click.prevent="saveAccount(newAccount)" class="mt-3 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
          Suivant
        </button>
      </div>

    </form>
  </div>
  <div v-if="steps === 4" class="step3">
    <h2>
      Félicitations !
    </h2>
    <p>
      Votre compte est configuré !
    </p>
    <p>
      Vous pouvez maintenant commencer à économiser !
    </p>
    <small class="mt-3 text-gray-500 text-center">
      Vous pouvez modifier ces informations dans les paramètres. <br>
      Des informations supplémentaires vous seront demandées pour vous proposer des économies personnalisées et plus
      précises.
    </small>
    <button @click="showDashboard">
      Aller au dashboard
    </button>

  </div>
</template>


<style>
.step1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.step3 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.step3 button {
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #2ecc71;
  color: white;
  border: none;
  cursor: pointer;

}
</style>