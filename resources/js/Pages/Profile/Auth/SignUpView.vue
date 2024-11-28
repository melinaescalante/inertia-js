<script setup>
import { ref } from 'vue';
import { Link, router } from '@inertiajs/vue3'
import { signUp } from '../../../../services/auth'
import NavBarSecondary from '../../../Components/NavBarSecondary.vue';

const msg = ref('')
defineProps({
    disable: Boolean
})
const isValid = ref(false)
const user = ref({
    email: '',
    password: '',
    userName: '',
    fullname:'',
})
//codigo funcional sin username correcto
// const user = ref({
//     email: '',
//     password: '',
//     userName: ''
// })
const loading = ref(false)
function passwordIsValid(e) {
    if (user.value.password.length >= 6) {
        isValid.value = true
    }
}
async function handleSubmit() {
    loading.value = true
    try {
        await signUp({ ...user.value })
        msg.value = "Su usuario se ha registrado correctamente"

        router.replace('/')
    } catch (error) {
        console.log(error)
        msg.value = "Su usuario no se ha registrado"
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
            <h1 class="text-center text-2xl mt-8 mb-6 font-medium ">Registrarme</h1>
            <div class="p-4">
                <img src="/public/images/singup.svg" alt="Ilustración de registro" type="image/svg+xml">
            </div>
            <form action="#" @submit.prevent="handleSubmit" class="p-3">
                <div class="mb-5">
                    <label for="email" class="block mb-2 ">Email</label>
                    <input type="email" id="email"
                        class=" p-2 mb-2 w-full border rounded-md  bg-slate-100 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        v-model="user.email" required placeholder="nombre@gmail.com">
                </div>
                <div class="mb-5">
                    <label for="fullname" class="block mb-2 ">Nombre completo</label>
                    <input type="text" id="fullname"
                        class=" p-2 mb-2 w-full border rounded-md  bg-slate-100 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        required placeholder="" v-model="user.fullname">
                </div>
                <div class="mb-5">
                    <label for="username" class="block mb-2 ">Nombre de usuario</label>
                    <input type="text" id="username"
                        class=" p-2 mb-2 w-full border rounded-md  bg-slate-100 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        v-model="user.userName" required placeholder="melina2">
                </div>
                <div class="mb-6">
                    <label for="password" class="block mb-2">Constraseña</label>
                    <div class="flex gap-1">

                        <input @input="passwordIsValid" id="password" :type="!passwordVisible ? 'password' : 'text'"
                            class=" p-2 w-full border rounded-md bg-slate-100 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            v-model="user.password" required placeholder="Contraseña" />

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
                    <p v-if="!isValid" class="text-slate-500 mt-3">Su contraseña debe tener un mínimo de 6 caracteres.
                    </p>
                </div>


                <button :disabled="!isValid" type="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full notranslate"
                    :class="{ disable: !isValid }">Crear cuenta</button>

            </form>
            <div v-if="msg !== 'Su usuario se ha registrado correctamente' && msg !== ''"
                class="bg-red-200 p-4 m-2 rounded-md">
                <p>{{ msg }}</p>
            </div>
            <div v-if="msg == 'Su usuario se ha registrado correctamente'" class="bg-green-200 p-4 m-2 rounded-md">
                <p>{{ msg }}</p>
            </div>
        </section>
    </NavBarSecondary>
    <div class="flex flex-col  items-center justify-center">
        <p class="mt-7">¿Ya tienes una cuenta?</p>
        <Link class="mt-2 text-blue-1000 font-medium " href="/ingresar">Ingresar</Link>
    </div>
</template>
