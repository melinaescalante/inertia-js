<script setup>

import { Link } from '@inertiajs/vue3';
import NavBar from '../components/NavBar.vue'
defineProps({
    backgrounds: Array,
    banners: Array,
    posters: Array,
    name: String
})</script>
<template>
    <NavBar></NavBar>
    <h1 class="font-medium text-2xl m-2 mt-3 mb-3">Galeria {{ name }}</h1>
    <h2 class="m-2 font-medium text-lg">Posters</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 m-2">
    <div v-for="image in posters" >
        {{ image }}
        <a href="/images/11299/gilmore-girls-image-11299"><img src="https://static.tvmaze.com/uploads/images/medium_untouched/4/11308.jpg" alt="Gilmore Girls"></a>
      <a :href="`${image.resolutions.medium.url}`"><img class="h-auto max-w-full rounded-lg" :src="image.resolutions.medium.url?image.resolutions.medium.url: image.resolutions.original.url" :alt="`Poster de ${name} número ${image.id}`"></a>
    </div>
</div>

    <h2 class="m-2 font-medium text-lg">Banners</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 m-2">

    <div v-for="image in banners" >
        <a href="">
      <img class="h-auto max-w-full rounded-lg" :src="image.resolutions.medium.url?image.resolutions.medium.url: image.resolutions.original.url" alt=""></a>
    </div>
</div>

    <h2 class="m-2 font-medium text-lg">Fondos</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 m-2">

    <div v-for="image in backgrounds" >
    <a href="">
      <img class="h-auto max-w-full rounded-lg" :src="image.resolutions.original.url" alt=""></a>
    </div>
  </div>

</template>