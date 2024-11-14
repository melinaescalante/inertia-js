<script setup>
import NavBar from '../components/NavBar.vue';
import { onMounted, ref } from 'vue';
import { Link } from '@inertiajs/vue3';

const props = defineProps({
    seriesToWatch: Array
});
const loading = ref(true)

const arrayFetch = ref([])
onMounted(() => {
    props.seriesToWatch.forEach(async serie => {
        try {

            const response = await fetch('https://api.tvmaze.com/shows/' + Object.keys(serie)[0] + '')
     
            if (response) {
                const json = await response.json();
                arrayFetch.value.push(json)
                arrayFetch.value.reverse()
                loading.value = false;
            }


        } catch (error) {
            throw new Error(error);
        }
    });
})
</script>

<template>
    <NavBar />
    <h1 class="text-xl m-2">Tus series a ver</h1>
    <ul v-if="arrayFetch.length>=1">
        <li v-for="serie in arrayFetch">

            <Link :href="`/show/${serie.id}`"
                class=" m-2 flex  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">

            <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1"
                :src="serie.image ? serie.image.medium : '/noimage.png'"
                :alt="`Portada de la serie en la wishlist ${serie.name}`">
            <div class="flex flex-col justify-between p-4 leading-normal">
                <p class="mb-3 font-medium text-gray-700 ">Tienes en tu lista para ver </p>
                <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{{ serie.name }}
                </h2>
                <div class="flex flex-wrap gap-4">
                    <p v-for="genre in serie.genres">{{genre}}</p>
                </div>
              
            </div>
            </Link>
        </li>
    </ul>
    <p class="m-2" v-else>No tienes nada en tu lista!</p>
</template>
