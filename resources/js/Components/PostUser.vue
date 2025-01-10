<script setup>
import { router, Link } from '@inertiajs/vue3';
import { like, comment, getComments, isLiked } from '../../services/posts';
import { useLoginUser } from "../composables/useLoginUser";
import { ref } from 'vue';
import BottomSheet from './BottomSheet.vue';
import { formatDate } from '../helpers/date';
import ModalComponentDelete from './ModalComponentDelete.vue'
const { loginUser } = useLoginUser()

const props = defineProps({
    userName: String,
    userId: String,
    id: String,
    descriptionUser: String,
    date: String,
    img: String,
    imgAlt: String,
    serie: String,
    idSerie: Number,
    likes: Array,
    comments: Array,
    liked: Function | Boolean,
    created_at: Object,
    photoURL: String

})

const commentText = ref("")
async function giveComment(id) {
    if (loginUser.value.id === undefined || loginUser.value.id === null) {
        router.replace('/ingresar');
        return
    }
    if (loginUser.value.id !== undefined) {
        comment(id, commentText.value, loginUser.value.id)
        commentText.value = ''
    }
}
async function share(id) {
    let shareData = {
        title: 'TvOn-Post  ',
        text: 'TvOn-Post',
        url: 'http://127.0.0.1:8000/post/' + id,
    };

    if (!navigator.canShare) {
        console.log('No se puede compartir');
        return;
    }
    if (!navigator.canShare(shareData)) {
        console.log('Se soporta compartir en este navegador');
        return;
    }
    navigator.share(shareData)
        .then(() =>
            console.log('Share exitoso')
        )
        .catch((e) =>
            console.log(e)
        )

}
const areCommentsVisible = ref(false);
const commentsArray = ref([])
const loadingComments = ref(true)

async function seeComments(id) {
    areCommentsVisible.value = !areCommentsVisible.value;
    if (areCommentsVisible.value) {
        loadingComments.value = true;
        try {
            commentsArray.value = await getComments((newComments) => {
                commentsArray.value = newComments
                loadingComments.value = false
            }, id)

        } catch (error) {
            console.error("Error al cargar comentarios:", error);
            commentsArray.value = [];
        } finally {
            loadingComments.value = false;
        }
    }
}

async function giveLike(e) {
    const heart = e.target
    if (loginUser.value.id === undefined || loginUser.value.id === null) {
        router.replace('/ingresar');
        return
    }
    try {
        const alreadyLiked = await isLiked(heart.id, loginUser.value.id);
        if (!alreadyLiked) {
            await like(e.target.id, 'plus', loginUser.value.id);
            heart.style.fill = 'red';
            heart.style.stroke = 'red';
        } else {
            await like(e.target.id, 'less', loginUser.value.id);
            heart.style.fill = 'white';
            heart.style.stroke = 'black';
        }
    } catch (error) {
        console.error("Error en el proceso de like:", error);
    }

}

const isBottomSheetOpen = ref(true);
function handleClose() {

    isBottomSheetOpen.value = false;
    setTimeout(() => {
        isBottomSheetOpen.value = true;
    }, 100);
}

