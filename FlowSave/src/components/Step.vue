<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';

import Axios from '../tools/Axios';
const props = defineProps({
    steps: {
        type: Number,
        required: true
    }
});
console.log(props.steps);
const emit = defineEmits(['update:steps']);

const $toast = useToast();
const router = useRouter();
const salary = ref(0);
const save = ref(0);
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
        window.location.reload();
    }).catch((error: any) => {
        console.log(error);
        $toast.error('Une erreur est survenue : ' + error.response.data.message, {
            duration: 5000
        });
    });
}
const saveSaving = (save: number) => {
    Axios.post('/user/save', {
        save: save
    }, {
        headers: {
            Authorization: `${token}`
        }
    }).then((response: any) => {
        localStorage.setItem('steps', '3');
        window.location.reload();
    }).catch((error: any) => {
        console.log(error);
        $toast.error('Une erreur est survenue : ' + error.response.data.message, {
            duration: 5000
        });
    });

}
const showDashboard = () => {
    Axios.patch('/user/step/edit', {
        step: 4
    }, {
        headers: {
            Authorization: `${token}`
        }
    }).then((response: any) => {
        emit('update:steps', 4)
    }).catch((error: any) => {
        console.log(error);
        $toast.error('Une erreur est survenue : ' + error.response.data.message, {
            duration: 5000
        });
    });

    // router.push('/dashboard');
}


</script>

<template>
    <h2>
        Étape {{ steps }} / 3
    </h2>
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
    <div v-if="steps === 2" class="step1">
        <h2>
            2eme étape
        </h2>
        <p>
            Combien souhaitez vous économiser par mois ?
        </p>
        <div class="form">
            <form action="">
                <div>
                    <label for="salary">
                        Économie
                    </label>
                    <input type="number" name="save" id="save" v-model="save" />
                </div>
                <div>
                    <button type="submit" @click.prevent="saveSaving(save)">
                        Suivant
                    </button>
                </div>
            </form>

        </div>

    </div>
    <div v-if="steps === 3" class="step3">
        <h2>
            3eme étape
        </h2>
        <p>
            Votre compte est configuré !
        </p>
        <p>
            Vous pouvez maintenant commencer à économiser !
        </p>
        <small>
            Vous pouvez modifier ces informations dans les paramètres.
            Des informations supplémentaires vous seront demandées pour vous proposer des économies personnalisées et plus
            précises.
        </small>
        <button @click="showDashboard">
            Aller au dashboard
        </button>

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

.step3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.step3 button {
    margin-top: 20px;
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #2ecc71;
    color: white;
    border: none;
    cursor: pointer;

}
</style>