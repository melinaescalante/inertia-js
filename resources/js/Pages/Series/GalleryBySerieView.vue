<script setup>

import { Link } from '@inertiajs/vue3';
import NavBar from '../../components/NavBar.vue'

defineProps({
  backgrounds: Array,
  banners: Array,
  posters: Array,
  name: String,
  id: String
})

</script>
<template>
  <NavBar></NavBar>
  <h1 class="font-medium text-2xl m-2 mt-20 mb-3">Galeria {{ name }}</h1>
  <section id="gallery" class="mb-28 mt-4">
    <h2 class="m-2 font-medium text-lg" v-if="posters.length >= 1">Posters</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 m-2">
      <div v-for="image in posters">

        <Link
          :href="`/show/${name}/${id}/${image.id}/imagen?imageUrl=${encodeURIComponent(image.resolutions.medium.url ? image.resolutions.medium.url : image.resolutions.original.url)}`">
        <img class="h-auto max-w-full rounded-lg"
          :src="image.resolutions.medium.url ? image.resolutions.medium.url : image.resolutions.original.url"
          :alt="`Poster de ${name} número ${image.id}`">
        </Link>

      </div>
    </div>

    <h2 class="m-2 font-medium text-lg" v-if="banners.length >= 1">Banners</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 m-2">

      <div v-for="image in banners">
        <Link
          :href="`/show/${name}/${id}/${image.id}/imagen?imageUrl=${encodeURIComponent(image.resolutions.medium.url ? image.resolutions.medium.url : image.resolutions.original.url)}`">
        <img class="h-auto max-w-full rounded-lg"
          :src="image.resolutions.medium.url ? image.resolutions.medium.url : image.resolutions.original.url" alt="">
        </Link>
      </div>
    </div>

    <h2 class="m-2 font-medium text-lg" v-if="backgrounds.length >= 1">Fondos</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 m-2">

      <div v-for="image in backgrounds">
        <Link
          :href="`/show/${name}/${id}/${image.id}/imagen?imageUrl=${encodeURIComponent(image.resolutions.original.url)} `">
        <img class="h-auto max-w-full rounded-lg" :src="image.resolutions.original.url" alt=""></Link>
      </div>
    </div>
  </section>
</template>