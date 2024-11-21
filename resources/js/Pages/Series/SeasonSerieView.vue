<script setup>
import { Link } from '@inertiajs/vue3';
import NavBar from '../../components/NavBar.vue'
defineProps({
    seasons: Array,
    name:String
})
</script>
<template>
    <NavBar></NavBar>
<h1 class="font-bold text-2xl m-2 mt-3 mb-3">Temporadas {{ name }}</h1>
<section>

    <div v-for="(season,index) in seasons"  class="mt-2 mb-2 m-2">
        <Link :href="`/show/temporadas/episodios/${name}/${index+1}/${season.id}`" class="flex items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">
            <img class="object-cover  rounded-t-lg md:h-96 h-52 w-36  md:w-48 md:rounded-none md:rounded-s-lg" :src="season.image?.medium?season.image.medium:'/noimage.png'" alt="">
            <div class="flex flex-col justify-between p-4 leading-normal">
                <h2 class="mb-2 text-2xl font-medium tracking-tight text-gray-900 ">Temporada {{ index+1 }}</h2>
                <p class="mb-3 font-normal text-gray-700 ">{{ season.episodeOrder }} episodios</p>
                <p class="mb-3 font-normal text-gray-700 ">{{ season.premiereDate }} </p>
            </div>
        </Link>
    </div>
</section>

</template>