<script setup>
import NavBar from '../components/NavBar.vue'
import DiscoverFeature from '../components/DiscoverFeature.vue'
import Spinner from '../Components/Spinner.vue'
import { onMounted, ref } from 'vue';
import { useLoginUser } from '../composables/useLoginUser';

let serie = ref([]);
const { loginUser } = useLoginUser()
const loading = ref(true);
onMounted(async () => {
    try {
        if (loginUser.value.genres && loginUser.value.genres.length >= 1) {
            await loadSeriesByUsersGenres();
        } else {
            await loadSeriesByDefault();

        }

    } catch (error) {
        console.error('Error fetching posts:', error.message);
    }
});
async function loadSeriesByUsersGenres() {
    if (loginUser.value.genres !== undefined && loginUser.value.genres !== null) {
        let idShows = [];
        loginUser.value.genres.forEach(async (genre, index) => {
            genre = Object.keys(genre)[0]
            let genreArray = []
            const limit = 10
            const response = await fetch('https://api.tvmaze.com/shows');
            const shows = await response.json()

            // Agarras el length del array de shows y lo restas por el limite.
            // let num = shows.length - limit
            // Math.Random() entre 0 y num.
            // Se puede buscar si hay dos metodos que se llamen -> Skip y Take como en c#
            // Haciendo esto haria -> Skip (numeroRandom) y Take (limit) 
            // Obteniendo asi, los shows de una manera "Random"

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
        loading.value = false;

    }
}
let genresStaticCopy = []
async function loadSeriesByDefault() {
    let genresStatic = []
    let idShows = [];
    genresStatic = new Map
    genresStatic.set("Comedia", "Comedy");
    genresStatic.set("Romance", "Romance");
    genresStatic.set("Drama", "Drama");
    genresStaticCopy = Array.from(genresStatic.keys())
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
        loading.value = false

    });

}

defineProps({ genres: Array })
</script>
<template>
    <NavBar></NavBar>
<!-- 
    <div id="gt-mordadam-43217984" class="hidden">
        </div> -->
        <section id="discover-view" class="" v-if="!loading">


        <div v-for="(genero, key)  in serie" :key="key" class="flex  flex-col ">
            <div>

                <p class="m-3  mt-4 ms-5 font-medium">Según tus géneros favoritos: <span class="text-blue-1000">{{
                    loginUser.genres?.length ? Object.values(loginUser.genres[key])[0] : genresStaticCopy[key]
                }}</span></p>
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
