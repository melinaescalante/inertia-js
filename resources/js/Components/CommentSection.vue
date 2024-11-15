<script setup>
import { addCommentToSerie } from '../../services/series';
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { useLoginUser } from '../composables/useLoginUser';
import { formatDate } from '../helpers/date';
const props = defineProps({
    comments: Array,
    idSerie: Number
})
const { loginUser } = useLoginUser()
const commentSerie = ref('')

async function handleComment() {
    try {

        await addCommentToSerie(commentSerie.value, loginUser.value.id, props.idSerie)
        commentSerie.value = ''
    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <div class="ms-3 mt-10">
        <p class="border-b">Comentarios {{ comments?.length|| 0 }}</p>
        <form @submit.prevent="handleComment" action="" class="flex gap-7 items-center ">

            <div class="ms-0 m-3 mb-0 flex flex-col gap-3 w-full">
                <label for="comment" class="">Deja tu comentario</label>
                <textarea
                    class="border ps-1 rounded-md border-blue-0 resize-none w-full focus:ring-2 focus:ring-blue-0 focus:outline-none"
                    id="comment" v-model="commentSerie"></textarea>
            </div>
            <button type="submit"
                class="border me-3 border-blue-0 px-4 py-1 rounded-md  self-end hover:bg-blue-1000 hover:text-white hover:font-medium hover:border-transparent">Enviar</button>
        </form>
    </div>
    <div>
        <ul>
            <li class=" flex flex-col bg-orange-0 bg-opacity-35 m-3 p-3 rounded-lg" v-for="comment in comments">
                <div class="flex gap-4">

                    <Link class="font-medium text-blue-1000" :href="`/perfil/${comment.userId}`">
                        {{ comment.userName }}
                    </Link>
                   <p>
                       {{ comment.commentInfo }}
                </p> 
                    
                </div>
                <span class="text-sm text-blue-1000 self-end">{{ formatDate(comment.created_at) }}</span>
            </li>
        </ul>
    </div>
</template>