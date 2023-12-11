<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Account from '../components/Account.vue';
const infos = ref([]);


</script>

<template>
    <div v-if="$route.params.id === undefined">
        <Account :infos="infos"  />
    </div>

</template>