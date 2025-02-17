<script setup>

import { Link } from '@inertiajs/vue3';
import NavBar from '../../components/NavBar.vue'
import ButtonGoBack from '../../components/ButtonGoBack.vue'

defineProps({
    imageUrl: String,
    name:String,
    idimage:String,
    foundImage:Object
})
</script>
<template>
    <NavBar></NavBar>
    <article class="mb-28 mt-20">
    <div class="m-2">
        
        <h1 class="text-xl font-medium  mt-3 mb-3">{{ name }}</h1>
        <img class="border rounded-lg" v-if="imageUrl" :src="foundImage.resolutions.original.url" :alt="`Imagen número ${idimage} de la serie de ${name}`"/>
        <p class="text-gray-500 mt-2">Tipo: {{ foundImage.type }}</p>
    </div>

    </article>
    </template>