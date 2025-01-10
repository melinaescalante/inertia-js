<script setup>
import { getUsername, allFollowing, getPhotoURL } from '../../../services/users';
import { Link, usePage } from '@inertiajs/vue3';
import NavBar from '../../components/NavBar.vue';
import { onMounted, ref } from 'vue';
import Spinner from '../../Components/Spinner.vue';
import { useLoginUser } from '../../Composables/useLoginUser';
import { getLikes, readPostsById } from '../../../services/posts';
const loading = ref(true)
const { loginUser } = useLoginUser()


const props = defineProps({
    id: String
})
const postLikes = ref([])

onMounted(async () => {
    if (loginUser.value.id) {
        try {
            // await readPostsById((posteo) => {
            //     post.value = posteo;
            //     loading.value = false;
            // },props.id, loginUser.value.id);
            postLikes.value = await getLikes((likes) => {
                postLikes.value = likes
                loading.value = false
            }, props.id)

        } catch (error) {
            console.error(error)
        }
    }

})

</script>
<template>
    <NavBar></NavBar>
    <section class="mt-20 skiptranslate">

        <h1 class="font-medium text-2xl m-2 mt-3 mb-2">Likes</h1>
        <div v-if="!loading" v-for="(like, index) in postLikes" :key="index"
            class="flex items-center gap-4  p-4  border-b-[1px]  border-blue-1000 ">
            <img class="w-10 h-10 rounded-full" :src="like.profilePhoto || '/noimage.png'"
                :alt="`Foto de perfil del usuario ${like.username}`">
            <div class="font-medium ">
                <div>

                    <Link :href="`/perfil/${like.userid}`">
                    {{ like.username }}</Link>
                </div>
            </div>

        </div>
        <div v-if="postLikes?.length == 0 && !loading" class="skiptranslate m-2">
            <p>Sin likes</p>
        </div>
        <div v-if="loading">

            <Spinner class="mx-auto" msg="Cargando likes"></Spinner>
        </div>
    </section>

</template>