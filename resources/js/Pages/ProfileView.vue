
<script setup>
import NavBar from '../components/NavBar.vue'
import { Link } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'
import { auth } from "../../services/firebase";
import { onAuthStateChanged } from 'firebase/auth';


const loginUser = ref({ id: null, email: null })
onMounted(() => {

  onAuthStateChanged(auth,user => {
    if (user) {
      loginUser.value = {
        id: user.uid,
        email: user.email
      }
    } else {
      loginUser.value = {
        id: null, 
        email: null
      }
    }
    console.log(loginUser.value)
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
        <h1 class="font-semibold  text-center">Hola {{ loginUser.email }}</h1>
    </template>
        
</template>
