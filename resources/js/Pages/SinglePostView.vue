<script setup>
import NavBar from '../components/NavBar.vue'
import { Link } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { suscribeToAuthChanged, logout } from "../../services/auth";
import { readPostsById } from '../../services/posts';
import PostUser from '../Components/PostUser.vue';
const page = usePage()
const id = ref(page.props.id)
console.log(id.value)
const post = ref([])
onMounted(async () => {
    post.value = await readPostsById(id.value)
    console.log(post.value)
})

</script>
<template>
    <NavBar></NavBar>
    <PostUser :id="post.id" :descriptionUser="post.text" :img="post.image" :imgAlt="post.image" :serie="post.serie"
        :date="post.date" :likes="post.likes" :comments="post.comments" :userName="post.user"></PostUser>
</template>
