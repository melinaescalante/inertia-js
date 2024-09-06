<script setup>
import NavBar from '../components/NavBar.vue'
import DiscoverFeature from '../components/DiscoverFeature.vue'
import SearchComponent from '../Components/SearchComponent.vue';


import { onMounted, ref } from 'vue';
let serie = ref([]);

// onMounted(async () => {
//     try {
//         const response = await fetch('https://api.tvmaze.com/search/shows?q=all');
//         const json = await response.json();
//         console.log(json);
//         serie.value = json
//         console.log(serie.value);
//         for (const se of serie.value) {
//             console.log(se.show)
//         }
//     } catch (error) {
//         console.error('Error fetching posts:', error.message);
        
//     }
// })
</script>
<template>
    <NavBar></NavBar>
    <SearchComponent></SearchComponent>
    <DiscoverFeature v-for="series in serie"
    :titleSerie="series.show.name"
    :dateSerie="series.show.premiered"
    :synopsis="series.show.summary"
    :cover="series.show.image"
    :text="series.show.schedule.time"
    >

        </DiscoverFeature>

</template>
