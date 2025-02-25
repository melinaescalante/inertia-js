<script setup>
import NavBar from '../../components/NavBar.vue'
import { Link, usePage, router } from '@inertiajs/vue3'
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



    <div v-if="loading" class="flex justify-center mt-[40vh]">
        <Spinner msg="Cargando perfil"></Spinner>
    </div>
    <template v-else class="">

        <div class="skiptranslate grid grid-cols-3 grid-rows-auto items-center mt-20 justify-around mb-[1.3rem] gap-8">
            <Link href="/editFotoPerfil" class="mx-auto">
            <div class="relative group w-20 h-20 ">
                <img :src="loginUser.photoURL || '/no-image.jpg'" :alt="'Foto de perfil de ' + loginUser.email"
                    class="col-span-1 w-full h-full rounded-full object-cover group-hover:opacity-50">

                <img src="/public/images/camera.svg" alt="Icono de cámara"
                    class="absolute top-1/2 left-1/2 w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>
            </Link>
            <div class="col-span-2 mx-auto ">

                <div class=" grid grid-cols-1 grid-rows-2 gap-3  mx-auto ">
                    <div class="flex items-center flex-wrap justify-stretch gap-4 md:gap-10 ">

                        <p class="font-medium text-start">@{{ loginUser.username }}
                        </p>
                        <div>

                            <Link v-if="loginUser.id" href="/perfilinfo/edit"
                                class="text-center text-white bg-blue-1000 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 ">
                            Editar Perfil</Link>

                        </div>
                    </div>
                    <div class="flex  justify-stretch">

                        <Link :href="`/${loginUser.id}/${loginUser.username}/seriesVistasRegistro`">
                        <p class="me-2">Series vistas <span class="text-center block">{{ seriesWatched?.length || 0
                        }}</span>
                        </p>
                        </Link>
                        <Link :href="`/${loginUser.id}/${loginUser.username}/seguidos`">Seguidos <span
                            class="text-center block">{{ following?.length || 0 }}</span></Link>
                    </div>
                </div>

            </div>
            <div class="ms-[2vw] md:ms-[2vw] col-span-3 items-start grid grid-rows-auto grid-cols-1  mb-1">
                <div>

                    <p class="m-1 font-medium skiptranslate">{{ loginUser.displayName }}
                    </p>
                </div>
                <div>

                    <p class="m-1 mb-2 text-blue-1000   font-normal  skiptranslate" v-if="loginUser.bio">{{
                        loginUser.bio
                    }}</p>
                </div>
                <div class="flex  skiptranslate items-center ">
                    <ul class="flex-wrap  flex items-center flex-grow w-full">
                        <li v-for="genre in loginUser.genres"
                            class="rounded-xl bg-opacity-70   border border-orange-0 text-blue-1000  text-sm font-normal px-2 py-1 m-1 text-center">
                            {{ Object.values(genre)[0] }}</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="skiptranslate border-t p-2 grid-cols-3  md:grid-cols-4  grid justify-items-center mb-20"
            v-if="postsById !== undefined">
            <div v-for="post in postsById" class=" ">
                <Link :href="`/post/${post.id}`" :id="post.id">
                <!-- <img :src="post.image ? post.image : '/text.jpg'" :alt="post.serie" class="w-[7rem] h-auto  bg-cover "> -->


                <div class="w-[7rem] h-[7rem] bg-cover bg-center "
                    :style="{ backgroundImage: `url(${post.image || '/text.jpg'})` }"></div>


                </Link>
            </div>
        </div>

        <div class="skiptranslate text-center mb-20" v-if="postsById.length === 0">
            <p>No tienes ni una publicación hecha</p>
        </div>

    </template>
</template>
