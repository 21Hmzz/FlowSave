<script lang="ts" setup>

import Navbar from "@/components/Navbar.vue";
import SideBar from "@/components/SideBar.vue";
import {onMounted, ref} from "vue";
import {useToast} from "vue-toast-notification";
import User from "@/tools/User";
const infos = ref<any>({});
const $toast = useToast();
const user = ref<any>({});
const newPassword = ref<any>({current: "", confirm: ""});
onMounted(async () => {
  const token = localStorage.getItem("token") || "";
  user.value = new User(token);
  infos.value = await user.value.getInfos();
});

const  changePassword = () => {
  if (newPassword.value.current !== newPassword.value.confirm) {
    $toast.open({
      message: "Les mots de passe ne correspondent pas",
      type: "error",
      duration: 5000,
      position: "top-right",
    });
    return;
  }
  user.value.changePassword(newPassword.value.current).then(() => {
    $toast.open({
      message: "Mot de passe changé",
      type: "success",
      duration: 5000,
      position: "top-right",
    });
  }).catch((err:any) => {
    $toast.open({
      message: err,
      type: "error",
      duration: 5000,
      position: "top-right",
    });
  });
}
function Save() {
  user.value.save(infos.value).then(() => {
    $toast.open({
      message: "Informations sauvegardées",
      type: "success",
      duration: 5000,
      position: "top-right",
    });
  }).catch((err : any) => {
    $toast.open({
      message: err,
      type: "error",
      duration: 5000,
      position: "top-right",
    });
  });
}
</script>

<template>
  <div class="row overflow-x-hidden h-screen">
    <Navbar :infos="infos"/>
    <div class="flex pt-16 overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      <SideBar/>
      <suspense>
        <div class="p-4 lg:ml-64 w-screen h-screen">

          <div
              class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div
                class="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
              <h4 class="text-lg font-semibold text-gray-600 dark:text-gray-300">Paramètres</h4>
            </div>
            <div>
              <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                <div>
                  <label class="text-gray-700 dark:text-gray-200" for="emailAddress">Adresse email</label>
                  <input id="emailAddress" type="email" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                         v-model="infos.email" disabled/>
                </div>
                <div>
                  <label class="text-gray-700 dark:text-gray-200" for="password">Nom</label>
                  <input id="password" type="text" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                         v-model="infos.lastName" />
                </div>
                <div>
                  <label class="text-gray-700 dark:text-gray-200" for="password">Prénom</label>
                  <input id="password" type="text" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                         v-model="infos.firstName" />
                </div>
              </div>

            </div>
          </div>
          <div
              class="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div
                class="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
              <h4 class="text-lg font-semibold text-gray-600 dark:text-gray-300">
                <span>
                  Mot de passe
                </span>
              </h4>
            </div>
            <div>
              <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                <div>
                  <label class="text-gray-700 dark:text-gray-200" for="password">Mot de passe</label>
                  <input id="password" type="password" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                         v-model="newPassword.current" />
                </div>
                <div>
                  <label class="text-gray-700 dark:text-gray-200" for="password">Confirmer le mot de passe</label>
                  <input id="password" type="password" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                         v-model="newPassword.confirm" />
                </div>
                <button class="text-center mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" @click="changePassword()">Changer de mot de passe</button>
              </div>
            </div>
          </div>
          <div
              class="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div
                class="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
              <h4 class="text-lg font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <span>
                  Mon forfait
                </span>
                <span class="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                  {{infos.forfait}}
                </span>
              </h4>
            </div>
            <div>
              <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                <div>
                  <label class="text-gray-700 dark:text-gray-200" for="password">Changer de forfait</label>
                  <select id="password" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" v-model="infos.newforfait">
                    <option value="free">Gratuit</option>
                    <option value="premium">Premium</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                <div class="preview-forfait">
                  <div v-if="infos.newforfait == 'free'">
  <div class="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                        Free
                      </div>
                      <div class="mt-2">
                        <div class="text-gray-700 dark:text-gray-200">
                          <span class="font-semibold">Par mois</span> 0€
                        </div>
                      </div>

                  </div>
                  <div v-if="infos.newforfait == 'premium'">
  <div class="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                        Premium
                      </div>
                      <div class="mt-2">
                        <div class="text-gray-700 dark:text-gray-200">
                          <span class="font-semibold">Par mois</span> 9.99€
                        </div>
                      </div>
                  </div>
                  <div v-if="infos.newforfait == 'business'">
  <div class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        Business
                      </div>
                      <div class="mt-2">
                        <div class="text-gray-700 dark:text-gray-200">
                          <span class="font-semibold">Par mois</span> 19.99€
                        </div>
                      </div>
                  </div>
                  <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" @click="infos.forfait = infos.newforfait">Changer de forfait</button>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2 mb-3 flex justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <button class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" @click="Save()">Sauvegarder</button>
          </div>
        </div>

      </suspense>
    </div>
  </div>
</template>

<style scoped>

</style>