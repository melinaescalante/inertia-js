<script setup>
import { ref } from 'vue';
import { Link, router } from '@inertiajs/vue3'
import { signUp } from '../../services/auth'
import NavBarSecondary from '../Components/NavBarSecondary.vue';

const msg = ref('')
defineProps({
    disable: Boolean
})
const isValid = ref(false)
const user = ref({
    email: '',
    password: '',
    userName:''
})
const loading = ref(false)
function passwordIsValid(e) {
    if (user.value.password.length >= 6) {
        isValid.value = true
        console.log(e)
    }
}
async function handleSubmit() {
    loading.value = true
    try {
        await signUp({ ...user.value })
        console.log("Usuario registrado")
        msg.value = "Su usuario se ha registrado correctamente"

        router.replace('/')
    } catch (error) {
        console.log( error)
        msg.value = "Su usuario no se ha registrado"
        //Manjera error e interfaz amigable
    }
}
</script>
<template>
    <NavBarSecondary>
            <h1 class="text-center text-2xl mt-8 mb-6 font-medium">Registrarme</h1>
            <div class="p-4">
                <img src="/public/images/singup.svg" alt="Ilustración de registro" type="image/svg+xml">
            </div>
            <form action="" @submit.prevent="handleSubmit" class="p-3">
                <div class="mb-5">
                    <label for="email" class="block mb-2 ">Email</label>
                    <input type="email" id="email" class=" p-2 mb-2 w-full border rounded-md  bg-slate-100 "
                        v-model="user.email" required placeholder="nombre@gmail.com">
                </div>
                <div class="mb-5">
                    <label for="username" class="block mb-2 ">Nombre de usuario</label>
                    <input type="text" id="username" class=" p-2 mb-2 w-full border rounded-md  bg-slate-100 "
                        v-model="user.userName" required placeholder="@melina2">
                </div>
                <div class="mb-6">
                    <label for="text" class="block mb-2">Constraseña</label>
                    <input @input="passwordIsValid" id="password" type="password"
                        class=" p-2 w-full border rounded-md bg-slate-100" v-model="user.password" required
                        placeholder="Contraseña" />
                    <p v-if="!isValid" class="text-slate-500 mt-3">Su contraseña debe tener un mínimo de 6 caracteres.
                    </p>
                </div>

                <button :disabled="!isValid" type="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full"
                    :class={disable:!isValid}>Crear cuenta</button>

            </form>
            <div v-if="msg !== 'Su usuario se ha registrado correctamente' && msg !== ''"
                class="bg-red-200 p-4 m-2 rounded-md">
                <p>{{ msg }}</p>
            </div>
            <div v-if="msg == 'Su usuario se ha registrado correctamente'" class="bg-green-200 p-4 m-2 rounded-md">
                <p>{{ msg }}</p>
            </div>
    </NavBarSecondary>
    <div class="flex flex-col  items-center justify-center">
        <p class="mt-7">¿Ya tienes una cuenta?</p>
        <Link class="mt-2 text-blue-600 font-medium " href="/ingresar">Ingresar</Link>
    </div>
</template>
<style>
.cls-1 {
    fill: #2f2e41;
}

.cls-2 {
    fill: #fff;
}

.cls-3 {
    fill: #ffb6b6;
}

.cls-4 {
    fill: #3f3d56;
}

.cls-5 {
    fill: #f2f2f2;
}

.cls-6 {
    fill: #ffb8b8;
}

.cls-7 {
    fill: #ccc;
}

.cls-8 {
    fill: #0054b9;
}

.cls-9 {
    fill: #170000;
}

.cls-10 {
    fill: #f1ff89;
}

.cls-11 {
    fill: #0d78d0;
}

.cls-12 {
    fill: #e6e6e6;
}
</style>