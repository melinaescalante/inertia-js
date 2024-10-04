
<script setup>
import NavBar from '../components/NavBar.vue'
import { Link } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'

import { suscribeToAuthChanged } from "../../services/auth";
import { readPostsByUser } from '../../services/posts';

defineProps({
  userName: String,
  followers: Number,
})

const loginUser = ref({
    id: null,
    email: null,
    displayName: null,
    bio:null

})
const postsById=ref([])
onMounted(async () => {
    suscribeToAuthChanged(newUserData =>{
       loginUser.value = newUserData
      
       
        if (loginUser.value.id!==null) {
           readPostsByUser((newPosts) => postsById.value = newPosts, loginUser.value.id)
          console.log(loginUser.value.id)
        }
      })
})
</script>
<template>
    <NavBar></NavBar>
    <template v-if="loginUser.id ==null">

        <div class="flex flex-col justify-center my-64">
            <Link href="/ingresar" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-3">Iniciar Sesion</Link>
            <Link href="/registrarme" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 m-3">Registrarme</Link>
        </div>
    </template>
    <template v-else>
      <div class="flex items-center mt-4 justify-around mb-3">
        <img src="/public/no-image.jpg" :alt="'Foto de perfil de '+ loginUser.email " class="w-20 h-20 rounded-full ">
        <div class="flex flex-col">

          <p class="font-medium text-center">{{loginUser.displayName?loginUser.displayName: loginUser.email }}</p>
          <div class="flex justify-around">
            <p class="me-2">Series vistas</p>
            <p>Amigos</p>
          </div>
          <Link href="/perfil/edit" class="text-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 m-3">Editar Perfil</Link>
          <p class="border-b text-blue-500 text-center " v-if="loginUser.bio">{{ loginUser.bio }}</p>
        </div>
      </div>
      <div v-if="postsById!==undefined">
        <div v-for="post in postsById" class="mt-5">
          <img :src="post.image" height="110" width="110" :alt="post.serie">
        </div>
      </div>
        
    </template>
        
</template>
