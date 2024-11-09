<script setup>
import { Link } from '@inertiajs/vue3';
import NavBar from '../components/NavBar.vue'
import SearchComponent from '../Components/SearchComponent.vue';
defineProps({
    series: Array  
})
</script>
<template>
    <NavBar></NavBar>
    <!-- <div class="flex gap-4 flex-wrap justify-center">
        <Link href="/buscador" class="border  rounded-lg border-blue-500 px-2 py-1">Series</Link>
        <Link href="/buscadorUsuarios" class="border rounded-lg border-blue-500 px-2 py-1">Personas</Link>
    </div> -->
    <SearchComponent :series="series"></SearchComponent>

</template>