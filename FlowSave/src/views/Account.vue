<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Account from '../components/Account.vue';
import AccountView from '../components/AccountView.vue';
import Axios from '../tools/Axios';
import moment from 'moment';
const infos = ref([]);
const transactions = ref([]);
const token = localStorage.getItem('token') || '';
const DateHour = moment().fromNow();


</script>

<template>
    <div v-if="$route.params.id === undefined">
        <Account :infos="infos" :DateHour="DateHour" />
    </div>
    <div v-else>
        <AccountView :id="$route.params.id" />
    </div>
</template>