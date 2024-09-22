<script setup>
import { ref } from 'vue';
import { Link , router} from '@inertiajs/vue3'
import { login } from '../../services/auth'
const msg=ref('')
const user = ref({
    email: '',
    password: ''
})
const loading = ref(false)
async function handleSubmit() {
    loading.value = true
    try {
        await login({...user.value})
        console.log("Sesion iniciada")
        msg.value="Se ha ingresado correctamente"
        router.replace('/')


    } catch (error) {
        console.log("Login error ", error)
        msg.value="No se ha podido ingresar. Intente de nuevo por favor."
    }
}
</script>
<template>
    <nav class="flex justify-between items-center p-4 bg-slate-200 text-slate-800">
        <Link href="/" class="text-xl">Red Social</Link>

    </nav>
     <form action="" @submit.prevent="handleSubmit" class="p-3" >
        <div class="mb-4">
            <label for="email" class="block mb-2">Email</label>
            <input type="email" id="email" class=" p-2 mb-2 w-full border rounded-md" v-model="user.email">
            <div class="mb-4">
                <label for="text" class="block mb-2">Constraseña</label>
                <input id="password" type="password" class=" p-2 w-full border rounded-md resize-none" v-model="user.password" />
            </div>
        </div>
        <input type="submit" value="Ingresar" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 "/>

    </form>
    <div v-if="msg !== 'Se ha ingresado correctamente' && msg !==''" class="bg-red-200 p-4 m-2 rounded-md">
        <p>{{ msg }}</p>
    </div>
    <div v-if="msg == 'Se ha ingresado correctamente'" class="bg-green-200 p-4 m-2 rounded-md">
        <p>{{ msg }}</p>
    </div>
</template>