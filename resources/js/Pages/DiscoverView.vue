<script setup>
import NavBar from '../components/NavBar.vue'
import DiscoverFeature from '../components/DiscoverFeature.vue'
import { login, suscribeToAuthChanged } from "../../services/auth";
import Spinner from '../Components/Spinner.vue'
import { onMounted, onUnmounted, ref } from 'vue';
let serie = ref([]);
const loginUser = ref({
    id: null,
    email: null,
    displayName: null,
    bio: null,
    genres: null

})
const loading = ref(true);

let unSubscribeFromAuth = () => { };
onMounted(async () => {
    try {

        unSubscribeFromAuth = await suscribeToAuthChanged(async newUserData => {
            loginUser.value = newUserData
            serie.value = [];
            loginUser.value.genres ? await loadSeriesByUsersGenres() : await loadSeriesByDefault
        })
    } catch (error) {
        console.error('Error fetching posts:', error.message);

    }
})
async function loadSeriesByUsersGenres() {
    if (loginUser.value.genres !== undefined && loginUser.value.genres !== null) {
        let idShows = [];

        loginUser.value.genres.forEach(async (genre) => {
            let genreArray = []
            const limit = 10
            const response = await fetch('https://api.tvmaze.com/shows');
            const shows = await response.json()
            shows.forEach(show => {
                console.log(show.genres.includes(genre))
                if (genreArray.length < limit) {
                    if (show.genres.includes(genre) && !(idShows[show.id])) {
                        console.log(show)
                        idShows.push(show.id);
                        idShows[show.id] = show.id
                        genreArray.push(show);
                    }
                }
            });

            serie.value.push(genreArray)
        });
        loading.value = true
    }
}
async function loadSeriesByDefault() {
    let idShows = [];

    let genresStatic = new Map
    genresStatic.set("Comedia", "Comedy");
    genresStatic.set("Romance", "Romance");
    genresStatic.set("Drama", "Drama");

    console.log(loginUser.value.genres, genresStatic, 'generos')
    if (loginUser.value.genres.length === 0) {
        genresStatic.forEach(async (genre) => {
            let genreArray = []
            const limit = 10
            const response = await fetch('https://api.tvmaze.com/shows');
            const shows = await response.json();
            shows.forEach(show => {
                if (genreArray.length < limit) {
                    if (show.genres.includes(genre) && !(idShows[show.id])) {
                        idShows.push(show.id);
                        idShows[show.id] = show.id
                        genreArray.push(show);
                    }
                }
            });
            serie.value.push(genreArray)

        });
        loading.value = true

    }
}
onUnmounted(() => {
    unSubscribeFromAuth();
})
defineProps({ genres: Array })
</script>
<template>
    <NavBar></NavBar>
    {{ console.log(loading.value) }}
    <section v-if="loading">

        <div v-for="genero in serie" class="flex  flex-col ">
            <div>

                <p class="m-3 mt-4 ms-5 font-medium">Segun tus generos favoritos:</p>
            </div>
            <div class="flex overflow-x-auto scroll overflow-scroll ">

                <DiscoverFeature v-for="show in genero" :id="show.id" :genres="show.genres" :titleSerie="show.name"
                    :dateSerie="show.premiered" :synopsis="show.summary" :cover="show.image" :text="show.schedule.time">

                </DiscoverFeature>
            </div>
        </div>
    </section>
    <Spinner v-else></Spinner>
</template>
