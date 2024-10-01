<script setup>
import { Link } from '@inertiajs/vue3';
import { like, comment, getComments } from '../../services/posts';
import { ref, onMounted } from 'vue';
import { suscribeToAuthChanged } from "../../services/auth";

const loginUser = ref({
    id: null,
    email: null,
    displayName: null,
})
onMounted(() => {
    suscribeToAuthChanged(newUserData => loginUser.value = newUserData)
})
defineProps({
    userName:String,
    // pictureProfile:String,
    id: String,
    descriptionUser: String,
    date: String,
    img: String,
    imgAlt: String,
    serie: String,
    likes: Number,
    comments: Array

})
const commentText = ref('')
const commentsObtained = ref([])
async function giveComment(id) {
    comment(id, commentText.value, loginUser.value.id)
    commentText.value = ''
}

const areCommentsVisible = ref(false);
async function seeComments(id) {
    if (areCommentsVisible.value) {
        // Si los comentarios están visibles, los ocultamos
        areCommentsVisible.value = false;
        commentsObtained.value = [];
    } else {
        // Si no están visibles, los cargamos
        const comments = await getComments(id);
        commentsObtained.value = comments;
        areCommentsVisible.value = true; // Los marcamos como visibles
    }
}


function giveLike(e) {
    const heart = e.target
    if (heart.style.fill == 'white') {
        heart.style.fill = 'red'
        heart.style.stroke = 'red'
        like(e.target.id, 'plus')
    } else {
        heart.style.fill = 'white'
        heart.style.stroke = 'black'
        like(e.target.id, 'less')
    }
}
</script>
<template>

    <div class="m-4 border rounded-2xl p-4 mb-[2rem]">
        <div class="flex flex-row  items-center">
            <div>
                <img src="/public/noimage.png" class="border rounded-md mx-2 w-10 h-10 " alt="">

            </div>
            <div class="flex flex-col mx-2">

                <a href="#" class="text-[1.04rem] font-medium  ">{{userName}}</a>
                <a href="#" class="decoration-none text-blue-500   ">{{ serie }}</a>
            </div>
        </div>
        <div class="my-3">
            <p>{{ descriptionUser }}</p>


            <div v-if="img">
                <img :src="img" :alt="imgAlt" class="mx-auto mt-3 w-[30rem] border rounded-xl">
            </div>
            <p class="text-slate-500 ">{{ date }}</p>
        </div>
        <div class="flex justify-between my-5 mx-5">
            <div>
                <div class="flex">

                    <span class="sr-only">Like</span>
                    <p v-if="likes">
                        <span>{{ likes }}</span>
                    </p>
                    <div @click="giveLike" :id="id">

                        <svg :id="id" class="h-6 w-6 cursor-pointer" xmlns="http://www.w3.org/2000/svg"
                            data-name="Layer 1" viewBox="0 0 122.88 113.41">
                            <title>Like</title>
                            <path :id="id" style="stroke: black; fill: white;stroke-width: 10px;" class="cls-1"
                                d="M4.29,47.64h19.3A4.31,4.31,0,0,1,27.88,52V109.1a4.31,4.31,0,0,1-4.29,4.31H4.29A4.31,4.31,0,0,1,0,109.1V52a4.31,4.31,0,0,1,4.29-4.31ZM59,4.77c2.27-11.48,21.07-.91,22.31,17.6A79.82,79.82,0,0,1,79.68,42h26.87c11.17.44,20.92,8.44,14,21.58,1.57,5.72,1.81,12.44-2.45,15.09.53,9-2,14.64-6.65,19.06-.31,4.52-1.27,8.53-3.45,11.62-3.61,5.09-6.54,3.88-12.22,3.88H50.45c-7.19,0-11.11-2-15.81-7.88V54.81C48.16,51.16,55.35,32.66,59,20.51V4.77Z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div>
                <div class="flex">
                    <span class="sr-only">Comentar</span>
                    <p v-if="comments != undefined">
                        <span>{{ comments.length }}</span>
                    </p>
                    <svg @click="seeComments(id)" id=":id" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" class="h-6 w-6 cursor-pointer" version="1.1"
                        viewBox="0 0 512 512" xml:space="preserve">
                        <title>Comentar</title>

                        <g>
                            <path class="st0"
                                d="M410.431,63.966C370.965,24.479,316.251-0.015,256,0c-60.237-0.015-114.958,24.479-154.416,63.966   c-39.487,39.458-63.98,94.18-63.966,154.416c-0.014,57.076,21.986,109.21,57.881,148.053   c31.947,34.609,75.062,58.846,123.588,67.118v58.59c0,7.724,4.469,14.738,11.468,18c7,3.262,15.257,2.164,21.159-2.802   l144.725-121.715l-0.036,0.022c27.36-22.878,47.239-48.146,59.914-76.195c12.711-28.041,18.087-58.437,18.065-91.071   C474.397,158.146,449.91,103.424,410.431,63.966z M420.151,293.078c-10.006,22.029-25.562,42.266-49.237,62.13l-0.029,0.029   l-112.091,94.267v-33.373c0-10.304-7.906-18.913-18.167-19.784c-45.741-3.898-86.515-24.991-115.953-56.85   C95.258,307.61,77.339,265.19,77.325,218.382c0.014-49.404,19.974-93.945,52.338-126.346C162.054,59.672,206.603,39.714,256,39.706   c49.404,0.008,93.945,19.966,126.345,52.33c32.371,32.4,52.316,76.942,52.33,126.346   C434.661,246.781,430.111,271.026,420.151,293.078z" />
                            <path class="st0"
                                d="M151.771,191.906c-14.62,0-26.476,11.856-26.476,26.476c0,14.62,11.856,26.476,26.476,26.476   c14.613,0,26.469-11.856,26.469-26.476C178.24,203.762,166.385,191.906,151.771,191.906z" />
                            <path class="st0"
                                d="M256,191.906c-14.613,0-26.469,11.856-26.469,26.476c0,14.62,11.856,26.476,26.469,26.476   c14.62,0,26.476-11.856,26.476-26.476C282.476,203.762,270.62,191.906,256,191.906z" />
                            <path class="st0"
                                d="M360.236,191.906c-14.62,0-26.469,11.856-26.469,26.476c0,14.62,11.848,26.476,26.469,26.476   c14.62,0,26.476-11.856,26.476-26.476C386.712,203.762,374.856,191.906,360.236,191.906z" />
                        </g>
                    </svg>


                </div>
            </div>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 cursor-pointer" viewBox="-1 0 26 26"
                    version="1.1">
                    <title>Compartir</title>
                    <g fill="none" fill-rule="evenodd" sketch:type="MSPage">
                        <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-312.000000, -726.000000)"
                            fill="#000000">
                            <path
                                d="M331,750 C329.343,750 328,748.657 328,747 C328,745.343 329.343,744 331,744 C332.657,744 334,745.343 334,747 C334,748.657 332.657,750 331,750 L331,750 Z M317,742 C315.343,742 314,740.657 314,739 C314,737.344 315.343,736 317,736 C318.657,736 320,737.344 320,739 C320,740.657 318.657,742 317,742 L317,742 Z M331,728 C332.657,728 334,729.343 334,731 C334,732.657 332.657,734 331,734 C329.343,734 328,732.657 328,731 C328,729.343 329.343,728 331,728 L331,728 Z M331,742 C329.23,742 327.685,742.925 326.796,744.312 L321.441,741.252 C321.787,740.572 322,739.814 322,739 C322,738.497 321.903,738.021 321.765,737.563 L327.336,734.38 C328.249,735.37 329.547,736 331,736 C333.762,736 336,733.762 336,731 C336,728.238 333.762,726 331,726 C328.238,726 326,728.238 326,731 C326,731.503 326.097,731.979 326.235,732.438 L320.664,735.62 C319.751,734.631 318.453,734 317,734 C314.238,734 312,736.238 312,739 C312,741.762 314.238,744 317,744 C318.14,744 319.179,743.604 320.02,742.962 L320,743 L326.055,746.46 C326.035,746.64 326,746.814 326,747 C326,749.762 328.238,752 331,752 C333.762,752 336,749.762 336,747 C336,744.238 333.762,742 331,742 L331,742 Z"
                                id="share" sketch:type="MSShapeGroup">

                            </path>
                        </g>
                    </g>
                </svg>
                <span class="sr-only">Compartir</span>

            </div>
        </div>
        <ul id="commentObtained" open="false" v-if="commentsObtained" >
            <li v-for="comment in commentsObtained" class="border-b-2 ms-2 mt-3 mb-3">
                <strong>{{ Object.keys(comment)[0] }}</strong>: {{ Object.values(comment)[0] }}
            </li>
        </ul>
        <span class="sr-only">Deja tu comentario debajo:</span>
        <div class="relative">
            <form action="" @submit.prevent="giveComment(id)" :id="id">

                <input type="text" id="comment"
                    class="block w-full p-3 border rounded-3xl focus:ring-blue-500 focus:border-blue-500 focus:outline-none mt-4"
                    placeholder="Deja tu comentario aquí" required v-model="commentText" />
                <button type="submit" class="text-white absolute end-2.5 bottom-2.5    rounded-lg  px-1 py-1">
                    <svg class="w-7 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                            stroke="blue" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span class="sr-only">Publicar comentario</span>

                </button>
            </form>

        </div>
    </div>
</template>
