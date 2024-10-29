<script setup>
import NavBar from '../../components/NavBar.vue'
import { Link } from '@inertiajs/vue3';
defineProps({
    episodesBySeason: Array,
    name:String,
    season:Number
})

// console.log(episodesBySeason)
</script>
<template>
    <NavBar></NavBar>
    <h1 class="font-medium text-2xl m-2 mt-3 mb-3">Episodios de  {{name  }} temporada {{ season }}</h1>

    <div v-for="episodes in episodesBySeason">

        <Link  class=" m-2 flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100">

                <img class="object-cover w-full rounded-t-lg h-52  md:w-44  md:rounded-none md:rounded-s-lg" :src="episodes.image.medium?episodes.image.medium:'noimage.png'" alt="">
                <div class="flex flex-col justify-between p-4 leading-normal">
                    <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ episodes.name }}</h2>
                    <p>Temporada {{ episodes.season }} episodio {{ episodes.number }}</p>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400" v-html="episodes.summary.length>200?`${episodes.summary.slice(0,200)}...`:episodes.summary"></p>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ episodes.airdate }} </p>
                </div>
            </Link>
    </div>
</template>