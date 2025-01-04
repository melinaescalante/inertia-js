<script setup>
import NavBar from '../components/NavBar.vue';
import { onMounted, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { allSeriesToWatch } from '../../services/series';
import Spinner from '../Components/Spinner.vue';
import { useLoginUser } from '../composables/useLoginUser';
import BottomSheet from '../Components/BottomSheet.vue';
import ModalComponentDelete from '../Components/ModalComponentDelete.vue';
import { formatDate } from '../helpers/date';

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
        console.log(series.value)


    } catch (error) {
        console.error('Error general:', error);
    }
})
function handleClose() {

isBottomSheetOpen.value = false;
setTimeout(() => {
    isBottomSheetOpen.value = true;
}, 100);
}
const isBottomSheetOpen = ref(true);
</script>

<template>
    <NavBar />
    <section id="series">

        <h1 class="text-xl m-2 font-medium skiptranslate">Tus series a ver</h1>
        <div v-if="!loading">
            <ul v-if="arrayFetch.length >= 1">
                <li class=" m-2  justify-between   bg-white border border-gray-200 rounded-lg shadow flex  md:max-w-xl "
                    v-for="serie in arrayFetch">

                    <Link :href="`/show/${serie.id}`" class=" flex  justify-between">
                    <div class="flex hover:bg-gray-100 ">

                        <img class="object-cover  rounded-t-lg w-28    md:rounded-none md:rounded-s-lg m-1 "
                            :src="serie.image ? serie.image.medium : '/noimage.png'"
                            :alt="`Portada de la serie en la wishlist ${serie.name}`">
                        <div class="flex flex-col justify-between p-4 leading-normal">
                            <p class="mb-3 font-medium text-gray-700 skiptranslate ">Tienes en tu lista para ver </p>
                            <h2 class="mb-2 text-2xl font-medium tracking-tight text-gray-900 ">{{ serie.name }}
                            </h2>
                            <div class="flex flex-wrap gap-4">
                                <p class="rounded-xl bg-opacity-70   border border-orange-0 text-blue-1000 text-sm  font-normal py-1 px-2 text-center"
                                    v-for="genre in serie.genres">{{ genre }}</p>
                            </div>


                        </div>
                    </div>

                    </Link>
                    <div class="self-start mt-2">

                        <BottomSheet>
                            <div class="flex flex-col ">
                                <div class="flex">
                                    <div>

                                        <svg class="w-6 h-6 text-gray-400 " aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                            viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="1.5"
                                                d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <span class="sr-only">Cerrar modal</span>
                                    </div>
                                    <p class="text-gray-600  ms-2">Nombre de serie: {{
                                       serie.name}}</p>
                                </div>

                                <div class="max-w-[50%] mt-2">

                                    <ModalComponentDelete @closeModal="handleClose" modalTitle="Sacar de mi lista"
                                        :modalDescription="'¿Estás seguro que quieres sacar de tu lista ' + serie.name + '?'"
                                        msgAfirmative="Sí, la quiero sacar de mi lista."  :idSerie="serie.id" :nameSerie="serie.name">
                                    </ModalComponentDelete>
                                </div>
                            </div>
                        </BottomSheet>
                    </div>
                </li>
            </ul>
            <p class="m-2 skiptranslate" v-else>No tienes nada en tu lista!</p>
        </div>
        <Spinner v-else msg="Cargando series vistas"></Spinner>
    </section>
</template>
