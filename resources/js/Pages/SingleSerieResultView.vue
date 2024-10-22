<script setup>
import NavBar from '../components/NavBar.vue'
import ButtonBase from '../components/ButtonBase.vue'
import { Link } from '@inertiajs/vue3';
import { addSerieToWatch } from '../../services/series';
import ButtonGoBack from '../components/ButtonGoBack.vue'
import { ref, onMounted, onUnmounted } from 'vue';
import { suscribeToAuthChanged } from "../../services/auth";

let unSubscribeFromAuth = () => {};

defineProps({
    serie: Array
})
const loginUser = ref({
  id: null,
  email: null,
  displayName: null,
  bio: null,
  genres: null

})
onMounted(async() => {
    unSubscribeFromAuth=suscribeToAuthChanged(newUserData => loginUser.value = newUserData)

    
})
onUnmounted( ()=>{
  unSubscribeFromAuth();

})
async function addSerie(idUser,idSerie){
    console.log(idSerie,idUser)
await addSerieToWatch(idUser,idSerie)
}
</script>
<template>
    <NavBar></NavBar>
    <ButtonGoBack></ButtonGoBack>

    <h1 class="text-2xl font-medium ms-2 mt-3 mb-3">{{ serie.name }}</h1>
    <div class="flex gap-3 m-2">
        <img class="h-64 md:h-72" :src="serie.image.medium ? serie.image.medium : 'noimage.png'"
            :alt="`Imagen de portada de la serie de ${serie.name}`">
        <div>

            <div v-html="serie.summary"></div>
            <p></p>
            <div>
                <ul class="flex flex-wrap">
                    <li class="rounded-xl bg-opacity-70  border border-blue-950  text-sm  text-blue-950 font-medium p-2 m-1 ms-0 text-center  "
                        v-for="genre in serie.genres">{{ genre }}</li>
                </ul>
            </div>
            <p>Estreno: {{  serie.premiered }}</p>
        </div>
    </div>
    <div class="flex m-2 mt-3 justify-between  ">
        <ButtonBase
        :href="serie.id"
        :name="serie.name"
        param="episodios"
        >Episodios</ButtonBase>
        <ButtonBase
        :href="serie.name"
        :name="serie.id"
        param="temporadas"
        >Temporadas</ButtonBase>
        <ButtonBase
        :href="serie.id"
        :name="serie.name"
        param="galeria">Galeria</ButtonBase>
        <ButtonBase
        :href="serie.name"
        :name="serie.id"
        param="elenco"
        >Elenco</ButtonBase>

    </div>

    <div class="flex justify-between m-2">

        <Link   @click="addSerie(loginUser.id, serie.id)"  type="button"
            class="border-gray-200 text-blue-700 hover:text-blue-600 border bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center ">
            <svg class="w-6 h-6 me-1 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 12h14m-7 7V5" />
            </svg>
            Agregar a mi lista
        </Link>
        <Link type="button"
            class="h-20 py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-blue-700 rounded-lg  hover:bg-blue-500 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 text-center inline-flex items-center ">
            <svg class="w-6 h-6 me-1 text-white dark:text-white" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                    clip-rule="evenodd" />
            </svg>

            Comenzar
            a ver
        </Link>
    </div>
</template>