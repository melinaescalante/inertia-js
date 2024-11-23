<script setup>
import NavBar from '../components/NavBar.vue'
import PostUser from '../components/PostUser.vue'
import { onMounted, ref, onUnmounted } from 'vue';
import Spinner from '../Components/Spinner.vue'
import {  fetchPosts, fetchPostsFrom } from '../../services/posts';
import { useLoginUser } from "../composables/useLoginUser";
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
      await loadPosts();
      setIntersectionObserver();
    } catch (error) {
      console.error(error);
    }
  });


  async function loadPosts() {
    try {
      unsubscribe = await fetchPosts(loginUser.value.id, (newPosts) => {
        posts.value = newPosts;
        loading.value = false;
      });
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
        newPosts = await fetchPostsFrom(
          posts.value[posts.value.length - 1]?.created_at,
        );

        if (newPosts.length === 0) {
  
          observer.unobserve(newPostLoaderSign.value);
          loadingMore.value=false
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
  <button type="button" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
            <svg class="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
            </svg>
            <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Profile</span>
        </button>
  <section class="posts">
    <div v-if="!loadingPosts">
      <div v-for="post in posts" :key="post.id">
        <PostUser :photoURL="post.photoURL" :id="post.id" :descriptionUser="post.text" :img="post.image"
          :imgAlt="post.image" :serie="post.serie"  :idSerie="post.idSerie"  :date="post.date" :likes="post.likes" :comments="post.comments"
          :userName="post.user" :liked="post.liked" :userId="post.userid" :created_at="post.created_at" />
      </div>
    </div>
<div v-else class="mt-[70%]">

  <Spinner msg="Cargando más posteos" />
</div>

    <Spinner v-if="loadingMorePosts===true" msg="Cargando más posteos" />
    <div ref="newPostLoaderSign"></div>
  </section>
</template>
