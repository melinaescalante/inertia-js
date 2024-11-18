<script setup>
import NavBar from '../components/NavBar.vue'
import { onMounted, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { formatDate } from '../helpers/date';
import { allSeriesWatched } from '../../services/series';
import Spinner from '../Components/Spinner.vue';
import { useLoginUser } from '../composables/useLoginUser';
// const props = defineProps({
//     seriesWatched: String
// });
const { loginUser } = useLoginUser()
const loading = ref(true)

const arrayFetch = ref([])
const series = ref([])
onMounted(async () => {
    try {
        series.value = await allSeriesWatched(loginUser.value.id)
        console.log(series.value)
        const promises = series.value.map(async (serie) => {
            const response = await fetch('https://api.tvmaze.com/singlesearch/shows?q=' + serie.nameSerie);
            const json = await response.json();
            return json;
        });
        const results = await Promise.all(promises);
        loading.value = false
        arrayFetch.value = results


    } catch (error) {
        console.error('Error general:', error);
    }
})
</script>
<template>
    <NavBar></NavBar>
    <h1 class="font-medium text-2xl m-2 mt-3 mb-3">Series vistas</h1>
    <div v-if="!loading">


        <ul v-if="arrayFetch.length >= 1">
            <li v-for="(serie, index) in arrayFetch" :key="index">

                <Link :href="`/show/${serie.id}`"
                    class=" m-2 flex  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">

                <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
                    :src="serie.image ? serie.image.medium : '/noimage.png'"
                    :alt="`Portada de la serie en la wishlist ${serie.name}`">
                <div class="flex flex-col justify-between p-4 leading-normal">
                    <p class="mb-3 font-medium text-gray-700 ">Has visto </p>
                    <h2 class="mb-2 text-2xl font-medium tracking-tight text-gray-900 ">{{ serie.name }}
                    </h2>
                    <div class="flex flex-wrap gap-4 ">
                        <p class="border rounded-md px-2 text-blue-1000 border-orange-0 font-normal " v-for="genre in serie.genres">
                            {{ genre }}</p>
                    </div>
                    <div class="flex flex-col gap-2 mt-2">
                        <p>La empezaste: {{ formatDate(series[index].created_at) }}</p>
                        <p>La terminaste: {{ formatDate(series[index].ended_at) }}</p>
                    
                    </div>
                </div>
                </Link>
            </li>
        </ul>
        <p class="m-2" v-else>No tienes nada en tu lista!</p>
    </div>
    <Spinner v-else msg="Cargando series vistas"></Spinner>
</template>