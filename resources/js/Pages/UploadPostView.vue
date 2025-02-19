<script setup>
import { router } from "@inertiajs/vue3";
import { uploadPost, uploadPhoto } from "../../services/posts";
import { ref } from "vue";
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
const imagePreview = ref(null)
const newPost = ref({
    userid: null,
    serie: null,
    idSerie: null,
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
function setIdSerieSelecionada(idSerieSeleccionada) {
    newPost.value.idSerie = idSerieSeleccionada;
    if (newPost.value.idSerie !== null) {
        msg.value = '';
        return;
    }
}
const msgBoolean = ref(false)
function closeModal() {
    msg.value = '';

    msgBoolean.value = false
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
        msgBoolean.value = true

        msg.value = 'Se ha publicado correctamente';
        setTimeout(() => {
            msg.value = '';
            router.replace('/')
        }, 2000);
    } catch (error) {
        msgBoolean.value = true

        msg.value = 'Ha ocurrido un error al subir la publicación. Intentálo más tarde.';
        console.log('error')
        setTimeout(() => {
            msg.value = '';
            msgBoolean.value = false

        }, 3000);

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
    const reader = new FileReader()
    reader.addEventListener('load', function () {
        imagePreview.value = reader.result
    })
    reader.readAsDataURL(file);
}
</script>
<template>
    <NavBarSecondary></NavBarSecondary>
    <section id="subir-posteo" class="mb-20">

        <div v-show="msg !== 'Se ha publicado correctamente' && msg !== ''" id="boolean-error-msg-uploadpost"
            v-if="msg !== 'Se ha publicado correctamente' && msg !== ''"
            class="bg-red-200 p-4 m-2 rounded-md fixed gap-2 flex items-center top-[10%] skiptranslate">
            <svg class="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p>

                {{ msg }}
            </p>
            <button @click="closeModal" type="button"
                class="ms-auto -mx-1.5 -my-1.5  text-gray-800  rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-400 inline-flex items-center justify-center h-8 w-8 "
                data-dismiss-target="#boolean-error-msg-uploadpost" aria-label="Cerrar">
                <span class="sr-only">Cerrar</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </div>

        <div id="boolean-success-msg-uploadpost" v-if="msg == 'Se ha publicado correctamente'"
            class="bg-green-200 fixed w-[100%] max-w-xl  flex items-center top-[10%]  p-4 m-2 rounded-md skiptranslate">
            <svg class="  w-6 h-6   me-5" aria-hidden="true" stroke-width="2" xmlns="http://www.w3.org/2000/svg"
                fill="none" stroke=" #1f2937 " viewBox="0 0 22 20">
                <path
                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <p>{{ msg }}</p>
            <button @click="closeModal" type="button"
                class="ms-auto -mx-1.5 -my-1.5 text-gray-800 hover:bg-green-400 hover:bg-opacity-80 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 inline-flex items-center justify-center h-8 w-8 "
                data-dismiss-target="#boolean-success-msg-uploadpost" aria-label="Cerrar">
                <span class="sr-only">Cerrar</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </div>
        <h1 class="text-2xl m-2 skiptranslate">Subir publicación</h1>
        <form action="#" enctype="multipart/form-data" @submit.prevent="handlePost">
            <div class="flex flex-col mb-3 skiptranslate">
                <span class="sr-only">Escribe la serie con la que te quieres referir</span>
                <label class="m-2 mb-0" for="serie">¿Sobre qué serie estás pensando?</label>

                <SearchComponentPost @serie-seleccionada="setSerieSeleccionada" :series="series"
                    @id-serie-seleccionada="setIdSerieSelecionada" :refreshCount="refreshCount"></SearchComponentPost>

            </div>
            <div class="flex flex-col mb-3 skiptranslate">
                <span class="sr-only">Escribe lo que quieras</span>
                <label for="description"></label>
                <textarea :readonly="loading"
                    class="focus:ring-blue-500 focus:border-blue-500 focus:outline-none  p-2 m-2 border rounded-md"
                    name="description" id="description" placeholder="Escribe lo que quieras"
                    v-model="newPost.text"></textarea>
            </div>
            <div class="m-2 mb-4 mt-3 skiptranslate">
                <label class="block">
                    <span class="sr-only">Puedes subir una imagen:</span>
                    <input ref="imageInput" type="file" @change="handleImageChange"
                        class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 
                    file:bg-opacity-50 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-0 file:text-blue-1000 hover:file:bg-blue-0" />
                </label>
            </div>

            <div v-if="imagePreview" class="w-1/2 m-2 mt-4 skiptranslate">
                <img v-if="imagePreview" :src="imagePreview"
                    :alt="`Preview de imagen seleccionada para ${imagePreview}`" />
            </div>

            <button type="submit"
                class="m-2 skiptranslate rounded-lg py-2 px-4 bg-blue-1000 text-white hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900 transition-colors">
                {{ !loading ? "Publicar" : "Publicando.." }}
            </button>
        </form>
    </section>

</template>