</script>
<template>
    <article>
        <div class="m-2 shadow-[inset_0_1px_25px_-10px] shadow-orange-0 rounded-2xl p-4 mb-[2rem]">
            <div class="flex flex-row justify-between items-center">
                <div>
                    <img :src="photoURL || '/noimage.png'" class=" border rounded-md  w-10 h-10 skiptranslate" alt="">

                </div>
                <div class="flex flex-col mx-2 ">

                    <Link :href="`/perfil/${userId}`" class="text-[1.04rem] font-normal text-center skiptranslate  ">{{ userName }}
                    </Link>
                    <Link :href="`/show/${idSerie}`" class=" text-center decoration-none text-blue-500">{{ serie }}
                    </Link>
                </div>
                <div class="skiptranslate">
                    <BottomSheet v-if="userId === loginUser.id" :isclosed="isBottomSheetOpen">
                        <div class="flex flex-col">
                            <div class="flex">
                                <div>

                                    <svg class="w-6 h-6 text-gray-400 " aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                        viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="1.5"
                                            d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <span class="sr-only">Cerrar modal</span>
                                </div>
                                <p class="text-gray-600  ms-2">Informacion: {{ formatDate(created_at) }}</p>
                            </div>

                            <div class="max-w-[50%] mt-2" v-if="loginUser.id === userId">

                                <ModalComponentDelete @closeModal="handleClose" :id="id" modalTitle="Eliminar Posteo"
                                    modalDescription="¿Estás seguro de eliminar esta
                        publicación?" msgAfirmative="Si, la quiero eliminar"></ModalComponentDelete>
                            </div>
                        </div>
                    </BottomSheet>


                </div>
            </div>
            <div class="my-4 skiptranslate">
                <p class="ms-1">{{ descriptionUser }}</p>


                <div v-if="img">
                    <img :src="img" :alt="imgAlt" class="mx-auto mt-3 w-[30rem] border rounded-xl">
                </div>
                <p class="text-slate-500 ms-1 mt-2">{{ formatDate(created_at) }}</p>
            </div>
            <div class="flex justify-between my-5 mx-5 skiptranslate">
                <div>
                    <div class="flex">

                        <span class="sr-only">Like</span>
                        <p v-if="likes !== undefined && likes != 0">
                            <Link :href="`/${id}/likes`"><span class="m-1">{{ likes.length }}</span></Link>
                        </p>
                        <div @click="giveLike" :id="id" :liked="liked">

                            <svg :id="id" class="h-6 w-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg"
                                data-name="Layer 1" viewBox="0 0 122.88 113.41">
                                <title>Like</title>
                                <path :id="id"
                                    :style="liked ? 'stroke: red; fill: red; stroke-width: 10px;' : 'stroke: black; fill: white; stroke-width: 10px;'"
                                    class="cls-1"
                                    d="M4.29,47.64h19.3A4.31,4.31,0,0,1,27.88,52V109.1a4.31,4.31,0,0,1-4.29,4.31H4.29A4.31,4.31,0,0,1,0,109.1V52a4.31,4.31,0,0,1,4.29-4.31ZM59,4.77c2.27-11.48,21.07-.91,22.31,17.6A79.82,79.82,0,0,1,79.68,42h26.87c11.17.44,20.92,8.44,14,21.58,1.57,5.72,1.81,12.44-2.45,15.09.53,9-2,14.64-6.65,19.06-.31,4.52-1.27,8.53-3.45,11.62-3.61,5.09-6.54,3.88-12.22,3.88H50.45c-7.19,0-11.11-2-15.81-7.88V54.81C48.16,51.16,55.35,32.66,59,20.51V4.77Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="flex">
                        <span class="sr-only">Comentar</span>
                        <p v-if="comments != undefined && comments.length > 0">
                            <span>{{ comments.length }}</span>
                        </p>
                        <svg @click="seeComments(id)" :id="id" class="w-7 h-7 cursor-pointer" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <title>Comentar</title>

                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="1.5"
                                d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868 0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896 0 0 0-.63-.256Z" />
                        </svg>
                    </div>
                </div>
                <div @click="share(id)" :id="id">
                    <svg class="h-7 w-7 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <title>Compartir</title>
                        <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5"
                            d="M7.926 10.898 15 7.727m-7.074 5.39L15 16.29M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                    </svg>
                    <span class="sr-only">Compartir</span>

                </div>
            </div>
            <ul v-if="areCommentsVisible && !loadingComments" class="skiptranslate">

                              <li class=" flex flex-col  bg-opacity-35 m-3 p-3 rounded-lg break-words" v-for="comment in commentsArray">

                    <div class="flex gap-4 flex-wrap">

                        <Link class="font-medium text-blue-1000" :href="`/perfil/${comment.userId}`">
                        {{ comment.userName }}
                        </Link>
                        <div class="break-all mb-2  ">

                            <p>
                                {{ comment.commentInfo }}
                            </p>
                        </div>

                    </div>
                    <span class="text-[14px] text-gray-800 self-start">{{ formatDate(comment.created_at) }}</span>
                </li>
                <p v-if="!comments.length" class="text-slate-400 ms-2 ">¡Sé el primero en comentar!</p>

            </ul>



            <div class="relative skiptranslate">
                <form action="#" @submit.prevent="giveComment(id)" :id="id">
                    <label for="comment" class="sr-only">Deja tu comentario debajo:</label>
                    <input type="text" aria-label="comment"
                        class="block w-full p-3 border rounded-3xl focus:ring-blue-500 focus:border-blue-500 focus:outline-none mt-4"
                        placeholder="Deja tu comentario aquí" required v-model="commentText" />
                    <button type="submit" class="text-white absolute end-2.5 bottom-2.5    rounded-lg  px-1 py-1">
                        <svg class="w-7 h-6 stroke-blue-1000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span class="sr-only">Publicar comentario</span>

                    </button>
                </form>

            </div>
        </div>
    </article>
</template>
