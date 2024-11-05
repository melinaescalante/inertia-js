
Copiar código
<script setup>
import { Link, router } from '@inertiajs/vue3';

const props = defineProps({
    data: Array,
    imgContent: String,
    altImgContent: String,
    text: String,
    title: String,
    description: String,
    lastSerieName: String,
    route: String,
    dataKey: String, 
});

function visit() {
    router.visit(props.route, {
        data:{
            [props.dataKey]: props.data
        } 
    });
}
</script>
<template>
    {{ console.log(data) }}
    <Link @click="visit" :data="data"
        class=" m-2 flex  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">

    <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
        :src="imgContent || '/public/noimage.png'"
        :alt="`Portada de la última serie en la wishlist ${lastSerieName || 'sin título'}`">
    <div class="flex flex-col justify-between p-4 leading-normal">

        <p class="mb-3 font-medium text-gray-700 dark:text-gray-400">{{ text }}</p>
        <p>{{ data.length }}</p>
    </div>
    </Link>
</template>