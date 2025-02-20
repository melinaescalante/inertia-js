<script setup>
import NavBar from '../components/NavBar.vue'
import { allSeriesToWatch, allSeriesWatching, nextEpisode, allSeriesWatched, currentInformation, backEpisode } from '../../services/series';
import ModalComponentDelete from '../components/ModalComponentDelete.vue';
import { ref, onMounted } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import { useLoginUser } from '../composables/useLoginUser';
import Spinner from '../Components/Spinner.vue';
import CardWithData from '../Components/CardWithData.vue';
import BottomSheet from '../components/BottomSheet.vue';
import { formatDate } from '../helpers/date';
const seriesToWatch = ref([])
const seriesWatched = ref([])
const seriesWatching = ref([])
const localSeriesWatching = ref([])
const seriesWatchingJson = ref([])
const { loginUser } = useLoginUser()
const loading = ref(true)
const lastSerie = ref()
const lastSerieWatched = ref()
const msgRemove = ref('')
const isBottomSheetOpen = ref(true);
function handleClose() {

    isBottomSheetOpen.value = false;
    setTimeout(() => {
        isBottomSheetOpen.value = true;
    }, 100);
}
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
            const lastWatchedSerie = seriesWatched.value.at(seriesWatched.value.lastIndexOf);
            if (lastWatchedSerie) {
                const response = await fetch('https://api.tvmaze.com/singlesearch/shows?q=' + lastWatchedSerie.nameSerie)
                if (response) {
                    const json = await response.json();
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
            const lastSeries = seriesToWatch.value.at(seriesToWatch.value.lastIndexOf);
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

    if (seriesWatching === false) return
    localSeriesWatching.value = seriesWatching.value;
    try {
        if (seriesWatching.value?.length) {
            let promises = seriesWatching.value.map((serie) => {
                Object.keys(serie).map(async (showId) => {  // 
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

            localSeriesWatching.value = seriesWatching.value;
            localSeriesWatching.value = seriesWatchingJson.value;
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
                            currentIdSeason: seasons[season - 1].id,
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
            router.replace(`/puntuarSerie/${nameSerie}/${idSerie}`)

        }

    } catch (error) {
        console.error(error);
    }
}
async function back(id, idSerie, nameSerie) {
    let seasons

    try {
        const response = await fetch(`https://api.tvmaze.com/shows/${idSerie}/seasons`);
        if (response.status == 200) {
            seasons = await response.json();
        }
        const { currentEpisode: episode, currentSeason: season, currentIdSeason: idSeason } = await currentInformation(loginUser.value.id, idSerie)

        const value = await backEpisode(id, idSerie, idSeason, season, episode, nameSerie)
        if (value === 'episode before') {

            const updatedSeries = localSeriesWatching.value.map(serie => {
                if (serie[idSerie]) {
                    return {
                        ...serie,
                        [idSerie]: {
                            ...serie[idSerie],
                            current: episode - 1
                        }
                    };
                }
                return serie;
            });
            localSeriesWatching.value = updatedSeries;



        } else if (value === 'season before') {
            const updatedSeries = localSeriesWatching.value.map(serie => {
                if (serie[idSerie]) {

                    return {
                        ...serie,
                        [idSerie]: {
                            current: seasons[season - 2].episodeOrder,
                            currentSeason: season - 1,
                            currentIdSeason: seasons[season - 1].id,
                        }
                    };
                }
                return serie;
            });
            localSeriesWatching.value = updatedSeries;
        } else if (value === 'remove') {

            const updatedSeries = localSeriesWatching.value.map(serie => {
                if (serie.hasOwnProperty(idSerie)) {

                    const { [idSerie]: _, ...rest } = serie;
                    return rest;
                }
                return serie;
            });

            seriesWatchingJson.value = seriesWatchingJson.value.filter(serie => serie.id !== idSerie);
            await loadSeriesWatched()
            msgRemove.value = 'Se ha removido ' + nameSerie + ' de "Series empezadas"'
            msgBoolean.value = true
            setTimeout(() => {
                msgRemove.value = '';
                msgBoolean.value = false

            }, 3000);

        }


    } catch (error) {
        console.error(error);
    }
}
const msgBoolean = ref(false)
function closeModal() {
    msgBoolean.value = false
}
</script>
<template>
    <NavBar></NavBar>
    <section id="mis-series" class="mb-28 mt-20">
        <div v-if="loading" class="flex justify-center mt-[50%]">
            <Spinner msg="Cargando actividad de mis series">

            </Spinner>
        </div>
        <template v-else>
            <div v-show="msgBoolean" id="boolean-warning-msg-series" v-if="msgRemove !== ''" class="shadow-[1px_1px_25px_-8px]  shadow-blue-1000 mx-auto items-center flex gap-3 bg-yellow-200 p-4 m-2 rounded-md">
                <svg class="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

                <p class="break-words  ">{{ msgRemove }}</p>
                <button @click="closeModal" type="button"
                        class="ms-auto -mx-1.5 -my-1.5 text-gray-800 hover:bg-yellow-400 hover:bg-opacity-80 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 inline-flex items-center justify-center h-8 w-8 "
                        data-dismiss-target="#boolean-warning-msg-series" aria-label="Cerrar">
                        <span class="sr-only">Cerrar</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
            </div>

            <h1 class="text-xl m-4 skiptranslate" v-if="!seriesWatching || seriesWatchingJson.length === 0">
                Oops, no tienes ni una serie empezada!

            </h1>

            <h1 v-else class="text-2xl font-medium ms-7 mt-3 skiptranslate">Series empezadas</h1>
            
            <div class="flex flex-col gap-3 m-4 mt-1 ">
                <Link href="/buscador" v-if="!seriesWatching || seriesWatchingJson.length === 0"
                    class="text-white text-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 skiptranslate">
                Empezar
                nueva serie


                </Link>
                <div v-for="(serie) in seriesWatchingJson" class="md:m-2 m-1 grid items-center bg-white border border-orange-0 rounded-lg shadow 
           grid-cols-1 md:grid-cols-4 w-auto md:gap-5">
                    <Link :href="`/show/${serie.id}`" class="col-span-3 flex-wrap flex items-center p-2   md:p-1">
                    <div class="flex flex-col md:flex-row justify-center md:items-center">


                        <img class="object-cover w-28 h-auto rounded-lg"
                            :src="serie.image ? serie.image.medium : '/public/noimage.png'"
                            :alt="`Portada de la última serie en la wishlist ${serie.name}`">
                        <div class="flex flex-col sm:flex-wrap mx-1 md:mx-2">
                            <h2
                                class="text-2xl font-normal  tracking-tight text-gray-900 hover:text-blue-1000 hover:font-medium">
                                {{ serie.name }}</h2>
                            <p v-if="localSeriesWatching.find(series => series[serie.id])?.[serie.id].state !== 'end'"
                                class=" skiptranslate">
                                Estas viendo de la temporada {{ localSeriesWatching.find(series =>
                                    series[serie.id])?.[serie.id].currentSeason }}
                                capítulo {{ localSeriesWatching.find(series => series[serie.id])?.[serie.id].current }}
                            </p>


                        </div>
                    </div>
                    </Link>
                    <div class="flex md:flex-col flex-row-reverse  justify-between space-x-2 col-span-1 p-2">
                        <div class="self-end mb-2 md:mt-0">
                            <BottomSheet>
                                <div class="flex flex-col skiptranslate">
                                    <div class="flex">
                                        <div>

                                            <svg class="w-6 h-6 text-gray-400 " aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                                viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                    stroke-linejoin="round" stroke-width="1.5"
                                                    d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            <span class="sr-only">Cerrar modal</span>
                                        </div>
                                        <p class="text-gray-600  ms-2">Fecha de inicio: {{
                                            formatDate(seriesWatching.find(series =>
                                                series[serie.id])?.[serie.id].created_at) }}</p>
                                    </div>

                                    <div class="max-w-[50%] mt-2">

                                        <ModalComponentDelete @closeModal="handleClose" modalTitle="Dejar de ver"
                                            :modalDescription="'¿Estás seguro que quieres dejar de ver ' + serie.name + '?'"
                                            msgAfirmative="Sí, la quiero dejar de ver." :idSeason="seriesWatching.find(series =>
                                                series[serie.id])?.[serie.id].created_at" :idSerie="serie.id">
                                        </ModalComponentDelete>
                                    </div>
                                </div>
                            </BottomSheet>

                        </div>
                        <button v-if="localSeriesWatching.find(series => series[serie.id])?.[serie.id].state !== 'end'"
                            @click.stop="next(loginUser.id, serie.id, serie.name)" type="button" class="text-blue-1000  hover:text-white border border-blue-1000 hover:bg-blue-1000  focus:outline-none focus:border
                            focus:ring-0 font-medium rounded-lg text-sm px-4 py-2.5 text-center 
                            skiptranslate  md:m-2 mb-2 ms-2 md:mt-9   sm:m-2 ">
                            Siguiente
                        </button>
                        <button v-if="localSeriesWatching.find(series => series[serie.id])?.[serie.id].state !== 'end'"
                            @click.stop="back(loginUser.id, serie.id, serie.name)" type="button" class="text-red-800  hover:text-white border border-red-800 hover:bg-red-800  focus:outline-none focus:border
                            focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                            skiptranslate sm:items-start md:m-2 mb-2 ms-2  md:mb-10 sm:m-2">
                            Volver
                        </button>
                    </div>
                </div>

                <h2 class="text-xl m-4 ms-2 skiptranslate" v-if="!seriesToWatch.length >= 1">Oops, no tienes ni una
                    serie en tu lista!</h2>

                <div v-if="!seriesToWatch.length >= 1">
                    <Link href="/buscador"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 block w-full text-center skiptranslate">
                    Agregar
                    serie a wishlist</Link>

                </div>
                <div v-if="seriesToWatch.length >= 1 && !loading">
                    <h2 class="text-2xl font-medium ms-2 mt-3 mb-3 skiptranslate">Series en tu lista</h2>
                    <CardWithData :data=seriesToWatch :imgContent="lastSerie?.image?.medium"
                        :altImgContent="lastSerie?.name" text="Tu lista de series para ver" route="/wishlist"
                        dataName="seriesToWatch">
                    </CardWithData>

                </div>
                <div v-if="seriesWatched.length >= 1 && !loading">

                    <h2 class="text-2xl font-medium ms-2 mt-3 mb-3 skiptranslate">Series vistas</h2>

                    <CardWithData :data=seriesWatched :imgContent="lastSerieWatched?.image?.medium"
                        :altImgContent="lastSerieWatched?.name" text="Tu lista de series vistas"
                        dataName="seriesWatched" :lastSerieName="lastSerieWatched?.name" route="/seriesVistas">
                    </CardWithData>
                </div>
            </div>
        </template>
    </section>
</template>
