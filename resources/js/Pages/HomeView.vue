<script setup>
import NavBar from '../components/NavBar.vue'
import PostUser from '../components/PostUser.vue'
import { onMounted, ref, onUnmounted } from 'vue';
import { suscribeToAuthChanged } from "../../services/auth";
import Spinner  from '../Components/Spinner.vue'

import { readPosts } from '../../services/posts';
let unSubscribeFromAuth = () => {};
const loading=ref(true)

const posts = ref([])
const loginUser = ref({
  id: null,
  email: null,
  displayName: null,
  bio: null,
  genres: null

})
onMounted( async () => {
  unSubscribeFromAuth=suscribeToAuthChanged(newUserData => {
    if (newUserData) {
      loginUser.value = newUserData;
      readPosts(newPosts => {
        posts.value = newPosts;
        loading.value = false; 
      }, loginUser.value.id);
    } else {
      loading.value = false; 
    }
  });
});
onUnmounted( ()=>{
  unSubscribeFromAuth();

})
</script>
<template>
  <NavBar></NavBar>
  <section class="posts px-3">

    <PostUser v-for="post in posts" 
    :id="post.id" 
    :descriptionUser="post.text" 
    :img="post.image" 
    :imgAlt="post.image"
    :serie="post.serie" 
    :date="post.date" 
    :likes="post.likes" 
    :comments="post.comments" 
    :userName="post.user"
    :liked="post.liked" 
    :userId="post.userid"
    :created_at="post.created_at">
    </PostUser>
    <div class="flex justify-center mt-80" v-if="loading">
      <Spinner msg="Cargando tu inicio"></Spinner>
    </div>
  </section>

</template>