<script setup>
import { ref, onMounted } from "vue";
import NavBar from '../components/NavBar.vue'
import { router } from "@inertiajs/vue3";
import { suscribeToAuthChanged, logout } from "../../services/auth";
const loginUser = ref({
    id: null,
    email: null,
    displayName: null,
    bio:null

})
onMounted(() => {
    suscribeToAuthChanged(newUserData => loginUser.value = newUserData)
})

const handleLogout=()=>{
logout()
router.replace('/ingresar')

}
</script>
<template>
    <NavBar></NavBar>
     <form action="" @submit.prevent="handleLogout">
          <button type="submit" class="block text-slate-50 font-medium w-full p-3 border rounded-3xl bg-blue-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none mt-4">Cerrar sesion</button>
        </form>
</template>