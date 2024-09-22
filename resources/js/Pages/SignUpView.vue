<script setup>
import { ref } from 'vue';
import { Link, router } from '@inertiajs/vue3'
const user = ref({
    email: '',
    password: ''
})
const loading = ref(false)
async function handleSubmit() {
    // loading.value = true
    // try {
    //     await login({...user.value})
    //     console.log("Sesion iniciada")
    //         } catch (error) {
    //     console.log("Login error ", error)
    //     //Manjera error e interfaz amigable
    // }
}
</script>
<template>
    <nav class="flex justify-between items-center p-4 bg-slate-200 text-slate-800">
        <Link href="/" class="text-xl">Red Social</Link>

    </nav>
     <form action="" >
        <div class="mb-4">
            <label for="email" class="block mb-2">Email</label>
            <input type="email" id="email" class=" p-2 mb-2 w-full border rounded-md" v-model="user.email">
            <div class="mb-4">
                <label for="text" class="block mb-2">Constraseña</label>
                <input id="password" type="password" class=" p-2 w-full border rounded-md resize-none" v-model="user.password" />
            </div>
        </div>
        <input type="submit" value="Enviar"/>

    </form>
    <div
        class="fixed z-50 w-full h-16 max-w-xl -translate-x-1/2 bg-slate-200 border border-gray-200  bottom-0 left-1/2  flex justify-between items-center p-4 text-slate-800"></div>
</template>