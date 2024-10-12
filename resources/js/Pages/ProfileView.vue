<script setup>
import NavBar from '../components/NavBar.vue'
import { Link, usePage } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'

import { suscribeToAuthChanged } from "../../services/auth";
import { readPostsByUser } from '../../services/posts';
import { getEmailUser, getUsersProfileById } from '../../services/users';

defineProps({
  userName: String,
  followers: Number,
  // genres: Array
})
const page = usePage()
const id = ref(null) // Esto te da el ID directamente
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
console.log(id.value)
onMounted(async () => {
  // Suscribir a cambios de autenticación
  suscribeToAuthChanged(async (newUserData) => {
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
        <div role="status">
          <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor" />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill" />
          </svg>

        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex items-center mt-4 justify-around mb-3">
        <img src="/public/no-image.jpg" :alt="'Foto de perfil de ' + loginUser.email" class="w-20 h-20 rounded-full ">
        <div class="flex flex-col">

          <p class="font-medium text-center">{{ userData.displayName ? userData.displayName : userData.email }}</p>
          <div class="flex justify-around">
            <p class="me-2">Series vistas</p>
            <p>Amigos</p>
          </div>
          <Link href="/perfil/edit"
            class="text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 m-3">
          Editar Perfil</Link>
          <p class="border-b text-blue-500 text-center " v-if="userData.bio">{{ userData.bio }}</p>
          <div class="flex">
            <ul v-for="genre in userData.genres">
              <li class="rounded-xl bg-opacity-70   bg-blue-950  text-sm  text-white font-medium p-2 m-1 text-center">{{
                genre }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="postsById !== undefined">
        <div v-for="post in postsById" class="mt-5">
          <Link :href="`/post/${post.id}`" :id="post.id">
          <img :src="post.image" :alt="post.serie" class="w-[7rem] h-[7rem]  bg-cover w">

          </Link>
        </div>
      </div>

    </template>
  </template>
</template>
