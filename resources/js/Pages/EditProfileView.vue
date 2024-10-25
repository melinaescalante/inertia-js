<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NavBar from '../components/NavBar.vue';
import { editProfile, suscribeToAuthChanged } from '../../services/auth';
import ButtonGoBack from '../components/ButtonGoBack.vue'
let unSubscribeFromAuth = () => {};

const editData = ref({
    displayName: '',
    bio: '',
});
const genres = ref([]);
const loading = ref(false);

onMounted(async() => {
    unSubscribeFromAuth= suscribeToAuthChanged((newUserData) => {
        editData.value.displayName = newUserData.displayName;
        editData.value.bio = newUserData.bio;
        genres.value = newUserData.genres || [];
    });
});

function toggleGenre(genre) {
    const index = genres.value.indexOf(genre);
    if (index > -1) {
        genres.value.splice(index, 1);  // Eliminar si ya está seleccionado
    } else {
        genres.value.push(genre);  // Agregar si no está seleccionado
    }
}

async function handleSubmit() {
    loading.value = true;
    try {
        console.log(genres.value);
        await editProfile({ ...editData.value, genres: genres.value });
    } catch (error) {
        console.log('No se ha podido editar correctamente el perfil.');
    // } finally {
    }
        loading.value = false;
}
onUnmounted( ()=>{
  unSubscribeFromAuth();

})
</script>
<template>

    <NavBar></NavBar>
    <div class="mt-2">

        <ButtonGoBack></ButtonGoBack>
    </div>
    <h1 class="text-start text-2xl mt-2 mb-8  ms-2 font-medium">Edita tu perfil</h1>
    <form action="#" @submit.prevent="handleSubmit" class="border  p-6 max-w-lg rounded-lg  m-2">
        <div class="flex flex-col mb-3">
            <label for="bio" class="ms-2 m-2">Biografía</label>
            <textarea :readonly="loading" name="bio" id="bio" class="p-2 m-2 border rounded-md resize-none read-only:bg-gray-200" v-model="editData.bio"></textarea>
        </div>
        <div class="flex flex-col mb-3">
            <label for="name" class="ms-2 m-2">Nombre de usuario</label>
            <input :readonly="loading" name="name" class="p-2 m-2 border rounded-md read-only:bg-gray-200" id="name" v-model="editData.displayName" />
        </div>
        <div class="flex flex-col mb-3">
            <label for="genres" class="ms-2 m-2">Géneros favoritos</label>

            <div class="flex">
                <input  :readonly="loading" type="checkbox" value="Comedy" class="p-2 m-2 border rounded-md read-only:bg-gray-200" id="comedy"
                    :checked="genres.includes('Comedy')" @change="toggleGenre('Comedy')" />
                <label for="comedy">Comedia</label>
            </div>

            <div class="flex">
                <input :readonly="loading" type="checkbox" value="Drama" class="p-2 m-2 border rounded-md read-only:bg-gray-200" id="drama"
                    :checked="genres.includes('Drama')" @change="toggleGenre('Drama')" />
                <label for="drama">Drama</label>
            </div>

            <div class="flex">
                <input  :readonly="loading" type="checkbox" value="Science-Fiction" class="p-2 m-2 border rounded-md read-only:bg-gray-200" id="science-fiction"
                    :checked="genres.includes('Science-Fiction')" @change="toggleGenre('Science-Fiction')" />
                <label for="science-fiction">Ciencia Ficción</label>
            </div>

            <div class="flex">
                <input :readonly="loading" type="checkbox" value="Crime" class="p-2 m-2 border rounded-md read-only:bg-gray-200" id="crime"
                    :checked="genres.includes('Crime')" @change="toggleGenre('Crime')" />
                <label for="crime">Crimen</label>
            </div>

        </div>

        <div class="ms-2">
            <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">{{!loading?'Confirmar':'Actualizando perfil'}}</button>
        </div>
    </form>
</template>

