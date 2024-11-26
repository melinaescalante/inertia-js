<script setup>
import { Link } from '@inertiajs/vue3';
import NavBar from '../../components/NavBar.vue'

import { onMounted } from 'vue';
defineProps({
    episode: Object,

})



</script>
<template>
    <NavBar></NavBar>
    <article class="skiptranslate">
        <h1 class="text-2xl font-medium ps-2 mt-3 mb-3 border-t-orange-0 border-b border-t border-b-orange-0">
            {{ episode['name'] }}

        </h1>
        <h2 class="text-lg ms-2 text-blue-1000">
            {{ 'Temporada ' + episode.season + ' episodio ' + episode.number }}
        </h2>
        <div class="flex  flex-col gap-3 m-2">
            <div>

                <img class="h-auto md:h-72 w-auto rounded-md"
                    :src="episode.image?.original ? episode.image.original : '/noimage.png'"
                    :alt="`Imagen de portada del episodio de ${episode['name']}`">
            </div>
            <div class="flex flex-col gap-5">
                <p v-if="episode.summary"><strong>Descripción</strong>:</p>
                <p v-else class="italic ">Sin información de descripción</p>
                <div v-if="episode.summary" class="leading-7" v-html="episode.summary" </div>


                    <p v-if="episode.rating.average"><strong>Puntuación</strong>: {{ episode.rating.average }}</p>
                    <p v-else class="italic ">Sin información de puntuación</p>
                    <p  v-if="episode.airdate"><strong>Estreno</strong>: {{ episode.airdate }}</p>
                    <p class="italic " v-else>Sin información de estreno</p>
                </div>
            </div>
    </article>
</template>