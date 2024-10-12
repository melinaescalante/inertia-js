<script setup>
import NavBar from '../components/NavBar.vue'
import DiscoverFeature from '../components/DiscoverFeature.vue'
import { suscribeToAuthChanged } from "../../services/auth";

import { onMounted, ref } from 'vue';
let serie = ref([]);
const loginUser = ref({
    id: null,
    email: null,
    displayName: null,
    bio: null,
    genres: null

})
onMounted(async () => {
    try {
        await suscribeToAuthChanged(newUserData => {
            loginUser.value = newUserData
            let idShows = [];
            loginUser.value.genres.forEach(async (genre) => {
                let genreArray = []
                const limit = 10
                const response = await fetch('https://api.tvmaze.com/shows');
               
                const shows = await response.json();
                shows.forEach(show => {
                    if (genreArray.length < limit) {
                        if (show.genres.includes(genre) && !(idShows[show.id])) {
                            idShows.push(show.id);
                            idShows[show.id]=show.id
                            genreArray.push(show);
                        }
                    }
                });
                serie.value.push(genreArray)
                console.log(serie.value);
            });
        })
    } catch (error) {
        console.error('Error fetching posts:', error.message);

    }
})
defineProps({ genres: Array })
</script>
<template>
    <NavBar></NavBar>
    <SearchComponent></SearchComponent>
    <section v-for="genero in serie" class="flex  flex-col ">
        <div>

            <p class="m-3 mt-4 ms-5 font-medium">Segun tus generos favoritos:</p>
        </div>
        <div class="flex overflow-x-auto scroll overflow-scroll ">

            <DiscoverFeature class="" v-for="show in genero" :titleSerie="show.name" :dateSerie="show.premiered"
                :synopsis="show.summary" :cover="show.image" :text="show.schedule.time">

            </DiscoverFeature>
        </div>
    </section>

</template>
