<script setup>
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