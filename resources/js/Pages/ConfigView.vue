<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import NavBar from '../components/NavBar.vue'
import { router } from "@inertiajs/vue3";
import { suscribeToAuthChanged, logout } from "../../services/auth";
import { useLoginUser } from "../composables/useLoginUser";

const {loginUser}=useLoginUser()
const handleLogout=()=>{
logout()
router.replace('/ingresar')
}
</script>
<template>
    <NavBar></NavBar>
    <h1 class="text-2xl m-4 font-medium">

      Ajustes
    </h1>
     <form action="" @submit.prevent="handleLogout">
          <button type="submit" class="inline-block text-slate-50 font-medium w-full p-3 border rounded-3xl bg-blue-1000 mt-4">Cerrar sesion</button>
        </form>
</template>