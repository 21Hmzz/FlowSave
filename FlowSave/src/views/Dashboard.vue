<script lang="ts" setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import Step from '../components/Step.vue';
import Dashboard from '@/components/Dashboard.vue';
import Axios from '../tools/Axios';
import User from "@/tools/User";


const router = useRouter();
const token = localStorage.getItem('token') || '';
const showStep = ref(false);
const user = new User(token);

onMounted(async () => {
  const user = new User(token);
  const userInfos = await user.getInfos();
  console.log(userInfos);
  if (userInfos.step === 4) {
    router.push('/dashboard');
  } else {
    showStep.value = userInfos.step !== 0;
    localStorage.setItem('steps', userInfos.step.toString());
  }

});

const steps = parseInt(localStorage.getItem('steps') || '0');
if (steps <= 3) {
  showStep.value = true;
}
const updateSteps = (step: number) => {
  user.infos.step = step;
  localStorage.setItem('steps', step.toString());
  if(step === 4) {
   showStep.value = false;
  }
  user.save();
  window.location.reload();
}


</script>


<template>
  <div v-if="steps === 0 && !showStep" class="starting">
    <h2 class="text-3xl font-bold">
      Bienvenue sur FlowSave
    </h2>
    <p class="mt-3">
      FlowSave est une application qui vous permet de gérer vos finances personnelles.
    </p>
    <p class="mt-3">
      Pour configurer votre application, nous allons vous poser quelques questions.
    </p>
    <button @click="() => {updateSteps(1)}"
            class="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Commencer
    </button>
  </div>
  <div v-if="showStep">
    <Step :steps="steps" @update:steps="updateSteps"/>
  </div>
  <div v-if="steps === 4">
    <Dashboard/>
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