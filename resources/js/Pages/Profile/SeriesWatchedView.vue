<script setup>
import { onMounted, ref } from 'vue';
import NavBar from '../../components/NavBar.vue';
import { Link, usePage } from '@inertiajs/vue3';
import { allSeriesWatched } from '../../../services/series';
import Spinner from '../../Components/Spinner.vue';
const page = usePage()
const series = ref([])
const loading = ref(true)

onMounted(async () => {
    try {
        series.value = await allSeriesWatched(page.props.userId)
        loading.value = false

        console.log(series.value)
    } catch (error) {
        console.error(error)
    }
})
</script>

<template>
    <NavBar></NavBar>
    <h1 class="font-medium text-2xl m-2 mt-3 mb-5 skiptranslate">Series Vistas</h1>
    <!-- {{ userId }} -->
    <div v-if="!loading" v-for="(serie) in series"
        class="flex items-center gap-4  p-4  border-b-[1px]  border-blue-1000 skiptranslate">
        <img class="w-10 h-10 rounded-full" :src="serie.urlImage || '/noimage.png'"
            :alt="`Foto de la serie ${serie.idSerie}`">
        <div class="font-medium ">
            <div>

                <Link :href="`/show/${serie.idSerie}`">
                {{ serie.nameSerie }}</Link>

            </div>
        </div>

    </div>
    <div v-if="!series?.length  && !loading" class="skiptranslate m-2">
        <p>Sin series vistas</p>
    </div>
    <div v-if="loading">

        <Spinner class="mx-auto" msg="Cargando series vistas"></Spinner>
    </div>
</template>