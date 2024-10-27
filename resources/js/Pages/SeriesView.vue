<script setup>
import NavBar from '../components/NavBar.vue'
import { allSeriesToWatch, allSeriesWatching, nextEpisode } from '../../services/series';
import { suscribeToAuthChanged } from "../../services/auth";

import { ref, onMounted, onUnmounted } from 'vue';
import { Link, router } from '@inertiajs/vue3';


let unSubscribeFromAuth = () => { };
const seriesToWatch = ref([])
const seriesWatching = ref([])
const localSeriesWatching=ref([])
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
            } else {
                console.error('El array seriesToWatch está vacío.');
            }

        } catch (error) {
            throw new Error(error);
        }
    }
    if (loginUser.value.id !== null && loginUser.value.id !== undefined) {
        seriesWatching.value = await allSeriesWatching(loginUser.value.id)
        localSeriesWatching.value = seriesWatching.value || []
        try {
            if (seriesWatching.value !== null && seriesWatching.value !== undefined) {
                seriesWatching.value.forEach(async (serie) => {
            
                    for (const key of Object.keys(serie)) {
                        const response = await fetch(`https://api.tvmaze.com/shows/${key}`);
                      

                        if (response.ok) {
                            const json = await response.json();
                            seriesWatchingJson.value.push(json);
                         
                        }
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


async function next(id, idSerie) {
    try {
        await nextEpisode(id, idSerie)
       
        const updatedSeries = localSeriesWatching.value.map(serie => {
            if (serie[idSerie]) {
                return {
                    ...serie, 
                    [idSerie]: {
                        ...serie[idSerie], // Copia el objeto correspondiente
                        current: serie[idSerie].current + 1 // Aumenta el capítulo actual
                    }
                };
            }
            return serie;
        });
        localSeriesWatching.value = updatedSeries;
        console.log("Updated seriesWatching:", localSeriesWatching.value);
    } catch (error) {
        console.error("Error ", error);
    }
}



function visit() {
    router.visit('/wishlist', {

        data: {
            seriesToWatch: seriesToWatch.value
        },
    });

}
</script>
<template>
    <NavBar></NavBar>

    <h1 class="text-xl m-4" v-if="seriesWatching === undefined">Oops, no tienes ni una serie empezada!</h1>
    <h1 v-else class="text-2xl font-medium ms-2 mt-3 mb-3">Series empezadas</h1>
    <div class="flex flex-col gap-3 m-4">
        <button v-if="seriesWatching === undefined"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Empezar
            nueva serie</button>
        <div v-else v-for="(serie, index) in seriesWatchingJson" class=" m-2 flex  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">
            <Link :href="`/show/${serie.id}`"
                class="flex">

            <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
                :src="serie.image ? serie.image.medium : '/public/noimage.png'"
                :alt="`Portada de la última serie en la wishlist ${serie.name}`">
            <div class="flex flex-col p-4 ">
                <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ serie.name }}</h2>
                <p class="mb-3 font-medium text-gray-700 dark:text-gray-400">
                    Estas viendo el capítulo {{ Object.values(localSeriesWatching[0][serie.id])[0] }}
                </p>
            </div>
        </Link>
        <button @click.stop="next(loginUser.id,serie.id)" type="button"
            class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 self-end ">Lo
            terminé</button>
        </div>
        <h2 class="text-xl m-4" v-if="seriesToWatch === undefined">Ops, no tienes ni una serie en tu lista!</h2>
        <h2 v-else class="text-2xl font-medium ms-2 mt-3 mb-3">Series en tu lista</h2>

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
