<script setup>
import NavBar from '../../components/NavBar.vue'
import { Link, usePage } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'
import Spinner from '../../components/Spinner.vue'
import { readPostsByUser } from '../../../services/posts';
import { getEmailUser, getNameUser, getUserName, getUsersProfileById } from '../../../services/users';
import { useUser } from "../../composables/useUser";

defineProps({
  userName: String,
  followers: Number,
})

const page = usePage()
const id = ref(page.props.id)
console.log(id.value)
const loading = ref(true)
const postsById = ref([])
const emailUser = ref('')
const userName = ref('')
const user = ref(null)
onMounted(async () => {
  try {
    emailUser.value = await getEmailUser(id.value)
    userName.value = await getNameUser(id.value)
    user.value =  useUser(id.value, await emailUser.value, userName.value)
    
    await readPostsByUser(async (newPosts) => {
      loading.value = true
      postsById.value = newPosts
      user.value=await getUsersProfileById(id.value, await emailUser.value, userName.value)
      loading.value = false
    }, id.value)
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <NavBar></NavBar>

  <template v-if="loading">

    <div class="flex justify-center mt-80">
      <Spinner msg="Cargando perfil"></Spinner>
    </div>
  </template>
  <template v-else>

    <div class="grid grid-cols-3 items-center mt-3 justify-around mb-3">

        <img :src="user.photoURL || '/no-image.jpg'" :alt="'Foto de perfil de ' + user.email"
          class=" ms-2 w-20 h-20 col-span-1 rounded-full object-cover group-hover:opacity-50">


      <div class="flex flex-col col-span-2">
        {{ console.log(user) }}
        <p class="font-medium text-center">{{ user.displayName }}</p>
        <div class="flex justify-around">
          <p class="me-2">Series vistas</p>
          <p>Amigos</p>
        </div>
        <div class="mt-2 flex flex-wrap justify-around">


          <Link :href="`/chatPrivado/${user.id}/${user.email}`"
            class="text-center text-blue-800 border border-blue-700 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 m-3">
          Chatear</Link>
        </div>
        <p class="border-b text-blue-500 text-center " v-if="user.bio">{{ user.bio }}</p>
        <div class="flex flex-wrap">
          <ul v-for="genre in user.genres">
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
    <div class="text-center" v-if="postsById.length === 0">
      <p>No tiene ni una publicación hecha</p>
    </div>


  </template>

</template>
