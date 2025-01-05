<script setup>
import { Link } from '@inertiajs/vue3';
import NavBar from '../../components/NavBar.vue'

defineProps({
    seasons: Object,
    name:String,
    ids:Array
})
</script>
<template>
    <NavBar></NavBar>
<h1 class="font-medium text-2xl m-2 mt-3 mb-3">{{ name }} episodios</h1>
    <div v-for="(season, index) in seasons" :key="index">
        <h1 class="font-medium p-2 text-xl text-blue-800 border-b-2 border-t-2 border-orange-200  ">
            {{(seasons[index][0]?.season)?'Temporada '+seasons[index][0].season : 'No tiene numero de temporada'  }}  
    
         </h1>
        <div v-for="episode in season">
            <Link :href="`/show/episode/${episode.id}`"  class=" m-2 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">
            
                    <img class="object-cover w-full rounded-t-lg h-52  md:w-44  md:rounded-none md:rounded-s-lg" :src="episode.image?episode.image.medium:'/noimage.png'" alt="">
                    <div class="flex flex-col justify-between p-4 leading-normal">
                        <h2 class="mb-2 text-2xl font-medium tracking-tight text-gray-900 ">{{ episode.name }}</h2>
                        <p class="mb-2 font-normal">Temporada {{ episode.season}} episodio {{ episode.number }}</p>
                        <p class="mb-3 font-light text-gray-700" v-html="episode.summary.length > 200 ? episode.summary.slice(0, 200) + '...' : episode.summary"></p>

                        <p class="mb-3 font-normal text-gray-700 "> Estreno {{  episode.airdate}} </p>
                    </div>
                </Link>
                </div>
    </div>
</template>