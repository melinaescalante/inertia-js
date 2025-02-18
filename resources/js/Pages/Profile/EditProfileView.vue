<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import NavBar from '../../components/NavBar.vue';
import { editProfile, suscribeToAuthChanged } from '../../../services/auth';
let unSubscribeFromAuth = () => { };
const editData = ref({
    displayName: '',
    bio: '',
    username: ''
});
const genres = ref([]);
const loading = ref(false);
const genresTypes = [
    { "Adventure": "Aventura" },
    { "Action": "Accion" },
    { "Anime": "Anime" },
    { "Comedy": "Comedia" },
    { "Crime": "Crimen" },
    { "Drama": "Drama" },
    { "Espionage": "Espionaje" },
    { "Family": "Familia" },
    { "Fantasy": "Fantasia" },
    { "History": "Historia" },
    { "Horror": "Horror" },
    { "Legal": "Legal" },
    { "Medical": "Medicos" },
    { "Music": "Musica" },
    { "Romance": "Romance" },
    { "Science-Fiction": "Ciencia ficción" },
    { "Sports": "Deportes" },
    { "Supernatural": "Supernatural" },
    { "Thriller": "Thriller" },
    { "War": "Guerra" },
    { "Western": "Antiguas" },
]
onMounted(async () => {
    unSubscribeFromAuth = suscribeToAuthChanged((newUserData) => {
        editData.value.displayName = newUserData.displayName;
        editData.value.bio = newUserData.bio;
        editData.value.username = newUserData.username
        genres.value = newUserData.genres || [];
    });
});

function checkedGenre(genre, genreTraduction) {
    const value = genres.value.findIndex(item => {
        return Object.keys(item)[0] === genre
    })

    if (value > -1) {
        genres.value.splice(value, 1);
    } else {
        genres.value.push({ [genre]: genreTraduction });
    }
}

const msg = ref('')
async function handleSubmit() {
    loading.value = true;
    try {
        await editProfile({ ...editData.value, genres: genres.value });

        msg.value = "Perfil actualizado correctamente."
        setTimeout(() => {
            msg.value = '';
        }, 3000);
    } catch (error) {
        console.log('No se ha podido editar correctamente el perfil.');

    }
    loading.value = false;
}
onUnmounted(() => {
    unSubscribeFromAuth();

})
</script>
<template>

    <NavBar></NavBar>
    <section class="mt-20 mb-28" id="edit-my-profile">

        <div v-if="!loading && msg === 'Perfil actualizado correctamente.'"
            class="z-[10000] fixed w-auto bg-green-200 p-4 m-2 rounded-md flex items-center gap-2">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-width="2"
                    d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

            <p>{{ msg }}</p>
        </div>
        <h1 class="text-start text-2xl mt-4 mb-4  ms-3 font-medium">Editá tu perfil</h1>
        <form action="#" @submit.prevent="handleSubmit" class="border mx-auto p-6 max-w-lg rounded-lg  m-2">
            <div class="flex flex-col mb-3">
                <label for="name" class="ms-2 m-2">Nombre de usuario</label>
                <input disabled readonly name="username" class="p-2 m-2 border rounded-md bg-gray-200  " id="username"
                    :value="`@${editData.username}`" />
            </div>
            <div class="flex flex-col mb-3">
                <label for="name" class="ms-2 m-2">Nombre</label>
                <input :readonly="loading" name="name"
                    class="p-2 m-2 border rounded-md read-only:bg-gray-200 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    id="name" v-model="editData.displayName" />
            </div>
            <div class="flex flex-col mb-3">
                <label for="bio" class="ms-2 m-2">Biografía</label>
                <textarea :readonly="loading" name="bio" id="bio"
                    class="p-2 m-2 border rounded-md resize-none read-only:bg-gray-200 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    v-model="editData.bio"></textarea>
            </div>
            <label for="genres" class="ms-2 m-2">Géneros favoritos</label>
            <div class="grid grid-cols-2  mb-3 skiptranslate">

                <div v-for="(genre, index) in genresTypes" class="flex" :key="index">

                    <input :readonly="loading" type="checkbox" :value="Object.values(genre)[0]"
                        class="p-2 m-2 border rounded-md read-only:bg-gray-200" :id="Object.keys(genre)[0]"
                        :checked="genres.some(item => Object.keys(item)[0] === Object.keys(genre)[0])"
                        @change="checkedGenre(Object.keys(genre)[0], Object.values(genre)[0])" /> <label
                        :for="Object.keys(genre)[0]">{{ Object.values(genre)[0] }}</label>
                </div>

            </div>

            <div class="ms-2">
                <button
                    class="text-white bg-blue-1000 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">{{
                        !loading ? 'Confirmar' : 'Actualizando perfil' }}</button>
            </div>
        </form>
    </section>
</template>
