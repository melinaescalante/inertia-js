<script setup>
import { Link } from '@inertiajs/vue3';
import NavBar from '../../components/NavBar.vue'

defineProps({
    episode: Array,

})
</script>
<template>
    <NavBar></NavBar>
    <h1 class="text-2xl font-medium ms-2 mt-3 mb-3">
        {{ episode['name'] }}
    </h1>
    <h2 class="text-lg ms-2">
        {{ 'Temporada ' + episode.season + ' episodio ' + episode.number }}
    </h2>
    <div class="flex  flex-col gap-3 m-2">
        <div>

            <img class="h-auto md:h-72 w-auto rounded-md" :src="episode.image?.original ? episode.image.original : '/noimage.png'"
                :alt="`Imagen de portada del episodio de ${episode['name']}`">
        </div>
        <div class="flex flex-col gap-5">
            <p><strong>Descripción</strong>:</p>
            <div class="leading-7" v-html="episode.summary"></div>
    
            <p><strong>Puntuación</strong>: {{ episode.rating.average }}</p>
            <p><strong>Estreno</strong>: {{ episode.airdate }}</p>
        </div>
    </div>
</template>