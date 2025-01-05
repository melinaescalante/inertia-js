<script setup>
import NavBar from '../components/NavBar.vue'
import PostUser from '../components/PostUser.vue'
import SwitcherHome from '../Components/SwitcherHome.vue';
import { onMounted, ref, onUnmounted } from 'vue';
import Spinner from '../Components/Spinner.vue'
import { fetchPosts, fetchPostsFrom } from '../../services/posts';
import { useLoginUser } from "../composables/useLoginUser";
import { Link } from '@inertiajs/vue3';
import { sortArrayFromLocalStorage } from '../../services/users';
const { loginUser } = useLoginUser()
const msgError = ref("")
const msgAlert = ref("")
const {
  loading: loadingPosts,
  posts,
  newPostLoaderSign,
  loadingMore: loadingMorePosts,
} = usePosts();
function usePosts() {
  const loading = ref(true);
  const posts = ref([]);
  const newPostLoaderSign = ref(null);
  const loadingMore = ref(false);
  let unsubscribe = () => { };
  // let unsubscribeFromAuth = () => { };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadMorePosts();
      }
    });
  });


  onMounted(async () => {
    try {

      await loadPosts(); // Pasar ids de las series.

      setIntersectionObserver();
    } catch (error) {
      return
    }
  });


  async function loadPosts() {
    try {
      let series = await sortArrayFromLocalStorage(loginUser.value.lastSeriesWatched||[], loginUser.value.seriesToWatch||[])
      console.log(loginUser.value.lastSeriesWatched, loginUser.value.seriesToWatch)
      unsubscribe = await fetchPosts(loginUser.value.id, series, (newPosts) => {
        posts.value = newPosts;
       
        if (!loginUser.value.lastSeriesWatched?.length && !loginUser.value.seriesToWatch?.length) {
          msgError.value = '¡Comienza a añadir series a ver o viendo, así podremos comenzar a generarte un para ti!'
          loading.value = false;
          return
        }
        if (newPosts.length === 0) {
          msgAlert.value = "¡Aún no hay posteos sobre tus gustos, sé el primero!"
        }
        loading.value = false;
      });
      //   fetchPosts(loginUser.value.id, (newPosts) => {
      //     posts.value = newPosts;
      //     loading.value = false;
      //   }).then(unssub => unsubscribe = unsub);
      //   unsubscribe = await fetchPostsFromUsers(followedUsersId, (newPosts) => {
      //     posts.value = newPosts;
      //     loading.value = false;
      //      orderPosts();
      //   });
    } catch (error) {
      console.log(error);
    }
  }
  function setIntersectionObserver() {

    observer.observe(newPostLoaderSign.value);
  }
  async function loadMorePosts() {
    if (loadingMore.value) return;
    loadingMore.value = true;


    try {
      let newPosts = []
      if (posts.value[posts.value.length - 1]?.created_at) {
        newPosts = await fetchPostsFrom(loginUser.value.lastSeriesWatched,
          posts.value[posts.value.length - 1]?.created_at,
        );

        if (newPosts.length === 0) {

          observer.unobserve(newPostLoaderSign.value);
          loadingMore.value = false
          return
        }
      }
      posts.value = [
        ...posts.value,
        ...newPosts,
      ]
      setIntersectionObserver();
    } catch (error) {
      // msgError.value = '¡Comienza a añadir series a ver o viendo, así podremos comenzar a generarte un para ti!'
      console.log('[Posts.vue] Error al cargar más posts', error);
    }

    loadingMore.value = false;

  }
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return {
    loading,
    loadingMore,
    posts,
    newPostLoaderSign,
  }
}


</script>
<template>
  <NavBar />
  <SwitcherHome></SwitcherHome>
  <section class="posts ">
    <div v-if="!loadingPosts">
      <div v-for="post in posts" :key="post.id">
        <PostUser :photoURL="post.photoURL" :id="post.id" :descriptionUser="post.text" :img="post.image"
          :imgAlt="post.image" :serie="post.serie" :idSerie="post.idSerie" :date="post.date" :likes="post.likes"
          :comments="post.comments" :userName="post.user" :liked="post.liked" :userId="post.userid"
          :created_at="post.created_at" />
      </div>
      <div v-if="msgError !== ''" class="mt-[50%]">
        <p class="text-center skiptranslate p-3">
          {{ msgError }}
        </p>
        <Link href="/buscador" class="block w-2/6 skiptranslate text-center mx-auto py-2 px-4 
        bg-opacity-50 rounded-full border-0 text-sm font-semibold bg-blue-0 text-blue-1000 hover:bg-blue-0">Iniciar
        búsqueda</Link>

      </div>
      <div v-if="msgAlert !== ''" class="mt-[50%] ">
        <p class="text-center skiptranslate p-3">
          {{ msgAlert }}
        </p>
        <Link href="/subirPublicacion" class="block w-2/6 skiptranslate text-center mx-auto py-2 px-4 
        bg-opacity-50 rounded-full border-0 text-sm font-semibold bg-blue-0 text-blue-1000 hover:bg-blue-0">Subir
        posteo</Link>
      </div>
    </div>
    <div v-else class="mt-[50%] p-3 skiptranslate">

      <Spinner msg="Cargando más posteos" />
    </div>

    <Spinner v-if="loadingMorePosts === true" msg="Cargando más posteos" />

    <div ref="newPostLoaderSign"></div>
  </section>
</template>
