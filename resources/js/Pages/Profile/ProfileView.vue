<script setup>
import NavBar from '../../components/NavBar.vue'
import { Link, usePage } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'
import Spinner from '../../components/Spinner.vue'
import { readPostsByUser } from '../../../services/posts';
import { getEmailUser, getNameUser, getUserName, getUsersProfileById } from '../../../services/users';
import { useUser } from "../../composables/useUser";
import { useLoginUser } from '../../composables/useLoginUser';
import { allSeriesWatched } from '../../../services/series';
import { addFriend } from '../../../services/users';
defineProps({
  userName: String,
  followers: Number,
})

const page = usePage()
const id = ref(page.props.id)
const loading = ref(true)
const postsById = ref([])
const emailUser = ref('')
const userName = ref('')
const user = ref(null)
const seriesWatched=ref([])
const { loginUser } = useLoginUser()
onMounted(async () => {
  try {
    seriesWatched.value=await allSeriesWatched(id.value)
    emailUser.value = await getEmailUser(id.value)
    userName.value = await getNameUser(id.value)
    user.value = useUser(id.value, await emailUser.value, userName.value)

    await readPostsByUser(async (newPosts) => {
      loading.value = true
      postsById.value = newPosts
      user.value = await getUsersProfileById(id.value, await emailUser.value, userName.value)
      loading.value = false
    }, id.value)
  } catch (error) {
    console.log(error)
  }
})
async function makeFriend() {
  try {
    await addFriend(loginUser.value.id,id.value)
  } catch (error) {
    console.log(error)
  }
  
}
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

        <p class="font-medium text-center">{{ user.displayName }}</p>
        <div class="flex justify-around">
          <p class="me-2">Series vistas <span class="block text-center">{{ seriesWatched.length || 0}}</span></p>
          <p>Amigos</p>
        </div>
        <div class="mt-2 flex flex-wrap justify-around" v-if="user.id !== loginUser.id">


          <Link :href="`/chatPrivado/${user.id}/${user.email}`"
            class="text-center text-white bg-blue-1000 transition-colors  hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 m-3">
          Chatear</Link>
          <button type="button" @click="makeFriend"
            class="text-center border border-blue-1000  text-blue-1000 hover:bg-blue-0 hover:border-transparent transition-colors focus:ring-4 font-medium rounded-lg text-sm px-5 py-1.5 m-3">
          Ser amigos</button>
        </div>
        <div class=" flex flex-wrap justify-around" v-else>
          <Link v-if="loginUser.id" href="/perfilinfo/edit"
            class="text-center text-white bg-blue-1000 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 m-3">
          Editar Perfil</Link>
        </div>
        <p class=" text-blue-500 text-center " v-if="user.bio">{{ user.bio }}</p>
        <div class="flex flex-wrap">
          <ul v-for="genre in user.genres">
            <li class="rounded-xl bg-opacity-70   border border-orange-0 text-blue-1000 text-sm  font-medium py-1 px-2 m-1 text-center">{{
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
