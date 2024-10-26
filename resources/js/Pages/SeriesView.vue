<script setup>
import NavBar from '../components/NavBar.vue'
import { allSeriesToWatch , allSeriesWatching} from '../../services/series';
import { suscribeToAuthChanged } from "../../services/auth";

import { ref, onMounted, onUnmounted } from 'vue';
import { Link, router } from '@inertiajs/vue3';

let unSubscribeFromAuth = () => { };
const seriesToWatch = ref([])
const seriesWatching = ref([])
const seriesWatchingJson = ref([])
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
            if (seriesToWatch.value !== null && seriesToWatch.value !== undefined) {
                const lastSeries = seriesToWatch.value.at(-1);
                    if (lastSeries !== undefined && lastSeries !== null) {
                    const response = await fetch('https://api.tvmaze.com/shows/' + Object.keys(lastSeries)[0] + '')
                
                    if (response) {
                        const json = await response.json();
                        lastSerie.value = json
                        loading.value = false;

                    }
                }
                // return
            } else {
                console.error('El array seriesToWatch está vacío.');
            }

        } catch (error) {
            throw new Error(error);
        }
    }
if (loginUser.value.id !== null && loginUser.value.id !== undefined) {
    seriesWatching.value = await allSeriesWatching(loginUser.value.id)
    try {
            if (seriesWatching.value !== null && seriesWatching.value !== undefined) {
              
                    seriesWatching.value.forEach(async serie => {
                        
                            const response = await fetch('https://api.tvmaze.com/shows/' + Object.keys(serie)[0] + '')
                            
                            if (response) {
                                const json = await response.json();
                     seriesWatchingJson.value.push(json)
                     console.log(seriesWatchingJson.value)
                                loading.value = false;
                                
                            
                        }
                    });
                // return
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

function visit() {
    router.visit('/wishlist', {

        data: {
            seriesToWatch: seriesToWatch.value
        },
    });
    console.log(seriesToWatch)
}
</script>
<template>
    <NavBar></NavBar>

    <p class="text-xl m-4">Oops, no tienes ni una serie empezada!</p>
    <div class="flex flex-col gap-3 m-4">

        {{console.log(seriesWatching)}}
        <button  v-if="seriesWatching === undefined"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Empezar
            nueva serie</button>
            <div v-else v-for="serie in seriesWatchingJson">
                {{console.log(serie)}}
                <Link @click="" :data="{ }"
                class=" m-2 flex  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">

                <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
                :src="serie.image ? serie.image.medium : '/public/noimage.png'"
                :alt="`Portada de la última serie en la wishlist ${serie.name}`">
                <div class="flex flex-col justify-between p-4 leading-normal">
                <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ serie.name }}</h2>
                <p class="mb-3 font-medium text-gray-700 dark:text-gray-400">Estas viendo </p>
                <p>{{ serie.length }}</p>
            </div>
            </Link>
            </div>

        <div class="" v-if="seriesToWatch === undefined">
            <a href="/buscador"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 block w-full text-center">Agregar
                serie a wishlist</a>

        </div>
        <div v-if="seriesToWatch !== undefined && !loading">
            <Link @click="visit" :data="{ seriesToWatch: seriesToWatch.value }"
                class=" m-2 flex  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">

            <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
                :src="lastSerie.image ? lastSerie.image.medium : '/public/noimage.png'"
                :alt="`Portada de la última serie en la wishlist ${lastSerie.name}`">
            <div class="flex flex-col justify-between p-4 leading-normal">
 
                <p class="mb-3 font-medium text-gray-700 dark:text-gray-400">Tu lista de series para ver </p>
                <p>{{ seriesToWatch.length }}</p>
            </div>
            </Link>
        </div>
    </div>
</template>
