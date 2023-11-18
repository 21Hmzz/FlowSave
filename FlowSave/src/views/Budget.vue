<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Axios from '../tools/Axios';
import Budget from '@/components/Budget.vue';
import moment from 'moment';
const token = localStorage.getItem('token') || '';
const DateHour = moment().fromNow();


</script>

<template>
    <Budget :DateHour="DateHour" />
</template>