import { onMounted, onUnmounted, ref } from "vue";
import { getLastSeriesWatched, allFollowing, getLastSeriesToWatch } from "../../services/users";
import { suscribeToAuthChanged } from "../../services/auth";
let latestSeriesIds = ref([]);
export function useLoginUser() {
  let unsubscribeFromAuth = () => { };
  const loginUser = ref({
    id: null,
    email: null,
    displayName: null,
    username: null,
    bio: null,
    genres: null,
    photoURL: null,
    lastSeriesWatched: null,
    seriesToWatch: null,
    following: null,
  });
  function getLatestSeriesIds() {
    // Llamada en segundo plano para obtener las series
    getLastSeriesWatched(loginUser.value.id).then((series) => {
      if (series.length > 0) {
        latestSeriesIds.value = series;
        loginUser.value.lastSeriesWatched = series
      }
    });

    // getLastSeriesWatched(loginUser.value.id)
    // Si ya tenemos cacheadas las series, retornamos esas.

    // Sort de las series.
    // Limitás cuáles querés (por ejemplo por cantidad y/o una fecha límite como últimos 5 meses).
    // Cachear las series en latestSeriesIds.
    // Retornás esas series.
  }
  function getFollowedPeople() {
    allFollowing(loginUser.value.id).then((following) => {
      if (following.length > 0) {
        loginUser.value.following = following

      }
    })
  }
  function getSeriesToWatch() {
    getLastSeriesToWatch(loginUser.value.id).then((series) => {
      if (series.length > 0) {
        loginUser.value.seriesToWatch = series
      }
    });
  }

  onMounted(() => {
    unsubscribeFromAuth = suscribeToAuthChanged(newUserData => loginUser.value = newUserData)
    if (loginUser.value.id) {
      const cachedSeries = localStorage.getItem("ids_series_watching");
      const cachedToWatchSeries = localStorage.getItem("ids_series_wishlist");
      const cachedFollowing = localStorage.getItem("people");

      if (cachedSeries) {
        // Si ya hay datos cacheados, los usamos
        loginUser.value.lastSeriesWatched = JSON.parse(cachedSeries)

        latestSeriesIds.value = JSON.parse(cachedSeries);
      } else {
        // Si no hay datos cacheados, los obtenemos en segundo plano
        getLatestSeriesIds();
      }
      if (cachedToWatchSeries) {
        loginUser.value.seriesToWatch = JSON.parse(cachedToWatchSeries)

      } else {
        getSeriesToWatch();
      }
      if (cachedFollowing) {
        loginUser.value.following = JSON.parse(cachedFollowing)
        
      } else {
        getFollowedPeople();
      }
    }
  })
  onUnmounted(() => {
    unsubscribeFromAuth();
  })

  return {
    loginUser
  }
}
export function getFollowedPeople() {
  allFollowing(loginUser.value.id).then((following) => {
    if (following.length > 0) {
      loginUser.value.following = following

    }
  })
}
