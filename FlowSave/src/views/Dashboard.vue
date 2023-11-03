<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Step from '../components/Step.vue';
import Dashboard from '@/components/Dashboard.vue';
import Axios from '../tools/Axios';

const router = useRouter();
const token = localStorage.getItem('token') || '';
const showStep = ref(false);
const getUser = (token: string) => {
    if (token) {
        Axios.get('/user', {
            headers: {
                Authorization: `${token}`
            }
        }).then((response: any) => {
        }).catch((error: any) => {
            console.log(error);
        });
    } else {
        return;
    }
}
const getSteps = (token: string) => {
    if (token) {
        Axios.get('/user/steps', {
            headers: {
                Authorization: `${token}`
            }
        }).then((response: any) => {
            localStorage.setItem('steps', response.data.stepID);

            return response.data.stepID;

        }).catch((error: any) => {
            console.log(error);
        });
    } else {
        return;
    }

}
getUser(token);
getSteps(token);

const steps = parseInt(localStorage.getItem('steps') || '0');
if (steps <= 3) {
    showStep.value = true;
}
const updateSteps = (step: number) => {
    localStorage.setItem('steps', step.toString());
    showStep.value = false;
    window.location.reload();
}
</script>




<template>
    <div v-if="steps === 1 && !showStep" class="starting">
        <h2>
            Bienvenue sur FlowSave
        </h2>
        <p>
            FlowSave est une application qui vous permet de gérer vos finances personnelles.
        </p>
        <p>
            Pour configurer votre application, nous allons vous poser quelques questions.
        </p>
        <button @click="showStep = true">
            Commencer
        </button>
    </div>
    <div v-if="showStep">
        <Step :steps="steps" @update:steps="updateSteps" />
    </div>
    <div v-if="steps === 4">
        <Dashboard />
    </div>
</template>

<style>
.starting {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
</style>