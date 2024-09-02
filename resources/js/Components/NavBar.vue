
<script setup>
import { Link } from '@inertiajs/vue3'
</script>
<template>
    <nav class="flex justify-between items-center p-4 bg-slate-200 text-slate-800">
        <Link to="/" class="text-xl">Red Social</Link>

        <ul class="flex gap-4 items-center">
            <li><Link class="block py-1 px-2" href="/">Home</Link></li>
            <li><Link class="block py-1 px-2" href="/chat">Chat</Link></li>
            <li><Link class="block py-1 px-2" href="/descubrir">Descubrir</Link></li>
            <li><Link class="block py-1 px-2" href="/perfil">Perfil</Link></li>
        </ul>
    </nav>
</template>