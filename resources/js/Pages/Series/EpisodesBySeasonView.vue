<script setup>
import NavBar from '../../components/NavBar.vue'
import { Link } from '@inertiajs/vue3';

defineProps({
    episodesBySeason: Array,
    name: String,
    season: String
})

</script>
<template>
    <NavBar></NavBar>
    <div id="gt-mordadam-43217984" class="hidden">
    </div>
    <h1 class="font-bold text-2xl m-2 mt-20 mb-3">Episodios de {{ name }} temporada {{ season }}</h1>
    <section id="episodes-by-season" class="mb-28 mt-4" >
    <div v-for="episodes in episodesBySeason">
        <div
            class=" m-2 flex flex-col items-start bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl ">

    <img class="object-cover w-full rounded-t-lg h-52  md:w-44  md:rounded-none md:rounded-s-lg"
                :src="episodes.image?.medium ? episodes.image.medium : '/noimage.png'" alt="">
            <div class="flex flex-col justify-between p-4 ps-2 leading-normal">
                <h2 class="mb-2 text-2xl font-medium tracking-tight text-gray-900 ">{{ episodes.name }}
                </h2>
                <p class="mb-2 font-normal">Temporada {{ episodes.season }} <span v-if="episodes.number !== null">episodio {{ episodes.number
                        }}</span> </p>
                <!-- <p class="mb-3 font-light text-gray-700 "
                    v-html="episodes.summary"></p> -->
                <Link class="font-medium text-blue-1000 m-3 ms-0" :href="`/show/episode/${episodes.id}`">Ver más</Link>
                <p class="mb-3 font-normal text-gray-700 ">{{ episodes.airdate }} </p>
            </div>

        </div>
    </div>
</section>

</template>