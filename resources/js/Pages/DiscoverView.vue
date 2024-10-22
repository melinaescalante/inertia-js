<script setup>
import NavBar from '../components/NavBar.vue'
import DiscoverFeature from '../components/DiscoverFeature.vue'
import {  suscribeToAuthChanged } from "../../services/auth";

import { onMounted, onUnmounted,ref } from 'vue';
let serie = ref([]);
const loginUser = ref({
    id: null,
    email: null,
    displayName: null,
    bio: null,
    genres: null
    
})

let unSubscribeFromAuth = () => {};
onMounted(async () => {
    try {
    serie.value=[];

        unSubscribeFromAuth=await suscribeToAuthChanged(newUserData => {
            loginUser.value = newUserData
            let idShows = [];
            let genresStatic= new Map
            genresStatic.set("Comedia", "Comedy");
            genresStatic.set("Romance", "Romance");
            genresStatic.set("Drama", "Drama");
      
            if (loginUser.value.genres!==undefined) {
                
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
                });
            }else{
                genresStatic.forEach(async (genre) => {
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
      
                });
            }
        })
    } catch (error) {
        console.error('Error fetching posts:', error.message);

    }
})
onUnmounted(()=>{
     unSubscribeFromAuth();
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
<!-- :genre=show.namee -->
            <DiscoverFeature  v-for="show in genero"
            :id="show.id"
            :genres="show.genres"
            :titleSerie="show.name" :dateSerie="show.premiered"
                :synopsis="show.summary" :cover="show.image" :text="show.schedule.time">

            </DiscoverFeature>
        </div>
    </section>

</template>
