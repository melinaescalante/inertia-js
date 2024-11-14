<script setup>
import NavBar from '../components/NavBar.vue'
import { allSeriesToWatch, allSeriesWatching, nextEpisode, allSeriesWatched, currentInformation } from '../../services/series';
import { ref, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';
import { useLoginUser } from '../composables/useLoginUser';
import Spinner from '../Components/Spinner.vue';
import CardWithData from '../Components/CardWithData.vue';
const seriesToWatch = ref([])
const seriesWatched = ref([])
const seriesWatching = ref([])
const localSeriesWatching = ref([])
const seriesWatchingJson = ref([])
const { loginUser } = useLoginUser()
const loading = ref(true)
const lastSerie = ref()
const lastSerieWatched = ref()
onMounted(async () => {
    if (loginUser.value?.id) {
        await loadSeriesToWatch()
        await loadSeriesWatching()
        await loadSeriesWatched()

        loading.value = false
    } else {
        loading.value = false

    }


})

async function loadSeriesWatched() {
    seriesWatched.value = await allSeriesWatched(loginUser.value.id)
    try {
        if (seriesWatched.value === false) return;
        if (seriesWatched) {
            const lastWatchedSerie = seriesWatched.value.at(-1);
            if (lastWatchedSerie) {
                const response = await fetch('https://api.tvmaze.com/singlesearch/shows?q=' + Object.keys(lastWatchedSerie)[1] + '')
                if (response) {
                    const json = await response.json();
                    // console.log(json )
                    lastSerieWatched.value = json

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
        if (seriesToWatch === false) return
        if (seriesToWatch) {
            const lastSeries = seriesToWatch.value.at(-1);
            if (lastSeries) {
                const response = await fetch('https://api.tvmaze.com/shows/' + Object.keys(lastSeries)[0] + '')
                if (response) {
                    const json = await response.json();
                    lastSerie.value = json

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
    // console.log(seriesWatching.value, 'viendo')
    if (seriesWatching === false) return

    localSeriesWatching.value = seriesWatching.value;
    try {
        if (seriesWatching.value?.length) {
            const promises = seriesWatching.value.map((serie) => {
                Object.keys(serie).map(async (showId) => {  // Itera sobre cada ID en el objeto `serie`
                    const response = await fetch(`https://api.tvmaze.com/shows/${showId}`);
                    if (response.ok) {
                        const json = await response.json();
                        seriesWatchingJson.value.push(json);  // 
                        // console.log(seriesWatchingJson.value)
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
            // console.log(seasons)
        }
        const { currentEpisode: episode, currentSeason: season, currentIdSeason: idSeason } = await currentInformation(loginUser.value.id, idSerie)
 
        const value = await nextEpisode(id, idSerie, idSeason, season, episode, nameSerie)
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
        } else if (value === 'endSeason') {

            const updatedSeries = localSeriesWatching.value.map(serie => {
                if (serie.hasOwnProperty(idSerie)) {

                    const { [idSerie]: _, ...rest } = serie;
                    return rest;
                }
                return serie;
            });

            seriesWatchingJson.value = seriesWatchingJson.value.filter(serie => serie.id !== idSerie);
            await loadSeriesWatched()
        }
        // console.log("Updated seriesWatching:", localSeriesWatching.value);
    } catch (error) {
        console.error(error);
    }
}
</script>
<template>
    <NavBar></NavBar>
    <div v-if="loading" class="flex justify-center mt-[50%]">
        <Spinner>

        </Spinner>
    </div>
    <template v-else>

        <h1 class="text-xl m-4" v-if="!seriesWatching">
            Oops, no tienes ni una serie empezada!

        </h1>
        <h1 v-else class="text-2xl font-medium ms-2 mt-3 mb-3">Series empezadas</h1>

        <div class="flex flex-col gap-3 m-4">
            <Link href="/buscador" v-if="!seriesWatching"
                class="text-white text-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
            Empezar
            nueva serie
            

            </Link>
            <div v-for="(serie, index) in seriesWatchingJson" class="m-2 grid items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 
           sm:grid-cols-1 md:grid-cols-3 md:max-w-xl md:gap-5">
                <Link :href="`/show/${serie.id}`" class="col-span-2 flex items-center space-x-4 p-1">
                <img class="object-cover w-28 h-auto rounded-lg"
                    :src="serie.image ? serie.image.medium : '/public/noimage.png'"
                    :alt="`Portada de la última serie en la wishlist ${serie.name}`">
                <div class="flex flex-col justify-center">
                    <h2 class="text-2xl font-bold tracking-tight text-gray-900">{{ serie.name }}</h2>
                    <p v-if="localSeriesWatching.find(series => series[serie.id])?.[serie.id].state !== 'end'"
                        class="text-gray-700 font-medium">
                        Estas viendo de la temporada {{ localSeriesWatching.find(series =>
                            series[serie.id])?.[serie.id].currentSeason }}
                        capítulo {{ localSeriesWatching.find(series => series[serie.id])?.[serie.id].current }}
                    </p>
                    <p v-else>Has terminado la serie</p>
                </div>
                </Link>
                <button v-if="localSeriesWatching.find(series => series[serie.id])?.[serie.id].state !== 'end'"
                    @click.stop="next(loginUser.id, serie.id, serie.name)" type="button" class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
                   focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                   md:col-span-1 lg:justify-self-center lg:self-center  md:ms-0 md:self-center sm:items-start md:m-2 mb-2 ms-3 self-end sm:m-2 ">
                    Siguiente
                </button>
            </div>

            <h2 class="text-xl m-4 ms-2" v-if="!seriesToWatch.length >= 1">Ops, no tienes ni una serie en tu lista!</h2>

            <div class="" v-if="!seriesToWatch.length >= 1">
                <Link href="/buscador"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 block w-full text-center">
                Agregar
                serie a wishlist</Link>

            </div>
            <div v-if="seriesToWatch.length >= 1 && !loading">
                <h2 class="text-2xl font-medium ms-2 mt-3 mb-3">Series en tu lista</h2>
                <CardWithData :data=seriesToWatch :imgContent="lastSerie?.image?.medium"
                    :altImgContent="lastSerie?.name" text="Tu lista de series para ver" route="/wishlist"
                    dataName="seriesToWatch">
                </CardWithData>

            </div>
            <div v-if="seriesWatched.length >= 1 && !loading">

                <h2 class="text-2xl font-medium ms-2 mt-3 mb-3">Series vistas</h2>

                <CardWithData :data=seriesWatched :imgContent="lastSerieWatched?.image?.medium"
                    :altImgContent="lastSerieWatched?.name" text="Tu lista de series vistas" dataName="seriesWatched"
                    :lastSerieName="lastSerieWatched?.name" route="/seriesVistas">
                </CardWithData>
            </div>
        </div>
    </template>
</template>
