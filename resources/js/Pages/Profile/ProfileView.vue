<script setup>
import NavBar from '../../components/NavBar.vue'
import { Link, usePage } from '@inertiajs/vue3'
import { ref, onMounted, onUnmounted } from 'vue'
import Spinner from '../../components/Spinner.vue'
import { suscribeToAuthChanged } from "../../../services/auth";
import { readPostsByUser } from '../../../services/posts';
import { getEmailUser, getUsersProfileById } from '../../../services/users';
let unSubscribeFromAuth = () => { };

defineProps({
  userName: String,
  followers: Number,

})
const page = usePage()
const id = ref(null)
const loading = ref(true)
const loginUser = ref({
  id: null,
  email: null,
  displayName: null,
  bio: null,
  genres: null
})

const postsById = ref([])
const userData = ref([])
const emailUser = ref('')
id.value = page.props.id

onMounted(async () => {
  // Suscribir a cambios de autenticación
  unSubscribeFromAuth = suscribeToAuthChanged(async (newUserData) => {
    loginUser.value = newUserData

    if (loginUser.value.id !== null && id.value !== null) {
      try {
        await readPostsByUser(async (newPosts) => {
          postsById.value = newPosts
          emailUser.value = await getEmailUser(id.value)
          if (emailUser.value) {
            userData.value = await getUsersProfileById(id.value, emailUser.value)
            console.log(userData.value)
            loading.value = false;

          }
          console.log(postsById.value)
        }, id.value)


      } catch (error) {
        console.log(error)
      }

    }

  })
  // Asegúrate de que los posts se han cargado antes de acceder a ellos
})
onUnmounted(() => {
  unSubscribeFromAuth();

})
</script>
<template>
  <NavBar></NavBar>

  <template v-if="loginUser.id === null">

    <div class="flex flex-col justify-center my-64">
      <Link href="/ingresar"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-3">
      Iniciar Sesion</Link>
      <Link href="/registrarme"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-3">
      Registrarme</Link>
    </div>
  </template>
  <template v-else>
    <template v-if="loading">

      <div class="flex justify-center mt-80">
        <Spinner msg="Cargando perfil"></Spinner>
      </div>
    </template>
    <template v-else>
      <div class="mt-1" v-if="loginUser.id !== userData.id">

      </div>
      <div class="grid grid-cols-3 items-center mt-3 justify-around mb-3">
        <Link href="/editFotoPerfil">

        <img src="/public/no-image.jpg" :alt="'Foto de perfil de ' + loginUser.email"
          class="col-span-1 ms-2 w-20 h-20 rounded-full ">
        </Link>
        <div class="flex flex-col col-span-2">

          <p class="font-medium text-center">{{ userData.displayName ? userData.displayName : userData.email }}</p>
          <div class="flex justify-around">
            <p class="me-2">Series vistas</p>
            <p>Amigos</p>
          </div>
          <div class="mt-2 flex flex-wrap justify-around">

            <Link v-if="loginUser.id === userData.id" href="/perfilinfo/edit"
              class="text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 m-3">
            Editar Perfil</Link>
            <Link v-else :href="`/chatPrivado/${userData.id}/${userData.email}`"
              class="text-center text-blue-800 border border-blue-700 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 m-3">
            Chatear</Link>
          </div>
          <p class="border-b text-blue-500 text-center " v-if="userData.bio">{{ userData.bio }}</p>
          <div class="flex flex-wrap">
            <ul v-for="genre in userData.genres">
              <li class="rounded-xl bg-opacity-70   bg-blue-950  text-sm  text-white font-medium p-2 m-1 text-center">{{
                genre }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="border-t p-2 flex flex-wrap justify-around" v-if="postsById !== undefined">
        <div v-for="post in postsById" class="mt-5 ">
          <Link :href="`/post/${post.id}`" :id="post.id">
          <img :src="post.image ? post.image : '/text.jpg'" :alt="post.serie" class="w-[7rem] h-[7rem]  bg-cover w">

          </Link>
        </div>
      </div>
      <div class="text-center" v-if="userData.id!==loginUser.id && postsById.length===0">
        <p>No tiene ni una publicación hecha</p>
      </div>
      <div class="text-center" v-if="userData.id==loginUser.id && postsById.length===0">
        <p>No tienes ni una publicación hecha</p>
      </div>
      
    </template>
  </template>
</template>
