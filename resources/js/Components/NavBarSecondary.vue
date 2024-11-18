<script setup>
import { Link } from '@inertiajs/vue3'
import ButtonGoBack from './ButtonGoBack.vue';

</script>
<template>
    <nav class="flex gap-4 items-center p-4 py-2 ps-5 border rounded-lg border-blue-200 text-slate-800">
        <ButtonGoBack></ButtonGoBack>
        <Link href="/" class="text-xl"><img src="/public/images/ImagotipoEspesorApilado.svg" type="image/svg+xml" alt="Isotipo-TVON" class="block h-16 w-16"></Link>
    </nav>
    <slot></slot>
    <div
        class="fixed z-50 w-full h-16 max-w-xl -translate-x-1/2 border rounded-md border-blue-200    bottom-0 left-1/2  flex justify-between items-center p-4 bg-white
        
        text-slate-800">
    </div>
</template>