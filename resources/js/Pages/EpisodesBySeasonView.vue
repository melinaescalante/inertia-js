<script setup>
import NavBar from '../components/NavBar.vue'
import { Link } from '@inertiajs/vue3';
defineProps({
    episodesBySeason: Array,
    name:String
})
// console.log(episodesBySeason)
</script>
<template>
    <NavBar></NavBar>
    <h1>Episodios</h1>
    <div v-for="episodes in episodesBySeason">

        <!-- <Link  class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" :src="episodes.image.medium?episodes.image.medium:'noimage.png'" alt="">
                <div class="flex flex-col justify-between p-4 leading-normal">
                    <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Temporada {{ index+1 }}</h2>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ episodes }} episodios</p>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{episodes }} </p>
                </div>
            </Link> -->
    </div>
</template>