<script setup>
import { ref, watch } from 'vue';
import { rateSerie } from '../../services/series';
import { useLoginUser } from '../composables/useLoginUser';
import { Link, router, usePage } from '@inertiajs/vue3';
import NavBarSecondary from '../components/NavBarSecondary.vue';
const num = ref(0);
const msg = ref('');
const { loginUser } = useLoginUser()
const props = defineProps({ name: String, id: Number })
function resetNum() {
    num.value = 0;

};
async function rate() {
    try {

        const rated = await rateSerie(num.value, loginUser.value.id, props.id)

        msg.value = 'Se ha puntuado la serie ' + props.name + ' correctamente.'
        setTimeout(() => {
            msg.value = '';
            router.replace('/misSeries')
        }, 2000);
    } catch (error) {
        msg.value = 'No se ha puntuado la serie ' + props.name + ' correctamente. Inténtelo más tarde.'
        setTimeout(() => {
            msg.value = '';
        }, 2000);
    }
}
</script>
<template>
    <NavBarSecondary></NavBarSecondary>


    <div>
        <div class=" my-[30%] flex flex-col items-center justify-center">
            <div v-if="msg === 'Se ha puntuado la serie ' + props.name + ' correctamente.'"
                class="bg-green-200 p-4 flex items-center m-2 rounded-md">
                <svg class="  w-6 h-6   me-5"
                   aria-hidden="true" stroke-width="2" 
                    xmlns="http://www.w3.org/2000/svg" fill="none" stroke=" #1f2937 " viewBox="0 0 22 20">
                    <path
                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg><p>{{ msg }}</p>
                
            </div>
            <div v-if="msg !== 'Se ha puntuado la serie ' + props.name + ' correctamente.' && msg !== ''"
                class="bg-red-200 p-4 m-2 rounded-md">
                
                <p>{{ msg }}</p>
            </div>
            <h3 class="mb-3 text-2xl font-medium text-gray-800  ">Puntuar la serie <strong>{{ name }}</strong></h3>

            <div class=" text-center">

                <form @submit.prevent="rate" method="get" action="">
                    <div class="flex justify-between items-baseline space-y-4 mb-8">
                        <label v-for="star in 5" :key="star" class="cursor-pointer">
                            <input type="radio" name="rating[]" :value="star" class="hidden" v-model="num" required />

                            <span>
                                <svg @change="updateValue" class="w-10 h-10 me-5"
                                    :class="num >= star ? 'text-yellow-400' : '  stroke-gray-400 fill-none'"
                                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                    viewBox="0 0 22 20">
                                    <path
                                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                            </span>
                        </label>
                    </div>
                    <div class="flex gap-8 flex-col skiptranslate">

                        <p class="skiptranslate">Puntuación: {{ num }}</p>
                        <div class="flex gap-2 items-center justify-center">

                            <input @click.prevent="resetNum"
                                class=" hover:bg-gray-600 border border-gray-500 hover:text-white skiptranslate focus:ring-4 focus:outline-none focus:ring-grey-300  font-medium rounded-full text-sm inline-flex items-center px-5 py-2.5 text-center text-gray-600"
                                type="submit" value="Resetear">
                            <Link href="/misSeries"
                                class="border text-red-600 border-red-600  hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-full text-sm inline-flex items-center px-5 py-2.5 text-center hover:text-white "
                                type="button">No puntear</Link>
                        </div>
                        <input :disabled="!num"
                            class="bg-green-600  hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-full text-sm inline-flex items-center px-5 py-2.5 text-center text-white"
                            :class="{ 'bg-slate-400  hover:bg-slate-400 focus:ring-slate-400 ': !num }" type="submit"
                            value="Puntuar">
                    </div>
                </form>

            </div>
        </div>

    </div>
</template>