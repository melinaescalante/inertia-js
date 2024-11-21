<script setup>
import NavBar from '../components/NavBar.vue';
import { onMounted, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { allSeriesToWatch } from '../../services/series';
import Spinner from '../Components/Spinner.vue';
import { useLoginUser } from '../composables/useLoginUser';

const loading = ref(true)
const { loginUser } = useLoginUser()

const arrayFetch = ref([])
const series = ref([])

    onMounted(async () => {
    try {
        series.value = await allSeriesToWatch(loginUser.value.id)
        const promises = series.value.map(async (serie) => {
            const response = await fetch('https://api.tvmaze.com/singlesearch/shows?q=' + Object.values(serie)[0]);
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
    <NavBar />
    <h1 class="text-xl m-2 font-medium">Tus series a ver</h1>
    <div v-if="!loading">
    <ul v-if="arrayFetch.length>=1">
        <li v-for="serie in arrayFetch">

            <Link :href="`/show/${serie.id}`"
                class=" m-2 flex  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">

            <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
                :src="serie.image ? serie.image.medium : '/noimage.png'"
                :alt="`Portada de la serie en la wishlist ${serie.name}`">
            <div class="flex flex-col justify-between p-4 leading-normal">
                <p class="mb-3 font-medium text-gray-700 ">Tienes en tu lista para ver </p>
                <h2 class="mb-2 text-2xl font-medium tracking-tight text-gray-900 ">{{ serie.name }}
                </h2>
                <div class="flex flex-wrap gap-4">
                    <p class="rounded-xl bg-opacity-70   border border-orange-0 text-blue-1000 text-sm  font-normal py-1 px-2 text-center" v-for="genre in serie.genres">{{genre}}</p>
                </div>
              
            </div>
            </Link>
        </li>
    </ul>
    <p class="m-2" v-else>No tienes nada en tu lista!</p>
</div>
<Spinner v-else msg="Cargando series vistas"></Spinner>
</template>
