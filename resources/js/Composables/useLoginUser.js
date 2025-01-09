import { onMounted, onUnmounted, ref } from "vue";
import { getLastSeriesWatched, allFollowing, getLastSeriesToWatch, getLastPeopleFollowed } from "../../services/users";
import { login, suscribeToAuthChanged } from "../../services/auth";
let latestSeriesIds = ref([]);

export function useLoginUser() {
  // debugger
  let isReady = ref(false);
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

  async function getLatestSeriesIds() {
    try {
      const series = await getLastSeriesWatched(loginUser.value.id);

      if (series?.length > 0) {
        latestSeriesIds.value = series;
        loginUser.value.lastSeriesWatched = series;
      }
    } catch (error) {
      console.error('Error al obtener las últimas series vistas:', error);
    }
    // Llamada en segundo plano para obtener las series
    // getLastSeriesWatched(loginUser.value.id).then((series) => {
    //   if (series?.length > 0) {
    //     latestSeriesIds.value = series;
    //     loginUser.value.lastSeriesWatched = series
    //   }
    // });

    // getLastSeriesWatched(loginUser.value.id)
    // Si ya tenemos cacheadas las series, retornamos esas.

    // Sort de las series.
    // Limitás cuáles querés (por ejemplo por cantidad y/o una fecha límite como últimos 5 meses).
    // Cachear las series en latestSeriesIds.
    // Retornás esas series.
  }
  async function getFollowedPeople() {
    const following = await getLastPeopleFollowed(loginUser.value.id);
    // getLastPeopleFollowed(loginUser.value.id).then((following) => {
    //   if (following?.length > 0) {
    loginUser.value.following = following

    //   }
    // })
  }
  async function getSeriesToWatch() {

    try {
      const series = await getLastSeriesToWatch(loginUser.value.id);

      if (series?.length > 0) {
        loginUser.value.seriesToWatch = series;
        console.log('estoy en el if: ', series);
      }

      console.log('afuera del if');
    } catch (error) {
      console.error('Error al obtener las series:', error);
    }
  }
  // async function getSeriesToWatch() {

  //   getLastSeriesToWatch(loginUser.value.id).then((series) => {
  //     if (series?.length > 0) {
  //       loginUser.value.seriesToWatch = series
  //       console.log('estoy en el if: ', series)

  //     }
  //     console.log('afuera del if ')

  //   });
  //   console.log('series: ', loginUser.value.seriesToWatch)
  // }

  onMounted(async () => {

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
        await getLatestSeriesIds();
      }
      if (cachedToWatchSeries) {
        loginUser.value.seriesToWatch = JSON.parse(cachedToWatchSeries)

      } else {
        await getSeriesToWatch();
      }
      if (cachedFollowing) {
        loginUser.value.following = JSON.parse(cachedFollowing)

      } else {
        await getFollowedPeople();
      }
      isReady.value = true
    }
  })
  onUnmounted(() => {
    unsubscribeFromAuth();
  })

  return {
    loginUser, isReady
  }
}
