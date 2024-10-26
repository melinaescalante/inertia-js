<script setup>

import { Link } from '@inertiajs/vue3';
import NavBar from '../components/NavBar.vue'
import ButtonGoBack from '../components/ButtonGoBack.vue'
const regionNamesInEnglish = new Intl.DisplayNames(['es'], { type: 'region' });
console.log(regionNamesInEnglish.of('US'))
defineProps({
    seasons: Array,
    name:String
})
</script>
<template>
    <NavBar></NavBar>
<h1 class="font-medium text-2xl m-2 mt-3 mb-3">{{ name }} episodios</h1>
    <div v-for="(season, index) in seasons">
        <h1 class="font-medium ms-2 text-lg">
            Temporada {{ index }} 
        </h1>
        <div v-for="episode in season">
            <Link  class=" m-2 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            
                    <img class="object-cover w-full rounded-t-lg h-52  md:w-44  md:rounded-none md:rounded-s-lg" :src="episode.image?episode.image.medium:'noimage.png'" alt="">
                    <div class="flex flex-col justify-between p-4 leading-normal">
                        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ episode.name }}</h2>
                        <p>Temporada {{ episode.season}} episodio {{ episode.number }}</p>
                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400" v-html="episode.summary.length>200?`${episode.summary.slice(0,200)}...`:episode.summary"></p>
                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"> Estreno {{  episode.airdate}} </p>
                    </div>
                </Link>
        </div>
{{ console.log(season) }}
    </div>
</template>