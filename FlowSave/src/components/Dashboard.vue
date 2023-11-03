<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import Axios from '../tools/Axios';

const token = localStorage.getItem('token') || '';
const $toast = useToast();
const router = useRouter();
const infos = ref([]);
const getAllInfosDashboard = async (token: string) => {
    if (token) {
        Axios.get('/user/dashboard', {
            headers: {
                Authorization: `${token}`
            }
        }).then((response: any) => {
            return infos.value = response.data.info;
        }).catch((error: any) => {
            console.log(error);
        });

    } else {
        return;
    }
}
onMounted(async () => {
    await getAllInfosDashboard(token);
});

</script>

<template>
    <Suspense>
        <div class="dashboard">
            <div class="summary">
                <n-page-header subtitle="Résumé de vos comptes" @back="handleBack">
                    <n-grid :cols="5">
                        <n-gi>
                            <n-statistic label="Comptes" value="2" />
                        </n-gi>
                        <n-gi>
                            <n-statistic label="Guests" value="22" />
                        </n-gi>
                        <n-gi>
                            <n-statistic label="Apologies" value="36" />
                        </n-gi>
                        <n-gi>
                            <n-statistic label="Topics" value="83" />
                        </n-gi>
                        <n-gi>
                            <n-statistic label="Reference Links" value="2,346" />
                        </n-gi>
                    </n-grid>
                    <template #title>
                        <a href="" style="text-decoration: none; color: inherit">
                            {{ infos.email }}
                        </a>
                    </template>
                    <template #header>
                        <n-breadcrumb>
                            <n-breadcrumb-item>Tableau de bord</n-breadcrumb-item>
                        </n-breadcrumb>
                    </template>
                    <template #avatar>
                        <n-avatar src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg" />
                    </template>

                    <template #footer>
                        derniere actualisation : {{ infos.updated_at }}
                    </template>
                </n-page-header>
            </div>

        </div>
    </Suspense>
</template>

<style>
.summary {
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border-radius: 5px;

    padding: 4%;
}
</style>
