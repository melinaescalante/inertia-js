<script setup>
import NavBar from "../../components/NavBar.vue";
import { onMounted, ref } from "vue";
import { editMyProfilePhoto } from '../../../services/auth'
import { useLoginUser } from "../../composables/useLoginUser";
const { loginUser } = useLoginUser()
const editData = ref({
    photo: null,
    photoPreview: null,
});
const loading = ref(false);
const msg = ref('')
const msgBoolean = ref(false)
async function handleSubmit(e) {
    if (loading.value) return;
    loading.value = true;
    try {

        e.preventDefault();
        msgBoolean.value = true        
        await editMyProfilePhoto(editData.value.photo);
        msg.value = 'Se ha actualizado la foto de perfil correctamente.';
       
    } catch (error) {
        msgBoolean.value = true
        msg.value = 'No ha actualizado la foto de perfil correctamente.';
    }
    setTimeout(() => {
        msg.value = '';
        msgBoolean.value = false

    }, 3000);
    loading.value = false;
}

function closeModal() {
    msgBoolean.value = false
}
async function handleFileSelection(e) {
    editData.value.photo = e.target.files[0]
    //Funcion deja me permite leer archivos
    const reader = new FileReader()
    reader.addEventListener('load', function () {
        editData.value.photoPreview = reader.result
    })
    //Una data url es una url que utiliza el protocolo data y contiene un archivo codificado como string en base64
    reader.readAsDataURL(editData.value.photo)
}
onMounted(() => {
    editData.value.photo = loginUser.value.photoURL
})
</script>
<template>
    <NavBar></NavBar>
    <section class="mt-20">

        <h1 class="font-medium text-2xl m-2 mt-4 mb-3">Cambiar mi foto de perfil</h1>
        <div class="flex flex-col m-2 gap-4 items-start">
            <form class=" w-1/2" @submit="handleSubmit">
                <div class="mb-4">
                    <label for="photo" class="block mt-4 mb-6 ms-2">Nueva Foto</label>
                    <input type="file" name="photo" id="mt-3 photo"
                        class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-500 hover:file:bg-violet-100"
                        @change="handleFileSelection" required />
                </div>
                <button
                    class="mt-2 border rounded-lg py-2 px-4 bg-blue-700 text-white hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900 transition-colors"
                    type="submit">{{ !loading ? 'Actualizar Foto' : 'Actualizando foto..' }}</button>
            </form>
            <div v-if="editData.photo" class="w-1/2 mt-4">
                <h2 class="font-normal text-lg">Previsualización</h2>
                <h3 v-if="editData.photo" class="mb-2 ">{{ editData.photoPreview ? 'Imagen seleccionada' : 'Imagen actual' }}
                </h3>
                <img v-if="editData.photo" :src="editData.photoPreview || editData.photo"
                    :alt="`Preview de usuario ${editData.photoPreview}`" />
            </div>
        </div>
        <div v-show="msgBoolean" v-if="!loading && msg === 'Se ha actualizado la foto de perfil correctamente.'" id="boolean-success-msg"
            class="bg-green-200 flex p-4 m-2 gap-2 items-center fixed w-[-webkit-fill-available]  top-[10%] rounded-md">
            <svg class="w-6 h-6 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linejoin="round" stroke-width="2"
                    d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
                <path stroke="currentColor" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

            <p>{{ msg }}</p>
            <button @click="closeModal" type="button"
                class="ms-auto -mx-1.5 -my-1.5 text-gray-800 hover:bg-green-400 hover:bg-opacity-80 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 inline-flex items-center justify-center h-8 w-8 "
                data-dismiss-target="#boolean-success-msg" aria-label="Cerrar">
                <span class="sr-only">Cerrar</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </div>
        <div v-show="msgBoolean" v-if="!loading && msg === 'No ha actualizado la foto de perfil correctamente.'"
            id="boolean-error-msg"
            class="bg-red-200 flex items-center fixed w-[-webkit-fill-available]  top-[10%]  gap-2 p-4 m-2 rounded-md">
            <svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            <p>{{ msg }}</p>
            <button @click="closeModal" type="button"
                class="ms-auto -mx-1.5 -my-1.5  text-gray-800  rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-400 inline-flex items-center justify-center h-8 w-8 "
                data-dismiss-target="#boolean-error-msg" aria-label="Cerrar">
                <span class="sr-only">Cerrar</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>

        </div>
    </section>
</template>
