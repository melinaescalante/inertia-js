<script setup>
import NavBar from '../components/NavBar.vue'
</script>
<template>
<NavBar></NavBar>
<!-- <SearchComponent></SearchComponent> -->
<p class="text-xl m-4">Oops, no tienes ni una serie empezada!</p>
<div class="flex flex-col gap-3 m-4">

     <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Empezar nueva serie</button>
     <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Agregar serie a wishlist</button>
    </div>
</template>
