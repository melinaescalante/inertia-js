<script setup>
import NavBar from '../../components/NavBar.vue'
import { Link, usePage, router } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'
import Spinner from '../../components/Spinner.vue'
import { readPostsByUser } from '../../../services/posts';
import { allFollowing, isFollowed, getEmailUser, addFollow, getUserName, removeFollow } from '../../../services/users';
import { useUser } from "../../composables/useUser";
import { useLoginUser } from '../../composables/useLoginUser';
import { allSeriesWatched } from '../../../services/series';

const page = usePage()
const id = ref(page.props.id)
const loading = ref(true)
const postsById = ref([])
const emailUser = ref(getEmailUser(id.value))
const { loginUser } = useLoginUser()
const userName = ref(getUserName(page.props.id));
const { user } = useUser(id.value, emailUser.value, userName.value);
const seriesWatched = ref([])
onMounted(async () => {
  try {
    allSeriesWatched(id.value)
      .then(series => {
        seriesWatched.value = series || [];
      })
      .catch(error => {
        console.error("Error fetching series:", error);
        seriesWatched.value = [];
      });
    if (loginUser.value.id) {
      handleFollowed()
    }
    await readPostsByUser(async (newPosts) => {
      loading.value = true
      postsById.value = newPosts
      loading.value = false
    }, id.value)


  } catch (error) {
    console.log(error)
  }
})
const following = ref([])
const isFollow = ref()
async function totalFollowing() {
  try {
    following.value = await allFollowing(id.value)
  } catch (error) {
    console.log(error)
  }
}
totalFollowing()
async function makeFollow() {
  try {
    if (isFollow.value === true) {
      await removeFollow(loginUser.value.id, id.value)
    } else {
      await addFollow(loginUser.value.id, id.value)
    }
    await handleFollowed()
  } catch (error) {
    console.log(error)
  }
}
async function handleFollowed() {
  isFollow.value = await isFollowed(loginUser.value.id, id.value);


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

    <div class="grid grid-cols-3 grid-rows-auto mt-20 mb-[1.4rem] items-center justify-around  skiptranslate">
      <div class="mx-auto">

        <img :src="user.photoURL || '/no-image.jpg'" :alt="'Foto de perfil de ' + user.email"
          class=" ms-2 w-20 h-20 col-span-1 rounded-full object-cover group-hover:opacity-50 mx-auto">

      </div>

      <div class="mx-auto col-span-2">

        <div class=" grid grid-cols-1 mt-2 grid-rows-2 gap-3  mx-auto ">
          <div class="">
            <!-- <div class="flex items-center flex-wrap justify-stretch gap-4 md:gap-10 "> -->
            <div class=" flex flex-wrap items-center gap-4 md:gap-10 justify-stretch" v-if="user.id !== loginUser.id">
              <p class="font-medium text-start">@{{ user.username }}</p>

              <div class=" flex gap-4">

                <Link :href="`/chatPrivado/${user.id}/${user.email}`"
                  class="text-center text-white bg-blue-1000 transition-colors  hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5">
                Chatear</Link>
                <button type="button" @click="makeFollow"
                  class="text-center border border-blue-1000  text-blue-1000 hover:bg-blue-0 hover:border-transparent transition-colors focus:ring-4 font-medium rounded-lg text-sm px-5 py-1.5 ">
                  {{ isFollow ? 'Siguiendo ' : 'Seguir' }}</button>
              </div>
            </div>
            <div class=" flex items-center flex-wrap justify-stretch gap-4 md:gap-10" v-else>
              <p class="font-medium text-start">@{{ user.username }}</p>

              <Link v-if="loginUser.id" href="/perfilinfo/edit"
                class="text-center text-white bg-blue-1000 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 m-3">
              Editar Perfil</Link>
            </div>
          </div>
          <div class="flex justify-stretch">

            <Link :href="`/${user.id}/${user.username}/seriesVistasRegistro`">
            Series vistas <span class="text-center block">{{ seriesWatched?.length || 0
            }}</span>

            </Link>
            <Link :href="`/${user.id}/${user.username}/seguidos`">
            Seguidos <span class="text-center block">{{ following?.length || 0 }}</span>
            </Link>

          </div>



        </div>
      </div>
      <div class="ms-[2vw] md:ms-[2vw] col-span-3 items-start grid grid-rows-auto grid-cols-1 mb-1">
        <div>

          <p class="font-medium m-1 ">{{ user.displayName }}</p>
        </div>
        <div>

          <p class=" text-blue-1000 m-1 mb-2 font-normal" v-if="user.bio">{{ user.bio }}</p>
        </div>
        <div class="flex skiptranslate items-center">
          <ul class="flex-wrap flex items-center flex-grow w-full">
            <liv v-for="genre in user.genres"
              class="rounded-xl bg-opacity-70   border border-orange-0 text-blue-1000 text-sm  font-normal py-1 px-2 m-1 text-center">
              {{
                Object.values(genre)[0] }}</liv>
          </ul>
        </div>
      </div>

    </div>
    <div class="border-t p-2 grid-cols-3 justify-items-center  mb-20  md:grid-cols-4  grid "
      v-if="postsById !== undefined">
      <div v-for="post in postsById" class="mt-5 ">
        <Link :href="`/post/${post.id}`" :id="post.id">
        <!-- <img :src="post.image ? post.image : '/text.jpg'" :alt="post.serie" class="w-[7rem] h-auto  bg-cover "> -->
        
        <div class="w-[7rem] h-[7rem] bg-cover bg-center "
                    :style="{ backgroundImage: `url(${post.image || '/text.jpg'})` }"></div>


        </Link>
      </div>
    </div>
    <div class="text-center  mb-20 " v-if="postsById.length === 0">
      <p>No tiene ni una publicación hecha</p>
    </div>


  </template>

</template>
