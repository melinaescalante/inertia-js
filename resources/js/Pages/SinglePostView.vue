<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { suscribeToAuthChanged } from "../../services/auth";
import { readPostsById } from '../../services/posts';
import PostUser from '../Components/PostUser.vue';

import Spinner from '../Components/Spinner.vue';
let unSubscribeFromAuth = () => {};

const page = usePage()
const id = ref(page.props.id)
const loading = ref(true)
const loginUser = ref({
    id: null,
    email: null,
    displayName: null,
    bio: null,
    genres: null

})
const post = ref([])
onMounted(async () => {
    unSubscribeFromAuth=suscribeToAuthChanged(async (newUserData) => {
        loginUser.value = newUserData
        if (loginUser.value.id) {
            try {
                await readPostsById((posteo) => {
                    post.value = posteo; 
                    loading.value = false;
                    console.log(post.value);
                }, id.value, loginUser.value.id);
          
            } catch (error) {
                console.error(error)
            }
        }
    })

})
onUnmounted( ()=>{
  unSubscribeFromAuth();

})
</script>
<template>
    <NavBar></NavBar>
    <template v-if="loading">

        <div class="flex justify-center mt-80">
            <Spinner msg="Cargando publicación"></Spinner>
        </div>
    </template>
    <template v-else>
        <div class="ms-2 mt-1">

            <ButtonGoBack></ButtonGoBack>
        </div>

        <PostUser :id="post.id" :descriptionUser="post.text" :img="post.image" :imgAlt="post.image" :serie="post.serie"
            :date="post.date" :likes="post.likes" :comments="post.comments" :userName="post.user" :liked="post.liked"
            :userId="post.userid"></PostUser>
    </template>
</template>
