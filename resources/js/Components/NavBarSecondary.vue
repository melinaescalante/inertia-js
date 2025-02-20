<script setup>
import { Link } from '@inertiajs/vue3'
import ButtonGoBack from './ButtonGoBack.vue';
import { usePage } from '@inertiajs/vue3';
import { useLoginUser } from '../composables/useLoginUser';
const page = usePage()
const {loginUser}=useLoginUser()
const currentPage = page.component
</script>
<template>
    <div class="my-component">

        <nav class="flex gap-4 items-center p-4 py-2 ps-5 border rounded-lg border-blue-200 text-slate-800 ">
            <ButtonGoBack v-if="loginUser.id"></ButtonGoBack>
            <Link href="/" class="text-xl"><img src="/public/images/ImagotipoEspesorFinalApilado.png" alt="Isotipo-TVON"
                class="block h-auto w-16"></Link>
        </nav>
        <slot></slot>
        <div v-if="currentPage != 'Profile/ChatPrivateView'" class="fixed z-50 w-full h-16 max-w-2xl -translate-x-1/2 border rounded-md border-blue-200    bottom-0 left-1/2  flex justify-between items-center p-4 bg-white
        
        text-slate-800">
        </div>
    </div>
</template>
