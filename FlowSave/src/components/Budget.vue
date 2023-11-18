<script lang="ts" setup>
import Navbar from '../components/Navbar.vue';
import { ref, onMounted, computed } from 'vue';
import Axios from '../tools/Axios';
import moment from 'moment/min/moment-with-locales';
import { Add } from '@vicons/ionicons5';
import { Icon } from '@vicons/utils'

const token = localStorage.getItem('token') || '';
const DateHour = moment().fromNow();

</script>
<template>
    <div class="row overflow-hidden h-screen">
        <Navbar />
        <Suspense>
        </Suspense>
    </div>
</template>