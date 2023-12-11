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
const token = <string>localStorage.getItem('token');
const user = new User(token || '');
const newAccount = ref<any>({
  id: 0,
  name: '',
  balance: 0,
  createdAt: new Date().toISOString(),
  type: 'personnel',
  userId: 0,
  companyName: '',
  nameBank: '',
});

onMounted(async () => {
  const user = new User(token || '');
  userInfos.value = await user.getInfos();

});
const createAccount = async () => {
  newAccount.value.userId = userInfos.value.id;
  user.infos.accounts.push(newAccount.value);
  await user.save();
  toast.success('Compte créé avec succès');
}
</script>

<template>
  <div class="row overflow-hidden h-screen">
    <Navbar :infos="userInfos"/>

    <div class="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <SideBar/>
      <suspense>
        <div class="relative w-screen overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900 px-4 pt-6">
          <div class="p-4">
            <form action="">
              <div class="flex flex-col ">
                <label for="name" class="text-dark dark:text-white">Nom du compte</label>
                <input type="text" id="name" name="name" placeholder="Nom du compte"
                       class="border border-gray-300 rounded-md p-2 mt-2 dark:bg-gray-900 dark:text-white "
                       v-model="newAccount.name">
              </div>
              <div class="flex flex-col mt-2">
                <label for="balance" class="text-dark dark:text-white">Balance</label>
                <input type="number" id="balance" name="balance" placeholder="Balance"
                       class="border border-gray-300 rounded-md p-2 mt-2 dark:bg-gray-900 dark:text-white "
                       v-model="newAccount.balance">
              </div>
              <div class="flex flex-col mt-2">
                <label for="type" class="text-dark dark:text-white">Type</label>
                <select name="type" id="type" class="border border-gray-300 rounded-md p-2 mt-2 dark:bg-gray-900 dark:text-white "
                        v-model="newAccount.type">
                  <option value="personnel">Personnel</option>
                  <option value="entreprise">Entreprise</option>
                </select>
              </div>
              <div class="flex flex-col mt-2" v-if="newAccount.type === 'entreprise'">
                <label for="companyName">Nom de l'entreprise</label>
                <input type="text" id="companyName" name="companyName" placeholder="Nom de l'entreprise"
                       class="border border-gray-300 rounded-md p-2 mt-2 dark:bg-gray-900 dark:text-white "
                        v-model="newAccount.companyName">
              </div>
              <div class="flex flex-col mt-2 ">
                <label for="nameBank" class="text-dark dark:text-white">Nom de la banque</label>
                <select name="nameBank" id="nameBank" class="border border-gray-300 rounded-md p-2 mt-2 dark:bg-gray-900 dark:text-white "
                        v-model="newAccount.nameBank">
                  <option>Banque Populaire</option>
                  <option>BNP Paribas</option>
                  <option>Caisse d'Épargne</option>
                  <option>Crédit Agricole</option>
                  <option>Crédit Mutuel</option>
                  <option>Société Générale</option>
                  <option>HSBC</option>
                  <option>La Banque Postale</option>
                  <option>AXA Banque</option>
                  <option>ING Direct</option>
                  <option>Société Marseillaise de Crédit</option>
                  <option>Crédit du Nord</option>
                  <option>LCL (Le Crédit Lyonnais)</option>
                  <option>CIC (Crédit Industriel et Commercial)</option>
                  <option>Banque Tarneaud</option>
                  <option>BforBank</option>
                  <option>Boursorama Banque</option>
                  <option>Fortuneo</option>
                  <option>Société Générale</option>
                </select>
              </div>
              <div class="flex flex-col mt-2">
                <button type="button" class="bg-blue-500 text-white rounded-md p-2 mt-4 w-full hover:bg-blue-600"
                        @click="createAccount">Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      </suspense>
    </div>
  </div>
</template>

<style scoped>

</style>