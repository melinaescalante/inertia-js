<script setup>
import NavBar from '../../components/NavBar.vue'
import ButtonBase from '../../components/ButtonBase.vue'
import { Link } from '@inertiajs/vue3';
import { addSerieToWatch, allSeriesToWatch, startSerie, isStarted, bringCommentsFromSeries } from '../../../services/series';
import { ref, onMounted } from 'vue';
import { useLoginUser } from "../../composables/useLoginUser";
import CommentSection from '../../Components/CommentSection.vue';
import Spinner from '../../Components/Spinner.vue';

const { loginUser } = useLoginUser()

const props = defineProps({
    serie: Object
})
const comments = ref([])
const seriesToWatch = ref([])
const localseries = ref([])
const loading = ref(true)
const loadingSeries = ref(true)
const initialValue = ref(false)
const watching = ref(false)
onMounted(async () => {
    if (loginUser.value.id !== null && loginUser.value.id !== undefined) {
        seriesToWatch.value = await allSeriesToWatch(loginUser.value.id)
        localseries.value = seriesToWatch.value || []
        await isInWishlist(props.serie.id)

        loading.value = false

    }
    comments.value = await bringCommentsFromSeries((newComments) => {
        comments.value = newComments
    }, props.serie.id)
    loadingSeries.value = false

})
async function isInWishlist(id) {
    try {
        watching.value = await isStarted(loginUser.value.id, id)

        if (localseries.value.some(watchedSerie => Object.keys(watchedSerie).includes(String(id)))) {
            initialValue.value = true
            return
        } else {
            initialValue.value = false
        }
    } catch (error) {
        console.log(error)
    }

}

async function addSerie(idUser, idSerie, nameSerie) {
    await addSerieToWatch(idUser, idSerie, nameSerie)
    const newserie = { [idSerie]: nameSerie }
    localseries.value.push(newserie)
}
async function start(idUser, idSerie) {
    let seasons
    const response = await fetch(`https://api.tvmaze.com/shows/${idSerie}/seasons`);
    if (response.status == 200) {
        seasons = await response.json();
    }
    await startSerie(idUser, idSerie, seasons[0].id)
}
</script>
<template>
    <NavBar></NavBar>
    <h1 class="text-2xl font-medium ms-2 mt-3 mb-3">{{ serie.name }}</h1>
    <div class="flex gap-3 m-2">
        <img class="h-64 md:h-72" :src="serie.image?.medium ? serie.image.medium : '/noimage.png'"
            :alt="`Imagen de portada de la serie de ${serie.name}`">
        <div>

            <div v-html="serie.summary"></div>
            <div>
                <ul class="flex flex-wrap">
                    <li class="rounded-xl bg-opacity-70  border border-blue-950  text-sm  text-blue-950 font-medium p-2 m-1 ms-0 text-center  "
                        v-for="genre in serie.genres">{{ genre }}</li>
                </ul>
            </div>
            <p>Estreno: {{ serie.premiered }}</p>
        </div>
    </div>
    <div class="flex m-2 mt-3 gap-1 justify-between  ">
        <ButtonBase :href="serie.id" :name="serie.name" param="episodios">Episodios</ButtonBase>
        <ButtonBase :href="serie.name" :name="serie.id" param="temporadas">Temporadas</ButtonBase>
        <ButtonBase :href="serie.id" :name="serie.name" param="galeria">Galeria</ButtonBase>
        <ButtonBase :href="serie.name" :name="serie.id" param="elenco">Elenco</ButtonBase>

    </div>

    <div v-if="!loading" class="flex justify-between m-2">


        <Link href="#" @click="addSerie(loginUser.id, serie.id, serie.name)" type="button"
            class="border-gray-200 text-blue-1000 hover:text-blue-600 border bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ">
        <svg class="w-6 h-6 me-1 text-blue-1000" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path v-if="!initialValue" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 12h14m-7 7V5" />
            <path v-else stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 11.917 9.724 16.5 19 7.5" />
        </svg>



        {{ initialValue ? 'Agregada a mi lista' : 'Agregar a mi lista' }}
        </Link>
        <Link href="#" @click="start(loginUser.id, serie.id, serie.name)" type="button"
            class="h-20 py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-blue-1000 rounded-lg  hover:bg-blue-500 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 text-center inline-flex items-center ">
        <svg class="w-6 h-6 me-1 text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
        fill="currentColor" viewBox="0 0 24 24">
            <path v-if="!watching" fill-rule="evenodd"
                d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clip-rule="evenodd" />
            <path v-else fill-rule="evenodd"
                d="M19.003 3A2 2 0 0 1 21 5v2h-2V5.414L17.414 7h-2.828l2-2h-2.172l-2 2H9.586l2-2H9.414l-2 2H3V5a2 2 0 0 1 2-2h14.003ZM3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3Zm2-2.414L6.586 5H5v1.586Zm4.553 4.52a1 1 0 0 1 1.047.094l4 3a1 1 0 0 1 0 1.6l-4 3A1 1 0 0 1 9 18v-6a1 1 0 0 1 .553-.894Z"
                clip-rule="evenodd" />


        </svg>

        {{ watching ? 'La estas viendo' : 'Comenzar a ver' }}
        </Link>
    </div>
    <div v-else class="mt-2">
        <Spinner msg="Cargando informacion de la serie"></Spinner>
    </div>
    <CommentSection :loading="loading" :idSerie="serie.id" :comments="comments"></CommentSection>
</template>