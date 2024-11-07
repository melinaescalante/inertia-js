<script setup>
import { Link } from "@inertiajs/vue3";
import { uploadPost, uploadPhoto } from "../../services/posts";
import { suscribeToAuthChanged } from "../../services/auth";
import { ref, onMounted, onUnmounted } from "vue";
import SearchComponentPost from "../Components/SearchComponentPost.vue";
import NavBarSecondary from '../Components/NavBarSecondary.vue'
import { useLoginUser } from "../composables/useLoginUser";
const { loginUser } = useLoginUser()
defineProps({
    series: Array,
});
const loading = ref(false);
const imageInput = ref(null);
const newPost = ref({
    userid: null,
    serie: "",
    text: "",
    image: null,
});

const refreshCount = ref(0);
function setSerieSeleccionada(serieSeleccionada) {
    newPost.value.serie = serieSeleccionada;
}
async function handlePost() {
    if (loading.value) return;
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
    } catch (error) {
        console.log(error);
    }

    newPost.value.text = "";
    newPost.value.serie = "";
    newPost.value.image = null;
    if (imageInput.value) {
        imageInput.value.value = "";
    }
    loading.value = false;
}
function handleImageChange(e) {
    const file = e.target.files[0];
    newPost.value.image = file;
}
</script>
<template>
    <NavBarSecondary></NavBarSecondary>
    <h1 class="text-xl m-2">Subir publicacion</h1>
    <form action="" enctype="multipart/form-data" @submit.prevent="handlePost">
        <div class="flex flex-col mb-3">
            <span class="sr-only">Escribe la serie con la que te quieres referir</span>
            <label class="m-2" for="serie">¿Sobre qué serie estas pensando?</label>

            <SearchComponentPost @serie-seleccionada="setSerieSeleccionada" :series="series"
                :refreshCount="refreshCount"></SearchComponentPost>

        </div>
        <div class="flex flex-col mb-3">
            <span class="sr-only">Escribe lo que quieras</span>
            <label for="description"></label>
            <textarea :readonly="loading" class="p-2 m-2 border rounded-md" name="description" id="description"
                placeholder="Escribe lo que quieras" v-model="newPost.text"></textarea>
        </div>
        <div class="m-2 mb-4 mt-3">
            <label class="block">
                <span class="sr-only">Puedes subir una imagen:</span>
                <input ref="imageInput" type="file" @change="handleImageChange"
                    class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-500 hover:file:bg-violet-100" />
            </label>
        </div>

        <button type="submit"
            class="m-2 border rounded-lg py-2 px-4 bg-blue-700 text-white hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900 transition-colors">
            {{ !loading ? "Publicar" : "Publicando.." }}
        </button>
    </form>
</template>
