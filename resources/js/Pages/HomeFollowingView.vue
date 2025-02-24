<script setup>
import NavBar from '../components/NavBar.vue';
import SwitcherHome from '../Components/SwitcherHome.vue';
import PostUser from '../components/PostUser.vue'
import { onMounted, ref, onUnmounted } from 'vue';
import Spinner from '../Components/Spinner.vue'
import { fetchPostsFollowed, fetchPostsFollowedFrom, } from '../../services/posts';
import { useLoginUser } from "../composables/useLoginUser";
import { Link } from '@inertiajs/vue3';
const { loginUser, isReady } = useLoginUser()
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
          
            while (!isReady.value) {
                await new Promise((resolve) => setTimeout(resolve, 10)); // Esperar activamente
            }
            await loadPosts(); // Pasar ids de las series.
            setIntersectionObserver();
        } catch (error) {
            console.error(error);
        }
    });


    async function loadPosts() {
        try {
            unsubscribe = await fetchPostsFollowed(loginUser.value.id, loginUser.value.following, (newPosts) => {
                posts.value = newPosts;
                if (newPosts.length === 0) {
                    msgAlert.value = "¡Las personas que seguís aún no tienen publicaciones!"
                }
                loading.value = false;
            });

        } catch (error) {
            loading.value = false;

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
                newPosts = await fetchPostsFollowedFrom(loginUser.value.following,
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
            msgError.value = `¡Comenzá a <strong class='font-[500]'>seguir</strong> gente y descubrí sus gustos!`
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
    <SwitcherHome v-if="loginUser.id" class="mt-[4.3rem]"></SwitcherHome>

    <section class="posts  mb-28 mt-4">
        <div v-if="!loadingPosts">
            <div v-for="post in posts" :key="post.id">
                <PostUser :photoURL="post.photoURL" :id="post.id" :descriptionUser="post.text" :img="post.image"
                    :imgAlt="post.image" :serie="post.serie" :idSerie="post.idSerie" :date="post.date"
                    :likes="post.likes" :comments="post.comments" :userName="post.user" :liked="post.liked"
                    :userId="post.userid" :created_at="post.created_at" />
            </div>
            <div v-if="msgError !== ''" class="mt-[50%]">
                <p v-html="msgError" class="text-center p-3 skiptranslate">
                </p>
                <Link href="/buscadorUsuarios" class="block w-2/6  text-center mx-auto py-2 px-4 
        bg-opacity-50 rounded-full border-0 text-sm font-semibold bg-blue-0 text-blue-1000 hover:bg-blue-0">Iniciar
                búsqueda</Link>

            </div>
            <div v-if="msgAlert !== ''" class="mt-[50%] ">
                <p class="text-center p-3 skiptranslate" v-html="msgAlert">
                   
                </p>
                <Link href="/subirPublicacion"
                    class="block w-2/6  text-center mx-auto py-2 px-4 
        bg-opacity-50 rounded-full border-0 text-sm font-semibold bg-blue-0 text-blue-1000 hover:bg-blue-0 skiptranslate">Subir
                posteo</Link>
            </div>
        </div>
        <div v-else class="mt-[70%]">

            <Spinner msg="Cargando más posteos" />
        </div>

        <Spinner v-if="loadingMorePosts === true" msg="Cargando más posteos" />
        <div ref="newPostLoaderSign"></div>
    </section>
</template>