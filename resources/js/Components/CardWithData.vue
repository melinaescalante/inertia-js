<script setup>
import { Link } from '@inertiajs/vue3';
function visit() {
    router.visit('/wishlist', {
        data: {
            seriesToWatch: seriesToWatch.value
        },
    });

}
</script>
<template>
 <Link @click="visit" :data="{ seriesToWatch: seriesToWatch.value }"
                class=" m-2 flex  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">

            <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
                :src="lastSerie?.image?.medium || '/public/noimage.png'"
                :alt="`Portada de la última serie en la wishlist ${lastSerie?.name || 'sin título'}`">
            <div class="flex flex-col justify-between p-4 leading-normal">

                <p class="mb-3 font-medium text-gray-700 dark:text-gray-400">Tu lista de series para ver </p>
                <p>{{ seriesToWatch.length }}</p>
            </div>
            </Link>
</template>