import { ref, onMounted } from "vue";
import { getUsersProfileById } from "../../services/users";

let latestSeriesIds = [];

export function useUser(id, email, displayName) {
    const user = ref({
        id: null,
        email: null,
        displayName: null,
        username:null,
        bio: null,
        genres: null,
        photoURL: null,
        seriesLoaded: false,
        series: [],
    });

    const loadUserProfile = async () => {
        user.value = await getUsersProfileById(id, email, displayName);

        // Cargar los "watching" sin un await.
        // getWatchingForUser(user.value.id)
        //     .then(series => {
        //         user.value.series = series;
        //         user.value.seriesLoaded = true;
        //         // Guardar en localStorage o IDB.
        //     });

        return user.value
    };

    function getLatestSeriesIds() {
        // Si ya tenemos cacheadas las series, retornamos esas.

        // Sort de las series.
        // Limitás cuáles querés (por ejemplo por cantidad y/o una fecha límite como últimos 5 meses).
        // Cachear las series en latestSeriesIds.
        // Retornás esas series.
    }

    onMounted(() => {
        loadUserProfile();
    });

    return { user };
    return { user, getLatestSeriesIds };
}
