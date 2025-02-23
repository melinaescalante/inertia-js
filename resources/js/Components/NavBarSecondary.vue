<script setup>
import { Link } from '@inertiajs/vue3'
import ButtonGoBack from './ButtonGoBack.vue';
import { usePage } from '@inertiajs/vue3';
import { useLoginUser } from '../composables/useLoginUser';
const page = usePage()
const { loginUser } = useLoginUser()
const currentPage = page.component
</script>
<template>
    <div class="my-component">

        <nav class="flex gap-4 items-center p-4 py-2 ps-5 border rounded-lg border-blue-200 text-slate-800 ">
            <ButtonGoBack v-if="loginUser.id"></ButtonGoBack>
            <Link href="/" class="text-xl">
            <!-- <img src="/public/images/ImagotipoEspesorFinalApilado.png" alt="Isotipo-TVON"
                class="block h-auto w-16"> -->
            <svg class="block h-auto w-16" xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1"
                viewBox="0 0 118.16 85.2">

                <path class="cls-5"
                    d="M57.16,40.79c-.01.16-.02.33-.02.49s.01.33.02.49v31.04c0,2.23-1.81,4.03-4.04,4.03-.55,0-1.09-.11-1.57-.32-.03-.01-.06-.02-.08-.04l-.73-.42h-.01l-22.15-12.81,2.06-1.19.67-.39c1.24-.86,2.05-2.29,2.05-3.92s-.83-3.1-2.1-3.95l-.02-.02c-.14-.09-.29-.18-.44-.25l-.03-.02-2.19-1.26,19.03-11,9.55-5.52v5.06Z" />
                <path class="cls-4"
                    d="M33.36,57.75c0,1.63-.81,3.06-2.05,3.92l-.67.39-2.06,1.19h-.01l-22.17,12.82s-.01.02-.02.01l-.69.4s-.05.03-.08.04c-.48.21-1.02.32-1.57.32-2.23,0-4.04-1.81-4.04-4.04v-25.99l9.59-5.54,18.98,10.98h.01l2.19,1.26.03.02.15.09.29.16.02.02c1.27.85,2.1,2.31,2.1,3.95Z" />
                <path class="cls-4"
                    d="M57.16,9.73v26l-9.55,5.52-19-10.98,1.97-1.13.84-.49c1.19-.86,1.97-2.27,1.97-3.85s-.83-3.08-2.09-3.94l-.5-.29-2.26-1.3,22.31-12.89c.13-.09.27-.17.41-.24.56-.29,1.18-.45,1.85-.45,2.23,0,4.05,1.81,4.05,4.04Z" />
                <path class="cls-5"
                    d="M33.39,24.8c0,1.58-.78,2.99-1.97,3.85l-.84.49-1.97,1.13-19.02,11L0,46.81V9.75c0-2.23,1.8-4.03,4.03-4.03.69,0,1.35.18,1.92.49l22.59,13.06,2.26,1.3.5.29c1.26.86,2.09,2.3,2.09,3.94Z" />
                <text class="cls-2" transform="translate(65.35 31.55)">
                    <tspan class="cls-1">
                        <tspan x="0" y="0">TV</tspan>
                    </tspan>
                    <tspan class="cls-3">
                        <tspan x="0" y="44.64">ON</tspan>
                    </tspan>
                </text>

            </svg>
            </Link>
        </nav>
        <slot></slot>
        <div v-if="currentPage != 'Profile/ChatPrivateView'" class="fixed z-50 w-full h-16 max-w-2xl -translate-x-1/2 border rounded-md border-blue-200    bottom-0 left-1/2  flex justify-between items-center p-4 bg-white
        
        text-slate-800">
        </div>
    </div>
</template>
<style>
#Capa_1, .cls-1{
    filter: drop-shadow(0px 1px 3px white);
}
.cls-1 {
    fill: #1e1e1c;
    font-family: Fredoka-Light, Fredoka;
    font-weight: 400;
}

.cls-2 {
    font-size: 37.11px;
}

.cls-3 {
    font-family: Fredoka-Medium, Fredoka;
    font-weight: 600;
}

.cls-3,
.cls-4 {
    fill: #003399;
}

.cls-5 {
    fill: #f49739;
}

</style>
