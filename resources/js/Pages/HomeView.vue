<script setup>
import NavBar from '../components/NavBar.vue'
import PostUser from '../components/PostUser.vue'
import SwitcherHome from '../Components/SwitcherHome.vue';
import { onMounted, ref, onUnmounted } from 'vue';
import Spinner from '../Components/Spinner.vue'
import { fetchPosts, fetchPostsFrom } from '../../services/posts';
import { useLoginUser } from "../composables/useLoginUser";
import { login } from '../../services/auth';
const { loginUser } = useLoginUser()

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
  let unsubscribe = null;

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
      console.error(error);
    }
  });


  async function loadPosts() {
    try {
      unsubscribe = await fetchPosts(loginUser.value.id, loginUser.value.lastSeriesWatched, (newPosts) => {
        posts.value = newPosts;
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
      console.error('[Posts.vue] Error al cargar más posts', error);
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
  <section class="posts skiptranslate">
    <div v-if="!loadingPosts">
      <div v-for="post in posts" :key="post.id">
        <PostUser :photoURL="post.photoURL" :id="post.id" :descriptionUser="post.text" :img="post.image"
          :imgAlt="post.image" :serie="post.serie" :idSerie="post.idSerie" :date="post.date" :likes="post.likes"
          :comments="post.comments" :userName="post.user" :liked="post.liked" :userId="post.userid"
          :created_at="post.created_at" />
      </div>
    </div>
    <div v-else class="mt-[70%]">

      <Spinner msg="Cargando más posteos" />
    </div>

    <Spinner v-if="loadingMorePosts === true" msg="Cargando más posteos" />
    <div ref="newPostLoaderSign"></div>
  </section>
</template>
