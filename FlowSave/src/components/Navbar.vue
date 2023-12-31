<script lang="ts" setup>
import {ref, onMounted, watch} from 'vue';
import Axios from "@/tools/Axios";

interface SearchResults {
  term: string;
  link: string;
}

interface infos {
  name: string;
  email: string;
  avatar: string;
}

const navbarExpanded = ref(false);
const searchQuery = ref('');
const searchResults = ref<SearchResults[]>([]);
const toggleNavbar = () => {
  console.log('toggleNavbar');
  console.log(navbarExpanded.value);
  navbarExpanded.value = !navbarExpanded.value;
}
const props = defineProps({
  infos: {
    type: Object,
    required: true
  }
});
const isDarkMode = localStorage.getItem('color-theme') === 'dark';

onMounted(() => {
  const isDarkMode = localStorage.getItem('color-theme') === 'dark';

  console.log('isDarkMode', isDarkMode);
  if(isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  console.log('Initial searchQuery value:', searchQuery.value);
  const sidebar = document.getElementById('sidebar');
  const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon') as HTMLElement;
  const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon') as HTMLElement;
  if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage))) {
    themeToggleLightIcon.classList.remove('hidden');
  } else {
    themeToggleDarkIcon.classList.remove('hidden');
  }
  const themeToggleBtn = document.getElementById('theme-toggle') as HTMLElement;
  let event = new Event('dark-mode');
  themeToggleBtn.addEventListener('click', function () {

    // toggle icons
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
      if (localStorage.getItem('color-theme') === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      }

      // if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    }


    document.dispatchEvent(event);

  });
  watch(searchQuery, async (newValue) => {
    console.log('SearchQuery changed:', newValue);
    if (newValue.length > 0) {
      const response = await Axios.get(`/search?q=${newValue}`);
      searchResults.value = response.data;
    } else {
      searchResults.value = [];
    }
  });

  if (sidebar) {
    const toggleSidebarMobile = (sidebar: HTMLElement, sidebarBackdrop: HTMLElement, toggleSidebarMobileHamburger: HTMLElement, toggleSidebarMobileClose: HTMLElement) => {
      sidebar.classList.toggle('hidden');
      sidebarBackdrop.classList.toggle('hidden');
      toggleSidebarMobileHamburger.classList.toggle('hidden');
      toggleSidebarMobileClose.classList.toggle('hidden');
    }

    const toggleSidebarMobileEl = document.getElementById('toggleSidebarMobile') as HTMLElement;
    const sidebarBackdrop = document.getElementById('sidebarBackdrop') as HTMLElement;
    const toggleSidebarMobileHamburger = document.getElementById('toggleSidebarMobileHamburger') as HTMLElement;
    const toggleSidebarMobileClose = document.getElementById('toggleSidebarMobileClose') as HTMLElement;
    const toggleSidebarMobileSearch = document.getElementById('toggleSidebarMobileSearch') as HTMLElement;

    toggleSidebarMobileSearch.addEventListener('click', () => {
      toggleSidebarMobile(sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose);
    });

    toggleSidebarMobileEl.addEventListener('click', () => {
      toggleSidebarMobile(sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose);
    });

    sidebarBackdrop.addEventListener('click', () => {
      toggleSidebarMobile(sidebar, sidebarBackdrop, toggleSidebarMobileHamburger, toggleSidebarMobileClose);
    });
  }
});


</script>

