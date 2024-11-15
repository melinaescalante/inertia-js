<script setup>
import { Link } from '@inertiajs/vue3'

</script>
<template>
    <nav class="flex gap-4 items-center p-4 border rounded-full border-blue-200 text-slate-800">
        <Link href="/" class="text-xl"><img src="/public/Isotipo-TVON.svg" type="image/svg+xml" alt="Isotipo-TVON" class="block h-8 w-8"></Link>
        <Link href="/" class="text-xl"><span>TV</span><span>ON</span> </Link>

    </nav>
    <slot></slot>
    <div
        class="fixed z-50 w-full h-16 max-w-xl -translate-x-1/2 border rounded-md border-blue-200    bottom-0 left-1/2  flex justify-between items-center p-4 text-slate-800">
    </div>
</template>