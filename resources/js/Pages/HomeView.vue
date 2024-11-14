<script setup>
import NavBar from '../components/NavBar.vue'
import PostUser from '../components/PostUser.vue'
import { onMounted, ref, onUnmounted } from 'vue';
import Spinner from '../Components/Spinner.vue'
import { readPosts } from '../../services/posts';
import { useLoginUser } from "../composables/useLoginUser";
const { loginUser } = useLoginUser()
const loading = ref(true)

const posts = ref([])

onMounted(async () => {

  if (loginUser.value) {
    readPosts(newPosts => {
      posts.value = newPosts;
      loading.value = false;
    }, loginUser.value.id);
  } else {
    loading.value = false;
  }

});

</script>
<template>
  <NavBar></NavBar>
  <section class="posts px-3">

    <PostUser v-for="post in posts" 
    :photoURL="post.photoURL"
    :id="post.id" :descriptionUser="post.text" :img="post.image" :imgAlt="post.image"
      :serie="post.serie" :date="post.date" :likes="post.likes" :comments="post.comments" :userName="post.user"
      :liked="post.liked" :userId="post.userid" :created_at="post.created_at">
    </PostUser>
    <div class="flex justify-center mt-80" v-if="loading">
      <Spinner msg="Cargando tu inicio"></Spinner>
    </div>
  </section>

</template>