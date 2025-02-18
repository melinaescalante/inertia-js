
<script setup>
import { Link } from '@inertiajs/vue3';
const props = defineProps({
    data: Array,
    imgContent: String,
    altImgContent: String,
    text: String,
    title: String,
    lastSerieName: String,
    route: String,
    dataName: String, 
});
</script>
<template>

    <Link :href="props.route"   
        class=" m-2 flex  items-center bg-white border border-orange-0 rounded-lg shadow md:flex-row w-auto hover:bg-gray-100 ">

    <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
        :src="imgContent || '/noimage.png'"
        :alt="`Portada de la última serie en la wishlist ${lastSerieName || 'sin título'}`">
    <div class="flex flex-col justify-between p-4 leading-normal">

        <p class="mb-3 font-medium text-gray-700 ">{{ text }}</p>
        <p>{{ data.length }}</p>
    </div>
    </Link>
</template>