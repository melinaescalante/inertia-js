<script setup>
import NavBar from '../../components/NavBar.vue'
import { Link, usePage } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'
import Spinner from '../../components/Spinner.vue'
import { readPostsByUser } from '../../../services/posts';
import { allSeriesWatched } from '../../../services/series';
import { useLoginUser } from "../../composables/useLoginUser";
import { allFollowing } from '../../../services/users';
const { loginUser } = useLoginUser()
defineProps({
    userName: String,
    followers: Number,

})
const loading = ref(true)
const postsById = ref([])
const seriesWatched = ref([])
const following = ref([])
onMounted(async () => {

    try {
        allSeriesWatched(loginUser.value.id)
            .then(series => {
                seriesWatched.value = series || [];
            })
            .catch(error => {
                console.error("Error fetching series:", error);
                seriesWatched.value = []; // Puedes manejar un valor por defecto en caso de error
            });

        // seriesWatched.value = await allSeriesWatched(loginUser.value.id)
        following.value = await allFollowing(loginUser.value.id)
        await readPostsByUser(async (newPosts) => {
            postsById.value = newPosts
            loading.value = false;
        }, loginUser.value.id)
    } catch (error) {
        console.log(error)
    }

})

</script>
<template>
    <NavBar></NavBar>



    <div v-if="loading" class="flex justify-center mt-80">
        <Spinner msg="Cargando perfil"></Spinner>
    </div>
    <template v-else>

        <div class="skiptranslate grid grid-cols-3 items-center mt-3 justify-around mb-3">
            <Link href="/editFotoPerfil">
            <div class="relative group w-20 h-20 ms-2">
                <img :src="loginUser.photoURL || '/no-image.jpg'" :alt="'Foto de perfil de ' + loginUser.email"
                    class="col-span-1 w-full h-full rounded-full object-cover group-hover:opacity-50">

                <img src="/public/images/camera.svg" alt="Icono de cámara"
                    class="absolute top-1/2 left-1/2 w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>

            </Link>
            <div class="flex flex-col col-span-2">

                <p class="font-medium text-center">@{{ loginUser.username }}
                </p>
                <div class="flex justify-around">
                    <p class="me-2">Series vistas <span class="text-center block">{{ seriesWatched?.length || 0
                            }}</span>
                    </p>
                    <p>Seguidos <span class="text-center block">{{ following?.length || 0 }}</span></p>
                </div>
                <div class="mt-2 flex flex-wrap justify-around">

                    <Link v-if="loginUser.id" href="/perfilinfo/edit"
                        class="text-center text-white bg-blue-1000 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 m-3">
                    Editar Perfil</Link>

                </div>
                <p class="font-medium text-center">{{ loginUser.displayName }}
                </p>
                <p class=" text-blue-1000 text-center  font-medium m-2" v-if="loginUser.bio">{{ loginUser.bio }}</p>
                <div class="flex flex-wrap">
                    <ul v-for="genre in loginUser.genres">
                        <li
                            class="rounded-xl bg-opacity-70   border border-orange-0 text-blue-1000  text-sm font-normal px-2 py-1 m-1 text-center">
                            {{ Object.values(genre)[0] }}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="skiptranslate border-t p-2 flex flex-wrap justify-around" v-if="postsById !== undefined">
            <div v-for="post in postsById" class="mt-5 ">
                <Link :href="`/post/${post.id}`" :id="post.id">
                <img :src="post.image ? post.image : '/text.jpg'" :alt="post.serie"
                    class="w-[7rem] h-[7rem]  bg-cover w">

                </Link>
            </div>
        </div>

        <div class="skiptranslate text-center" v-if="postsById.length === 0">
            <p>No tienes ni una publicación hecha</p>
        </div>

    </template>
</template>
