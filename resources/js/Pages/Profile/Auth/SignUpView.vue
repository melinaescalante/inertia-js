<script setup>
import { ref } from 'vue';
import { Link, router } from '@inertiajs/vue3'
import { signUp } from '../../../../services/auth'
import NavBarSecondary from '../../../Components/NavBarSecondary.vue';
import { isUsernameUnique } from '../../../../services/auth';
import { useLoginUser } from '../../../Composables/useLoginUser';
const msg = ref('')
const { loginUser } = useLoginUser()
defineProps({
    disable: Boolean
})
const isValid = ref(false)
const isUsernameValid = ref(true)
const user = ref({
    email: '',
    password: '',
    userName: '',
    fullname: '',
})

async function usernameIsValid() {
    if (user.value.userName.length > 1) {

        isUsernameValid.value = await isUsernameUnique(user.value.userName)
    }
}
const loading = ref(false)
function passwordIsValid(e) {
    if (user.value.password.length >= 6) {
        isValid.value = true
    }
}
const msgBoolean = ref(false)

async function handleSubmit() {
    loading.value = true
    try {
        debugger
        await signUp({ ...user.value, userName:user.value.userName.trim().toLowerCase() })
        loading.value = false
        setTimeout(() => {
            router.get('/miPerfil');
        }, 2000);
    } catch (error) {
        msgBoolean.value = true

        if (error.code === 'auth/email-already-in-use') {
            msg.value = "El email ingresado ya se encuentra en uso."
        } else if (error.code === 'default') {
            msg.value = "Ha ocurrido un error inesperado. Por favor inténtelo de nuevo en unos minutos."

        }
    }
    setTimeout(() => {
        msg.value = '';
        msgBoolean.value = false

    }, 3000);
}
function closeModal() {
    msgBoolean.value = false
}
const passwordVisible = ref(false);
function showPassword() {
    passwordVisible.value = !passwordVisible.value
}
</script>
<template>
    <Transition name="fade" mode="out-in">
        <template v-if="loginUser.id">
            <div class="flex items-center justify-center min-h-screen bg-white">
                <img src="/public/images/ImagotipoEspesorFinalSinApilar.png" alt="Logo"
                    class="w-60 h-60 limited-pulse" />
            </div>
        </template>
    </Transition>
    <template v-if="!loginUser.id">

        <NavBarSecondary>
            <section class="skiptranslate">
                <div v-show="msgBoolean" id="boolean-error-msg-singup"
                    v-if="msg !== 'Su usuario se ha registrado correctamente' && msg !== ''"
                    class="shadow-[1px_1px_25px_-8px] mx-auto shadow-blue-1000 bg-red-200 p-4 m-2 rounded-md fixed  w-[100%] max-w-xl  top-[10%] flex items-center gap-2">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <p>{{ msg }}</p>
                    <button @click="closeModal" type="button"
                        class="ms-auto -mx-1.5 -my-1.5 text-gray-800  rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-400 inline-flex items-center justify-center h-8 w-8 "
                        data-dismiss-target="#boolean-error-msg-singup" aria-label="Cerrar">
                        <span class="sr-only">Cerrar</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>
                <div v-show="msgBoolean" v-if="msg == 'Su usuario se ha registrado correctamente'"
                    class=" shadow-[1px_1px_25px_-8px] mx-auto shadow-blue-1000 bg-green-200 p-4 m-2 fixed w-[100%] max-w-xl top-[10%]  rounded-md" id="boolean-success-msg-singup">
                    <p>{{ msg }}</p>
                    <button @click="closeModal" type="button"
                        class="ms-auto -mx-1.5 -my-1.5 text-gray-800 hover:bg-green-400 hover:bg-opacity-80 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 inline-flex items-center justify-center h-8 w-8 "
                        data-dismiss-target="#boolean-success-msg-singup" aria-label="Cerrar">
                        <span class="sr-only">Cerrar</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>
                <h1 class="text-center text-2xl mt-8 mb-6 font-medium ">Registrarme</h1>
                <div class="p-4">
                    <img src="/public/images/singup.svg" alt="Ilustración de registro" type="image/svg+xml">
                </div>
                <form action="#" @submit.prevent="handleSubmit" class="p-3">
                    <div class="mb-5">
                        <label for="email" class="block mb-2 ">Email</label>
                        <input type="email" id="email"
                            class=" p-2 mb-2 w-full border rounded-md  bg-slate-100 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            v-model="user.email" autocomplete="email" required placeholder="nombre@gmail.com">
                    </div>
                    <div class="mb-5">
                        <label for="fullname" class="block mb-2 ">Nombre completo</label>
                        <input type="text" id="fullname"
                            class=" p-2 mb-2 w-full border rounded-md  bg-slate-100 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            required v-model="user.fullname">
                    </div>
                    <div class="mb-5">
                        <label for="username" class="block mb-2 ">Nombre de usuario</label>
                        <input type="text" id="username"
                            class=" p-2 mb-2 w-full border rounded-md  bg-slate-100 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            v-model="user.userName" required placeholder="melina2" autocomplete="username"
                            @input="usernameIsValid">
                        <template v-if="user.userName.length >= 1">

                            <div v-if="!isUsernameValid" class="flex items-center mt-3 gap-1">
                                <div>

                                    <svg class="w-6 h-6 text-red-500 dark:text-white" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                        viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                                            d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                </div>
                                <p class="text-red-500">Este nombre de usuario está en uso. Elegí otro.
                                </p>

                            </div>
                            <div v-else class="flex items-center mt-3 gap-1">
                                <div>

                                    <svg class="w-6 h-6 text-green-600 dark:text-white" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                        viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984 1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984 1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0 1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z" />
                                    </svg>


                                </div>
                                <p class="text-green-600">Este nombre de está disponible.
                                </p>

                            </div>
                        </template>
                    </div>
                    <div class="mb-6">
                        <label for="password" class="block mb-2">Constraseña</label>
                        <div class="flex gap-1">

                            <input @input="passwordIsValid" id="password" :type="!passwordVisible ? 'password' : 'text'"
                                class=" p-2 w-full border rounded-md bg-slate-100 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                v-model="user.password" required placeholder="Contraseña" autocomplete="new-password" />

                            <button type="button" @click="showPassword" class="bg-blue-1000 rounded-lg">
                                <svg v-if="!passwordVisible" class="w-6 h-6 text-orange-0 fill-transparent "
                                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-width="1.5"
                                        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                    <path stroke="currentColor" stroke-width="1.5"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                <svg v-else class="w-6 h-6 text-orange-0 fill-transparent " aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                    viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5
                                    "
                                        d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>

                            </button>
                        </div>
                        <p v-if="!isValid" class="text-slate-500 mt-3">Su contraseña debe tener un mínimo de 6
                            caracteres.
                        </p>
                    </div>


                    <button :disabled="!isValid || !isUsernameValid" type="submit"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full notranslate"
                        :class="{ disable: !isValid || !isUsernameValid }">Crear cuenta</button>

                </form>
                
            </section>
        </NavBarSecondary>
        <div class="flex flex-col  items-center justify-center mb-28">
            <p class="mt-7">¿Ya tienes una cuenta?</p>
            <Link class="mt-2 text-blue-1000 font-medium " href="/ingresar">Ingresar</Link>
        </div>
    </template>
</template>
<style scoped>
@keyframes limited-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.limited-pulse {
  animation: limited-pulse 1s ease-in-out 1; /* Duración de 2s, 3 repeticiones */
}

/* Transiciones personalizadas */
.fade-enter-active,
.fade-leave-active {
    @apply transition-opacity duration-500;
}

.fade-enter-from,
.fade-leave-to {
    @apply opacity-0;
}
</style>