<script setup>
import NavBar from '../components/NavBar.vue'
import { editProfile, suscribeToAuthChanged } from '../../services/auth'
import { ref, onMounted } from 'vue';

const editData = ref({
    displayName: '',
    bio: '',
})
const genres = ref([])
const loading = ref(false)
onMounted(() => {
    suscribeToAuthChanged((newUserData) => {
        editData.value.displayName = newUserData.displayName;
        editData.value.bio = newUserData.bio;
        genres.value = newUserData.genres; 
    });

})
async function handleSubmit() {
    loading.value = true
    try {
        console.log(genres.value)
        await editProfile({ ...editData.value, genres: genres.value })
    } catch (error) {
        console.log("No se ha podido editar correctamente el perfil.")
    }
}
</script>
<template>
    <NavBar></NavBar>
    <h1 class="text-start text-2xl mt-8 mb-8 font-medium">Edita tu perfil</h1>
    <form action="#" @submit.prevent="handleSubmit" class=" border p-6 max-w-lg rounded-lg mx-auto">
        <div class="flex flex-col mb-3">
            <label for="bio" class="ms-2 m-2">Biografia</label>
            <textarea name="bio" id="bio" class="p-2 m-2 border rounded-md resize-none"
                v-model="editData.bio"></textarea>
        </div>
        <div class="flex flex-col mb-3">
            <label for="name" class="ms-2 m-2">Nombre de usuario</label>
            <input name="name" class="p-2 m-2  border rounded-md" id="name" v-model="editData.displayName" />
        </div>
        <div class="flex flex-col mb-3">
            <label for="genres" class="ms-2 m-2">Géneros favoritos</label>

            <div class="flex">
                <input type="checkbox" value="Comedy" class="p-2 m-2 border rounded-md" id="comedy" v-model="genres" />
                <label for="comedy">Comedia</label>
            </div>

            <div class="flex">
                <input type="checkbox" value="Drama" class="p-2 m-2 border rounded-md" id="drama" v-model="genres" />
                <label for="drama">Drama</label>
            </div>

            <div class="flex">
                <input type="checkbox" value="Science-Fiction" class="p-2 m-2 border rounded-md" id="Science-fiction"
                    v-model="genres" />
                <label for="Science-fiction">Ciencia Ficción</label>
            </div>

            <div class="flex">
                <input type="checkbox" value="Crime" class="p-2 m-2 border rounded-md" id="Crime" v-model="genres" />
                <label for="Crime">Crimen</label>
            </div>

        </div>

        <div class="ms-2">

            <button
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">Confirmar</button>
        </div>
    </form>
</template>