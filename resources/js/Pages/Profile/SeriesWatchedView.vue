<script setup>
import { onMounted, ref } from 'vue';
import NavBar from '../../components/NavBar.vue';
import { Link, usePage } from '@inertiajs/vue3';
import { allSeriesWatched } from '../../../services/series';
import Spinner from '../../Components/Spinner.vue';
const page = usePage()
const series = ref([])
const loading = ref(true)
console.log(page.props.userId)
onMounted(async () => {
    try {
        series.value = await allSeriesWatched(page.props.userId)
        loading.value = false

    } catch (error) {
        console.error(error)
    }
})
</script>

<template>
    <NavBar></NavBar>
    <section class="mt-20">
        <h1 class="font-medium text-2xl m-2 mt-3 mb-2 skiptranslate">Series Vistas</h1>
        <div v-if="!loading" v-for="(serie) in series"
            class="flex items-center gap-4  p-3  border-b-[1px]  border-blue-1000 skiptranslate">
            <img class="w-10 h-10 rounded-full" :src="serie.urlImage || '/noimage.png'"
                :alt="`Foto de la serie ${serie.idSerie}`">
                <div class="flex gap-1 justify-between font-medium w-full">

                    <Link :href="`/show/${serie.idSerie}`">
                    {{ serie.nameSerie }}</Link>
                    <div class="flex gap-1 items-center">

                        <p><span class="font-medium"
                                :class="{ 'text-green-600': serie.rate > 3, 'text-red-600': serie.rate < 3, 'text-yellow-600': serie.rate === 3 }">
                                {{ serie.rate || 'S/N' }} </span> </p>
                        <svg v-if="serie.rate" class="w-5 h-5 me-5 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor" viewBox="0 0 22 20">
                            <path
                                d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>

                </div>
            </div>

        </div>
        <div v-if="!series?.length && !loading" class="skiptranslate m-2">
            <p>Sin series vistas</p>
        </div>
        <div v-if="loading">

            <Spinner class="mx-auto" msg="Cargando series vistas"></Spinner>
        </div>
    </section>
</template>