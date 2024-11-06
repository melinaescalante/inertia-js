<script setup>
import { Link } from '@inertiajs/vue3'

</script>
<template>
    <nav class="flex justify-between items-center p-4 bg-blue-200 text-slate-800">
        <Link href="/" class="text-xl">TVON</Link>

    </nav>
    <slot></slot>
    <div
        class="fixed z-50 w-full h-16 max-w-xl -translate-x-1/2 bg-blue-200 border border-gray-200  bottom-0 left-1/2  flex justify-between items-center p-4 text-slate-800">
    </div>
</template>