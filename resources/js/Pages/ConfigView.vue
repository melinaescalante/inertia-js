<script setup>
import NavBar from '../components/NavBar.vue'
import { router } from "@inertiajs/vue3";
import {  logout } from "../../services/auth";

import {Link} from "@inertiajs/vue3";
const handleLogout=()=>{
logout()
router.replace('/ingresar')
}
</script>
<template>
    <NavBar></NavBar>
    <h1 class="text-2xl m-4 font-medium skiptranslate">

      Ajustes
    </h1>
     <form action="#" @submit.prevent="handleLogout">
          <button type="submit" class="inline-block text-slate-50 font-medium w-full p-3 border rounded-3xl bg-blue-1000 mt-4 skiptranslate">Cerrar sesion</button>
        </form>
        <div class=" mx-auto text-center mt-4">

          <Link class="text-blue-1000 text-center font-medium skiptranslate" href="https://tvonlandingpage.netlify.app">Landing page TVON</Link>
        </div>
</template>