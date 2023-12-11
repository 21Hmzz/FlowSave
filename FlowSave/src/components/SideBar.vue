<script lang="ts" setup>
import {ref, watch} from 'vue';
import Axios from "@/tools/Axios";

const searchQuery = ref('');
const searchResults = ref<SearchResults[]>([]);

function isActive(path: string) {
  return window.location.pathname === path;
}
interface SearchResults {
  term: string;
  link: string;
}

watch(searchQuery, async (newValue) => {
  console.log('SearchQuery changed:', newValue);
  if (newValue.length > 0) {
    const response = await Axios.get(`/search?q=${newValue}`);
    searchResults.value = response.data;
  } else {
    searchResults.value = [];
  }
});

</script>


<template>
  <aside id="sidebar"
         class="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 hidden w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width"
         aria-label="Sidebar">
    <div
        class="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div class="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
        <div class="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          <ul class="pb-2 space-y-2">
            <li>
              <form action="#" method="GET" class="lg:hidden">
                <label for="mobile-search" class="sr-only">Search</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <input type="search" name="email" id="mobile-search" v-model="searchQuery"
                         class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                         placeholder="Search">
                </div>

                <div v-if="searchResults.length > 0" class="mt-4">
                  <h4 class="text-lg font-semibold mb-2 text-dark dark:text-white">Résultats de la recherche :</h4>
                  <ul class="list-disc list-inside">
                    <li v-for="result in searchResults" :key="result.link" class="text-blue-500 hover:underline">
                      <router-link :to="result.link">{{ result.term }}</router-link>
                    </li>
                  </ul>
                </div>
              </form>
            </li>
            <li>
              <a href="/dashboard"
                 class="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                 :class="{ 'bg-gray-100 dark:bg-gray-700': isActive('/dashboard') }">
                <svg
                    class="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span class="ml-3" sidebar-toggle-item>Dashboard</span>
              </a>
            </li>
            <li>
              <button type="button"
                      :class="{ 'bg-gray-100 dark:bg-gray-700': isActive('/account') || isActive('/account/transactions') || isActive('/account/settings') }"
                      class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      aria-controls="dropdown-layouts" data-collapse-toggle="dropdown-layouts">
                <svg
                    class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true">
                  <path
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z">
                  </path>
                </svg>
                <span class="flex-1 ml-3 text-left whitespace-nowrap" sidebar-toggle-item>Mes comptes</span>
                <svg sidebar-toggle-item class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"></path>
                </svg>
              </button>
              <ul id="dropdown-layouts" class="hidden py-2 space-y-2">
                <li>
                  <a href="/account"
                     class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                    Vue d'ensemble
                  </a>
                </li>
                <li>
                  <a href="/account/transactions"
                     class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                    Transactions
                  </a>
                </li>
                <li>
                  <a href="/budget"
                     class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                    Budget
                  </a>
                </li>
                <li>
                  <a href="/account/settings"
                     class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                    Paramètres
                  </a>
                </li>
              </ul>
            </li>


            <li>
              <button type="button"
                      :class="{ 'bg-gray-100 dark:bg-gray-700': isActive('/settings/security') }"
                      class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      aria-controls="dropdown-auth" data-collapse-toggle="dropdown-auth">
                <svg
                    class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clip-rule="evenodd"></path>
                </svg>
                <span class="flex-1 ml-3 text-left whitespace-nowrap" sidebar-toggle-item>
                                    Sécurité
                                </span>
                <svg sidebar-toggle-item class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"></path>
                </svg>
              </button>
              <ul id="dropdown-auth" class="hidden py-2 space-y-2">
                <li>
                  <a href="/settings/security"
                     class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                    Paramètres
                  </a>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 justify-center hidden w-full p-4 space-x-4 bg-white lg:flex dark:bg-gray-800"
           sidebar-bottom-menu>
        <div>
          <span class="px-2 py-0.5 ml-1 text-md font-medium text-green-800 bg-green-100 rounded-full">0.1 Alpha</span>
        </div>
      </div>
    </div>
  </aside>
</template>