<script setup>
import NavBar from '../components/NavBar.vue'
import DiscoverFeature from '../components/DiscoverFeature.vue'



import { onMounted, ref } from 'vue';
let serie = ref([]);

onMounted(async () => {
    try {
        const response = await fetch('https://api.tvmaze.com/search/shows?q=alll');
        const json = await response.json();
        console.log(json);
        serie.value = json 
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        
    }
})
defineProps({genres:Array})
</script>
<template>
    <NavBar></NavBar>
    <SearchComponent></SearchComponent>
    <section v-for="genre in [,,,]"  class="flex  flex-col ">
        <div>

            <p class="m-3 mt-4 ms-5 font-medium">Segun tus generos favoritos:</p>
        </div>
        <div  class="flex overflow-x-auto scroll overflow-scroll ">

            <DiscoverFeature class="" v-for="series in serie"
            :titleSerie="series.show.name"
            :dateSerie="series.show.premiered"
            :synopsis="series.show.summary"
            :cover="series.show.image"
            :text="series.show.schedule.time"
            >
            
        </DiscoverFeature>
    </div>
    </section>

</template>
