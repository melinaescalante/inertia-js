<script setup>
import {  router } from "@inertiajs/vue3";
import { uploadPost, uploadPhoto } from "../../services/posts";
import { ref} from "vue";
import SearchComponentPost from "../Components/SearchComponentPost.vue";
import NavBarSecondary from '../Components/NavBarSecondary.vue'
import { useLoginUser } from "../composables/useLoginUser";
const { loginUser } = useLoginUser()
defineProps({
    series: Array,
});
const msg = ref('')
const loading = ref(false);
const imageInput = ref(null);
const newPost = ref({
    userid: null,
    serie: null,
    idSerie:null,
    text: "",
    image: null,
});

const refreshCount = ref(0);
function setSerieSeleccionada(serieSeleccionada) {
    newPost.value.serie = serieSeleccionada;
    if (newPost.value.serie !== null) {
        msg.value = '';
        return;
    }
}
function setIdSerieSelecionada(idSerieSeleccionada){
    newPost.value.idSerie = idSerieSeleccionada;
    if (newPost.value.idSerie !== null) {
        msg.value = '';
        return;
    }
}
async function handlePost() {

    // Verifica si ya se está cargando o si falta información
    if (loading.value) return;
    if (!newPost.value.text && !newPost.value.image) {
        msg.value = 'Formulario incompleto';
        return;
    }
    if (newPost.value.serie === null) {
        msg.value = 'Seleccione una serie válida';
        return;
    }

    loading.value = true;
    let imageURL = null;
    if (newPost.value.image !== null) {
        imageURL = await uploadPhoto(newPost.value.image);
    }
    newPost.value.image = imageURL;
    newPost.value.userid = loginUser.value.id;

    try {
        await uploadPost({ ...newPost.value });
        refreshCount.value++;
        msg.value = 'Se ha publicado correctamente';
        setTimeout(() => {
            msg.value = '';
            router.replace('/')
        }, 2000);
    } catch (error) {
        msg.value = 'Ha ocurrido un error';

    } finally {
        newPost.value.text = "";
        newPost.value.serie = null;
        newPost.value.image = null;
        if (imageInput.value) {
            imageInput.value.value = "";
        }
        loading.value = false;
    }
}

function handleImageChange(e) {
    const file = e.target.files[0];
    newPost.value.image = file;
}
</script>
<template>
    <NavBarSecondary></NavBarSecondary>
     <div v-if="msg !== 'Se ha publicado correctamente' && msg !== ''" class="bg-red-200 p-4 m-2 rounded-md">
        {{ msg }}
    </div>

    <div v-if="msg == 'Se ha publicado correctamente'" class="bg-green-200 p-4 m-2 rounded-md">
        <p>{{ msg }}</p>
    </div>
    <h1 class="text-2xl m-2">Subir publicación</h1>
    <form action="#" enctype="multipart/form-data" @submit.prevent="handlePost">
        <div class="flex flex-col mb-3">
            <span class="sr-only">Escribe la serie con la que te quieres referir</span>
            <label class="m-2 mb-0" for="serie">¿Sobre qué serie estás pensando?</label>

            <SearchComponentPost @serie-seleccionada="setSerieSeleccionada" :series="series" @id-serie-seleccionada="setIdSerieSelecionada" 
                :refreshCount="refreshCount"></SearchComponentPost>

        </div>
        <div class="flex flex-col mb-3">
            <span class="sr-only">Escribe lo que quieras</span>
            <label for="description"></label>
            <textarea :readonly="loading"
                class="focus:ring-blue-500 focus:border-blue-500 focus:outline-none  p-2 m-2 border rounded-md"
                name="description" id="description" placeholder="Escribe lo que quieras"
                v-model="newPost.text"></textarea>
        </div>
        <div class="m-2 mb-4 mt-3">
            <label class="block">
                <span class="sr-only">Puedes subir una imagen:</span>
                <input ref="imageInput" type="file" @change="handleImageChange"
                    class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 
                    file:bg-opacity-50 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-0 file:text-blue-1000 hover:file:bg-blue-0" />
            </label>
        </div>

        <button type="submit"
            class="m-2  rounded-lg py-2 px-4 bg-blue-1000 text-white hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900 transition-colors">
            {{ !loading ? "Publicar" : "Publicando.." }}
        </button>
    </form>
   
</template>
