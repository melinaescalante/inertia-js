<script setup>
import NavBar from "../../components/NavBar.vue";
import { ref } from "vue";
// import BaseButton from "../components/BaseButton.vue";
import { editMyProfilePhoto } from '../../../services/auth'

const editData = ref({
    photo: null,
    photoPreview: null,
});
const loading = ref(false);
const msg=ref('')
async function handleSubmit(e) {
    if (loading.value) return;
    loading.value = true;
    try {
      
        e.preventDefault();
        await editMyProfilePhoto(editData.value.photo);
        msg.value = 'Se ha actualizado la foto de perfil correctamente.';
        setTimeout(() => {
            msg.value = '';
        }, 2000);
    } catch (error) {
        console.log("Error en handleSubmit:", error);
    }
    loading.value = false;
}


async function handleFileSelection(e) {
    editData.value.photo = e.target.files[0]
    console.log('Imagen seleccionada', editData.value.photo)

    //Funcion deja me permite leer archivos
    const reader = new FileReader()
    reader.addEventListener('load', function () {
        editData.value.photoPreview = reader.result

    })
    //Una data url es una url que utiliza el protocolo data y contiene un archivo codificado como string en base64
    reader.readAsDataURL(editData.value.photo)
}
</script>
<template>
    <NavBar></NavBar>
    <h1 class="font-medium text-2xl m-2 mt-4 mb-3">Cambiar mi foto de perfil</h1>
    <div class="flex flex-col m-2 gap-4 items-start">
        <form class=" w-1/2" @submit="handleSubmit">
            <div class="mb-4">
                <label for="photo" class="block mt-4 mb-6">Nueva Foto</label>
                <input type="file" name="photo" id="mt-3 photo"
                    class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-500 hover:file:bg-violet-100"
                    @change="handleFileSelection" />
            </div>
            <button
                class="mt-2 border rounded-lg py-2 px-4 bg-blue-700 text-white hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900 transition-colors"
                type="submit">{{ !loading ? 'Actualizar Foto' : 'Actualizando foto..' }}</button>
        </form>
        <div class="w-1/2 mt-4">
            <h2>Imagen seleccionada</h2>
            <img v-if="editData.photo" :src="editData.photoPreview" :alt="`Preview de imagen seleccionada para ${editData.photoPreview}`"  />
        </div>
    </div>
    <div v-if="!loading && msg==='Se ha actualizado la foto de perfil correctamente.'" class="bg-green-200 p-4 m-2 rounded-md">
        <p>{{ msg }}</p>
    </div>
</template>
