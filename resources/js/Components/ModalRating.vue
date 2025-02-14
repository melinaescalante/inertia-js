<script setup>
import { ref, watch } from 'vue';

const num = ref(0);

watch(() =>num, (val) => {
   console.log(num,val)
});
function resetNum() {
    num.value =0;

};
</script>
<template>
    <button
        class="block text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 "
        type="button">
        Puntuar
    </button>

    <div class="fixed inset-0 flex justify-center items-center z-50 bg-gray-800 bg-opacity-50">
        <div tabindex="-1" class="relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow ">
                <button type="button"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center ">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Cerrar modal</span>
                </button>
                <div class="p-4 md:p-5 text-center">

                    <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 " aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-width="2"
                            d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
                    </svg>

                    <h3 class="mb-5 text-lg font-normal text-gray-500  ">Puntuar la serie ""</h3>
                    <form method="get" action="">
                        <div class="flex justify-between items-baseline space-y-4 mb-6 p-2">
                            <label v-for="star in 5" :key="star" class="cursor-pointer">
                                <input type="radio" name="rating[]" :value="star" v-model="num"/>

                                <span >
                                    <svg @change="updateValue" class="w-4 h-4 me-1" :class="num >= star ? 'text-yellow-400' : '  stroke-gray-400 fill-none'" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path
                                            d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                    </svg>
                                </span>
                            </label>
                        </div>
                        <div class="flex gap-4 flex-col">
                            
                            <p class="skiptranslate">Puntuación: {{ num }}</p>
                            <div class="flex gap-2 items-center justify-center">

                                <input @click.prevent="resetNum" class=" hover:bg-gray-600 border border-gray-500 hover:text-white skiptranslate focus:ring-4 focus:outline-none focus:ring-grey-300  font-medium rounded-full text-sm inline-flex items-center px-5 py-2.5 text-center text-gray-600" type="submit" value="Resetear">
                                <input class="bg-green-600 skiptranslate hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300  font-medium rounded-full text-sm inline-flex items-center px-5 py-2.5 text-center text-white" type="submit" value="Puntuar">
                            </div>
                        </div>
                    </form>
                    
                </div>
            </div>
        </div>
    </div>
</template>