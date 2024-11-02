<script setup>
import NavBar from '../components/NavBar.vue'
import { allSeriesToWatch, allSeriesWatching, nextEpisode } from '../../services/series';
import { RouterLink } from 'vue-router';
import { suscribeToAuthChanged } from "../../services/auth";
import { currentInformation } from '../../services/series';
import { ref, onMounted, onUnmounted } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import { allSeriesWatched } from '../../services/series';

let unSubscribeFromAuth = () => { };
const seriesToWatch = ref([])
const seriesWatched = ref([])
const seriesWatching = ref([])
const localSeriesWatching = ref([])
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
const lastSerieWatched = ref()
onMounted(async () => {
    unSubscribeFromAuth = suscribeToAuthChanged(newUserData => loginUser.value = newUserData)
    await loginUser.value
    if (loginUser.value?.id) {
        await loadSeriesToWatch()
        await loadSeriesWatching()
        await loadSeriesWatched()
        loading.value = false
    }


})
onUnmounted(() => {
    unSubscribeFromAuth();

})
async function loadSeriesWatched() {
    seriesWatched.value = await allSeriesWatched(loginUser.value.id)
    try {
        if (seriesWatched===[])return
        if (seriesWatched) {
            const lastWatchedSerie = seriesWatched.value.at(-1);
            if (lastWatchedSerie) {
                const response = await fetch('https://api.tvmaze.com/singlesearch/shows?q=' + Object.keys(lastWatchedSerie)[0] + '')
                if (response) {
                    const json = await response.json();
                    // console.log(json )
                    lastSerieWatched.value = json
                    loading.value = false;

                }
            }
        } else {
            console.error('El array seriesWatched está vacío.');
        }
    } catch (error) {
        throw new Error(error);
    }  
}
async function loadSeriesToWatch() {
    seriesToWatch.value = await allSeriesToWatch(loginUser.value.id)
    try {
        if (seriesToWatch===[])return
        if (seriesToWatch) {
            const lastSeries = seriesToWatch.value.at(-1);
            if (lastSeries) {
                const response = await fetch('https://api.tvmaze.com/shows/' + Object.keys(lastSeries)[0] + '')
                if (response) {
                    const json = await response.json();
                    console.log(json )
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


async function loadSeriesWatching() {
    seriesWatching.value = await allSeriesWatching(loginUser.value.id)
    console.log(seriesWatching.value)
    if (seriesWatching===[])return

    localSeriesWatching.value = [...seriesWatching.value];
    try {
        if (seriesWatching.value?.length) {
            const promises = seriesWatching.value.map((serie) => {
                Object.keys(serie).map(async (showId) => {  // Itera sobre cada ID en el objeto `serie`
                    const response = await fetch(`https://api.tvmaze.com/shows/${showId}`);
                    if (response.ok) {
                        const json = await response.json();
                        seriesWatchingJson.value.push(json);  // 
                    }
                })
            }
            );

            await Promise.all(promises);
        } else {
            console.log('El array seriesToWatch está vacío.');
        }

    } catch (error) {
        throw new Error(error);
    }
}
async function next(id, idSerie, nameSerie) {
    let seasons
    try {
        const response = await fetch(`https://api.tvmaze.com/shows/${idSerie}/seasons`);
        if (response.status == 200) {
            seasons = await response.json();
            console.log(seasons)
        }
        const { currentEpisode: episode, currentSeason: season ,currentIdSeason:idSeason} = await currentInformation(loginUser.value.id, idSerie)
        // console.log(id, idSerie, seasons[0].id, season, episode)
        const value = await nextEpisode(id, idSerie, idSeason, season, episode,nameSerie)
        if (value === 'episode') {

            const updatedSeries = localSeriesWatching.value.map(serie => {
                if (serie[idSerie]) {
                    return {
                        ...serie,
                        [idSerie]: {
                            ...serie[idSerie],
                            current: episode + 1
                        }
                    };
                }
                return serie;
            });
            localSeriesWatching.value = updatedSeries;


        } else if (value === 'season') {
            console.log('soy season')
            const updatedSeries = localSeriesWatching.value.map(serie => {
                if (serie[idSerie]) {
                    return {
                        ...serie,
                        [idSerie]: {
                            current: 1,
                            currentSeason: season + 1,
                            currentIdSeason: idSeason + 1,
                        }
                    };
                }
                return serie;
            });
            localSeriesWatching.value = updatedSeries;
        }else if(value==='endSeason'){
            const updatedSeries = localSeriesWatching.value.map(serie => {
                if (serie[idSerie]) {
                    return {
                        ...serie,
                        [idSerie]: {
                            current: episode,
                            currentSeason: season,
                            currentIdSeason: idSeason ,
                            state:'end'
                        }
                    };
                }
                return serie;
            });
            localSeriesWatching.value = updatedSeries;
        }
        console.log("Updated seriesWatching:", localSeriesWatching.value);
    } catch (error) {
        console.error( error);
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
    {{ console.log(seriesWatched) }}
    <h1 class="text-xl m-4"
    v-if="!seriesWatching.length >=1">
        Oops, no tienes ni una serie empezada!

    </h1>
    <h1 v-else class="text-2xl font-medium ms-2 mt-3 mb-3">Series empezadas</h1>

    <div class="flex flex-col gap-3 m-4">
        <Link href="/buscador"
            v-if="!seriesWatching.length >=1"
            class="text-white text-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
        Empezar
        nueva serie
        </Link>
        <div v-else v-for="(serie, index) in seriesWatchingJson"
            class=" m-2 flex  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">
            <Link :href="`/show/${serie.id}`" class="flex">

            <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
                :src="serie.image ? serie.image.medium : '/public/noimage.png'"
                :alt="`Portada de la última serie en la wishlist ${serie.name}`">
            <div class="flex flex-col p-4 ">
                <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ serie.name }}</h2>
                <p v-if="localSeriesWatching.find(series =>
                    series[serie.id])?.[serie.id].state!=='end'" class="mb-3 font-medium text-gray-700 dark:text-gray-400">
                    Estas viendo de la temporada {{ localSeriesWatching.find(series =>
                        series[serie.id])?.[serie.id].currentSeason }} capítulo {{ localSeriesWatching.find(series =>
                        series[serie.id])?.[serie.id].current }}
                </p>
                <p v-else>Has terminado la serie</p>
            </div>
            </Link>
            <button v-if="localSeriesWatching.find(series =>
                        series[serie.id])?.[serie.id].state!=='end'" @click.stop="next(loginUser.id, serie.id,serie.name)" type="button"
                class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 self-end ">Lo
                terminé</button>
        </div>
        <h2 class="text-xl m-4" v-if="!seriesToWatch.length >=1">Ops, no tienes ni una serie en tu lista!</h2>
        
        <div class="" v-if="!seriesToWatch.length >=1">
            <Link href="/buscador"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 block w-full text-center">Agregar
                serie a wishlist</Link>

        </div>
        <div v-if="seriesToWatch.length >=1 && !loading">
            <h2 class="text-2xl font-medium ms-2 mt-3 mb-3">Series en tu lista</h2>
            <Link @click="visit" :data="{ seriesToWatch: seriesToWatch.value }"
                class=" m-2 flex  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">

            <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
                :src="lastSerie?.image?.medium || '/public/noimage.png'"
                :alt="`Portada de la última serie en la wishlist ${lastSerie?.name || 'sin título'}`">
            <div class="flex flex-col justify-between p-4 leading-normal">

                <p class="mb-3 font-medium text-gray-700 dark:text-gray-400">Tu lista de series para ver </p>
                <p>{{ seriesToWatch.length }}</p>
            </div>
            </Link>
        </div>
        <div v-if="seriesWatched.length >=1 && !loading">
            <h2 class="text-2xl font-medium ms-2 mt-3 mb-3">Series vistas</h2>
            <Link @click="visit" :data="{ seriesToWatch: seriesToWatch.value }"
                class=" m-2 flex  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">

            <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
                :src="lastSerieWatched?.image?.medium || '/public/noimage.png'"
                :alt="`Portada de la última serie en la wishlist ${lastSerieWatched?.name || 'sin título'}`">
            <div class="flex flex-col justify-between p-4 leading-normal">

                <p class="mb-3 font-medium text-gray-700 dark:text-gray-400">Tu lista de series vistas </p>
                <p>{{ seriesWatched.length }}</p>
            </div>
            </Link>
        </div>
    </div>
</template>
