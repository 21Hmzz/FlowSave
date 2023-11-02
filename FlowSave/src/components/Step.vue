<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Axios from '../tools/Axios';
defineProps({
    steps: {
        type: Number,
        required: true
    }
});
const router = useRouter();
const salary = ref(0);
const token = localStorage.getItem('token') || '';
const saveSalary = (salary: number) => {
    Axios.post('/user/salary', {
        salary: salary
    }, {
        headers: {
            Authorization: `${token}`
        }
    }).then((response: any) => {
        localStorage.setItem('steps', '2');
        router.push('/dashboard');
    }).catch((error: any) => {
        console.log(error);
    });
}
</script>

<template>
    <div v-if="steps === 1" class="step1">
        <h2>
            1ere étape
        </h2>
        <p>
            Pour commencer à économiser, nous avons besoin de quelques informations.
        </p>
        <p>
            Combien gagnez vous par mois ?
        </p>
        <div class="form">
            <form action="">
                <div>
                    <label for="salary">Salaire</label>
                    <input type="number" name="salary" id="salary" v-model="salary" />
                </div>
                <div>
                    <button type="submit" @click.prevent="saveSalary(salary)">
                        Suivant
                    </button>
                </div>
            </form>

        </div>
    </div>
</template>


<style>
.step1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
</style>