<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { readPostsById } from '../../services/posts';
import PostUser from '../Components/PostUser.vue';
import { useLoginUser } from '../composables/useLoginUser';
import Spinner from '../Components/Spinner.vue';
const { loginUser } = useLoginUser()
const page = usePage()
const id = ref(page.props.id)
const loading = ref(true)

const post = ref([])
onMounted(async () => {

    if (loginUser.value.id) {
        try {
            await readPostsById((posteo) => {
                post.value = posteo;
                loading.value = false;
            }, id.value, loginUser.value.id);

        } catch (error) {
            console.error(error)
        }
    }
})



</script>
<template>
    <NavBar></NavBar>

    <template v-if="loading">

        <div class="flex justify-center mt-80 skiptranslate">
            <Spinner msg="Cargando publicación"></Spinner>
        </div>
    </template>
    <template v-else>
        <section id="my-post">

            <PostUser :photoURL="post.photoURL" :id="post.id" :descriptionUser="post.text" :img="post.image"
                :imgAlt="post.image" :serie="post.serie" :idSerie="post.idSerie" :created_at="post.created_at"
                :likes="post.likes" :comments="post.comments" :userName="post.user" :liked="post.liked"
                :userId="post.userid"></PostUser>
        </section>
    </template>
</template>