<template>
  <nav class="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start">
          <button id="toggleSidebarMobile" aria-expanded="true" aria-controls="sidebar"
                  class="p-2 text-gray-600 rounded cursor-pointer lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg id="toggleSidebarMobileHamburger" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"></path>
            </svg>
            <svg id="toggleSidebarMobileClose" class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
            </svg>
          </button>
          <a href="" class="flex ml-2 md:mr-24">
            <img src="../assets/png/logo-no-background.png" class="h-8 mr-3" alt="FlowBite Logo" >

          </a>
          <form action="#" method="GET" class="hidden lg:block lg:pl-3.5">
            <label for="topbar-search" class="sr-only">Recherche</label>
            <div class="relative mt-1 lg:w-96">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor"
                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"></path>
                </svg>
              </div>
              <input type="search" name="search" id="topbar-search" v-model="searchQuery"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                     placeholder="Recherche">
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
        </div>
        <div class="flex items-center">

          <!-- Search mobile -->
          <button id="toggleSidebarMobileSearch" type="button"
                  class="p-2 text-gray-500 rounded-lg lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <span class="sr-only">Recherche</span>
            <!-- Search icon -->
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"></path>
            </svg>
          </button>
          <!-- Notifications -->
          <button type="button" data-dropdown-toggle="notification-dropdown"
                  class="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
            <span class="sr-only">Voir notifications</span>
            <!-- Bell icon -->
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z">
              </path>
            </svg>
          </button>
          <!-- Dropdown menu -->
          <div
              class="z-20 z-50 hidden max-w-sm my-4 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg dark:divide-gray-600 dark:bg-gray-700"
              id="notification-dropdown">
            <div
                class="block px-4 py-2 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              Notifications
            </div>
            <div>
              <a href="#"
                 class="flex px-4 py-3 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600">

                <div class="w-full pl-3">
                  <div class="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                    Nouveau message de
                    <span class="font-semibold text-gray-900 dark:text-white">FlowSave</span>:
                    Le système de notification est en cours de développement.
                  </div>
                  <div class="text-xs font-medium text-primary-700 dark:text-primary-400">
                    <time datetime="2021-01-27T09:32:00">Jan 27</time>
                  </div>
                </div>
              </a>

            </div>
            <a href="#"
               class="block py-2 text-base font-normal text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:underline">
              <div class="inline-flex items-center ">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path fill-rule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clip-rule="evenodd"></path>
                </svg>
                Voir toutes les notifications
              </div>
            </a>
          </div>
          <!-- Apps -->
          <button type="button" data-dropdown-toggle="apps-dropdown"
                  class="hidden p-2 text-gray-500 rounded-lg sm:flex hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
                        <span class="sr-only">
                            Les Flow Apps
                        </span>
            <!-- Icon -->
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
              </path>
            </svg>
          </button>
          <!-- Dropdown menu -->
          <div
              class="z-20 z-50 hidden max-w-sm my-4 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg dark:bg-gray-700 dark:divide-gray-600"
              id="apps-dropdown">
            <div
                class="block px-4 py-2 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              Les Flow Apps
            </div>
            <div class="grid grid-cols-3 gap-4 p-4">

              <a href="/" class="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                <svg class="mx-auto mb-1 text-gray-500 w-7 h-7 dark:text-gray-400" fill="currentColor"
                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                        d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                        clip-rule="evenodd"></path>
                </svg>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  Mon budget
                </div>
              </a>
              <button disabled  class="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                <svg class="mx-auto mb-1 text-gray-500 w-7 h-7 dark:text-gray-400" fill="currentColor"
                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.172 5.172a6 6 0 018.656 8.656l-8.656-8.656zM10 13a3 3 0 100-6 3 3 0 000 6z">
                  </path>
                </svg>
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  Todo <br>(coming soon)
                </div>
              </button>
            </div>
          </div>
          <button id="theme-toggle" data-tooltip-target="tooltip-toggle" type="button"
                  class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5">
            <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
            <svg id="theme-toggle-light-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
          </button>
          <div id="tooltip-toggle" role="tooltip"
               class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
            Changer de thème
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
          <!-- Profile -->
          <div class="flex items-center ml-3">
            <div>
              <button type="button"
                      class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                      id="user-menu-button-2" aria-expanded="false" data-dropdown-toggle="dropdown-2">
                <span class="sr-only">Ouvrir menu</span>
                <img class="w-8 h-8 rounded-full"
                     src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo">
              </button>
            </div>
            <!-- Dropdown menu -->
            <div
                class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                id="dropdown-2">
              <div class="px-4 py-3" role="none">
                <p class="text-sm text-gray-900 dark:text-white" role="none">
                  {{ infos.name }}
                </p>
                <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                  {{ infos.email }}

                </p>
              </div>
              <ul class="py-1" role="none">
                <li>
                  <a href="#"
                     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                     role="menuitem">Tableau de bord</a>
                </li>
                <li>
                  <a href="#"
                     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                     role="menuitem">Paramètres</a>
                </li>

                <li>
                  <a href="/logout"
                     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                     role="menuitem">Déconnexion</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>


  <div class="fixed inset-0 z-10 hidden bg-gray-900/50 dark:bg-gray-900/90" id="sidebarBackdrop"></div>
</template>


>
