<script setup>
import { ref } from 'vue';
import { Link, router } from '@inertiajs/vue3'
import { login } from '../../../../services/auth'
import NavBarSecondary from '../../../Components/NavBarSecondary.vue';
const msg = ref('')
const user = ref({
    email: '',
    password: ''
})
const loading = ref(false)
async function handleSubmit() {
    loading.value = true
    try {
        await login({ ...user.value })
        msg.value = "Se ha ingresado correctamente"
        router.replace('/')

    } catch (error) {
        msg.value = "No se ha podido ingresar. Intente de nuevo por favor."
        setTimeout(() => {
            msg.value = '';
        }, 3000);
    }
}
const passwordVisible = ref(false);
function showPassword() {
    passwordVisible.value = !passwordVisible.value
}
</script>
<template>
    <NavBarSecondary>
        <section class="skiptranslate">
            <h1 class="text-center text-2xl mt-8 mb-8 font-medium">Inicio de Sesión</h1>
            <div class="h-1/3 w-1/2 m-auto">

                <img src="/public/images/login.svg" alt="Ilustración de logueo">
            </div>
            <form action="#" @submit.prevent="handleSubmit" class="p-3">
                <div class="mb-6">
                    <label for="email" class="block mb-2">Email</label>
                    <input type="email" id="email"
                        class=" p-2 mb-2 w-full border rounded-md bg-slate-100   focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        v-model="user.email" placeholder="nombre@gmail.com" required>
                </div>

                <div class="mb-6">
                    <label for="password" class="block mb-2">Constraseña</label>
                    <div class="flex gap-1">

                        <input id="password" :type="!passwordVisible ? 'password' : 'text'" class="p-2 w-full border rounded-md bg-slate-100 
                    focus:ring-blue-500 focus:border-blue-500 focus:outline-none" v-model="user.password" required
                            placeholder="Contraseña" />
                        <button type="button" @click="showPassword" class="bg-blue-1000 rounded-lg"><svg
                                class="w-6 h-6 text-orange-0 fill-transparent " aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-width="1.5"
                                    d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                <path stroke="currentColor" stroke-width="1.5"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <input type="submit" value="Ingresar"
                    class="text-white bg-blue-1000 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-3xl text-sm px-5 py-2.5 w-full" />

            </form>
        </section>
    </NavBarSecondary>
    <div class="flex flex-col  items-center justify-center">
        <p class="mt-7">¿No tienes una cuenta?</p>
        <Link class="mt-2 text-blue-1000 font-medium " href="/registrarme">Registrarme</Link>
    </div>
    <div v-if="msg !== 'Se ha ingresado correctamente' && msg !== ''" class="bg-red-200 p-4 m-2 rounded-md">
        <p>{{ msg }}</p>
    </div>
    <div v-if="msg == 'Se ha ingresado correctamente'" class="bg-green-200 p-4 m-2 rounded-md">
        <p>{{ msg }}</p>
    </div>
</template>
