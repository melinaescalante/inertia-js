<script setup>
import NavBar from '../components/NavBar.vue'
import { allSeriesToWatch } from '../../services/series';
import { suscribeToAuthChanged } from "../../services/auth";

import { ref, onMounted, onUnmounted } from 'vue';
import { Link, router } from '@inertiajs/vue3';

let unSubscribeFromAuth = () => { };
const seriesToWatch = ref([])
const loginUser = ref({
    id: null,
    email: null,
    displayName: null,
    bio: null,
    genres: null

})
const loading = ref(true)
const lastSerie = ref()
onMounted(async () => {
    unSubscribeFromAuth = suscribeToAuthChanged(newUserData => loginUser.value = newUserData)
    await loginUser.value
    if (loginUser.value.id !== null && loginUser.value.id !== undefined) {
        seriesToWatch.value = await allSeriesToWatch(loginUser.value.id)
        try {
            if (seriesToWatch.value !==null && seriesToWatch.value !==undefined ) {
                const lastSeries = seriesToWatch.value.at(-1);
console.log(lastSeries[0])

                if (lastSeries!== undefined && lastSeries!==null ) {
                    const response = await fetch('https://api.tvmaze.com/shows/' + Object.keys(lastSeries)[0] + '')
                    // resto de tu código...
                    if (response) {
                        const json = await response.json();
                        lastSerie.value = json
                        loading.value = false;
                        // console.log(lastSerie.value)
                    }
                } 
            } else {
                console.error('El array seriesToWatch está vacío.');
            }

        } catch (error) {
            throw new Error(error);
        }
    }


})
onUnmounted(() => {
    unSubscribeFromAuth();

})
import { Inertia } from '@inertiajs/inertia';
function visit() {
    router.visit('/wishlist', {
        // method: 'post', 
        data: {
            seriesToWatch: seriesToWatch.value
        },
    });
    console.log(seriesToWatch)
}
</script>
<template>
    <NavBar></NavBar>
    <!-- <SearchComponent></SearchComponent> -->
    <p class="text-xl m-4">Oops, no tienes ni una serie empezada!</p>
    <div class="flex flex-col gap-3 m-4">

        <button
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Empezar
            nueva serie</button>
            {{ console.log(seriesToWatch.value) }}
        <div v-if="seriesToWatch === undefined">
            <button
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Agregar
                serie a wishlist</button>
                
            </div>
            <div v-if="seriesToWatch !== undefined && !loading">
            <Link @click="visit" :data="{ seriesToWatch: seriesToWatch.value }"

                class=" m-2 flex  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">

            {{ console.log(seriesToWatch) }}
            <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
                :src="lastSerie.image ? lastSerie.image.medium : '/public/noimage.png'"
                :alt="`Portada de la última serie en la wishlist ${lastSerie.name}`">
            <div class="flex flex-col justify-between p-4 leading-normal">
                <p class="mb-3 font-medium text-gray-700 dark:text-gray-400">Tu lista de series para ver </p>
                <p>{{ seriesToWatch.length }}</p>
                <!-- <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ episodes.name }}
                </h2>
                <p>Temporada {{ episodes.season }} episodio {{ episodes.number }}</p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"
                    v-html="episodes.summary.length > 200 ? `${episodes.summary.slice(0, 200)}...` : episodes.summary"></p>-->
            </div>
            </Link>
        </div>
    </div>
</template>
