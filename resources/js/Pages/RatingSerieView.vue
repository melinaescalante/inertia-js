<script setup>
import { ref, watch } from 'vue';
import { rateSerie } from '../../services/series';
import { useLoginUser } from '../composables/useLoginUser';
import { usePage } from '@inertiajs/vue3';
import NavBarSecondary from '../components/NavBarSecondary.vue';
const num = ref(0);
const {loginUser}=useLoginUser()
const props=defineProps({name:String, id:Number})
watch(() =>num, (val) => {
   console.log(num,val)
});
function resetNum() {
    num.value =0;

};
async function rate(){
    try {
        
        await rateSerie(num.value,loginUser.value.id,props.id,props.name)
    } catch (error) {
        
    }
}
</script>
<template>
    <NavBarSecondary></NavBarSecondary>
    
    
    <div >
        <div class=" my-[30%] flex flex-col items-center justify-center">
                <h3 class="mb-3 text-2xl font-medium text-gray-800  ">Puntuar la serie <strong>{{ name }}</strong></h3>
            
                <div class=" text-center">

                    <form @submit.prevent="rate" method="get" action="">
                        <div class="flex justify-between items-baseline space-y-4 mb-8">
                            <label v-for="star in 5" :key="star" class="cursor-pointer">
                                <input type="radio" name="rating[]" :value="star" class="hidden" v-model="num"/>

                                <span >
                                    <svg @change="updateValue" class="w-10 h-10 me-5" :class="num >= star ? 'text-yellow-400' : '  stroke-gray-400 fill-none'" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path
                                            d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                    </svg>
                                </span>
                            </label>
                        </div>
                        <div class="flex gap-8 flex-col skiptranslate">
                            
                            <p class="skiptranslate">Puntuación: {{ num }}</p>
                            <div class="flex gap-2 items-center justify-center">

                                <input @click.prevent="resetNum" class=" hover:bg-gray-600 border border-gray-500 hover:text-white skiptranslate focus:ring-4 focus:outline-none focus:ring-grey-300  font-medium rounded-full text-sm inline-flex items-center px-5 py-2.5 text-center text-gray-600" type="submit" value="Resetear">
                                <input class="bg-green-600  hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-full text-sm inline-flex items-center px-5 py-2.5 text-center text-white" type="submit" value="Puntuar">
                            </div>
                        </div>
                    </form>
                    
                </div>
            </div>

    </div>
</template>