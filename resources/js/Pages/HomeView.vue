<script setup>
import NavBar from '../components/NavBar.vue'
import PostUser from '../components/PostUser.vue'
import { onMounted, ref } from 'vue';
import { readPosts } from '../../services/posts';
const posts = ref([])
onMounted(async () => {
  readPosts(newPosts => posts.value = newPosts)
  {{ console.log(posts.value) }}
})

</script>
<template>
  <NavBar></NavBar>
  <h1 class="text-2xl m-4">Pagina de posteos</h1>
  <section class="posts px-3">

    <PostUser v-for="post in posts"
    :id="post.id"    :descriptionUser="post.text"
    :img="post.image"
    :imgAlt="post.image"
    :serie="post.serie"
    :date="post.date"
    :likes="post.likes"
    :comments="post.comments"
    :userName="post.user"
    ></PostUser>
  </section>

</template>