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
   
    <SearchComponent :series="series"></SearchComponent>

</template>