<script setup>
import { usePage } from "@inertiajs/vue3";
import { useLoginUser } from "../../composables/useLoginUser";
import { useUser } from '../../composables/useUser';
import { savePrivateChatMessage, subscribeToPrivateChatMessages } from '../../../services/private-chat';
import { formatDate } from "../../helpers/date.js";
import { ref, onMounted } from 'vue';
import NavBar from '../../components/NavBar.vue';
import Spinner from '../../components/Spinner.vue';
import { getUserName } from '../../../services/users.js';
import { Link } from "@inertiajs/vue3";

const page = usePage();
const { loginUser } = useLoginUser();
const loading = ref(true);
const loadingMessages = ref(true);
const messages = ref([]);
const newMessage = ref({ text: null });
const userName = ref(getUserName(page.props.id));
const { user } = useUser(page.props.id, page.props.email, userName.value); 
onMounted(() => {
    subscribeToPrivateChatMessages(
        loginUser.value.id,
        page.props.id,
        newMessages => {
            messages.value = newMessages;
            loadingMessages.value = false;
        }
    );

    loading.value = false;
});

function handleSubmit() {
    try {
        savePrivateChatMessage(
            loginUser.value.id,
            user.value.id,
            newMessage.value.text,
        );
        newMessage.value.text = '';
    } catch (error) {
        console.log(error);
    }
}
</script>
<template>
    <NavBar></NavBar>
        <Suspense>
                <div>
                    <h2 class="sr-only">Mensajes privado</h2>
                    <div class="flex items-center gap-4 m-4 ms-2">
                        <img class="w-10 h-10 rounded-full" :src="user.photoURL|| '/noimage.png'" :alt="`Imagen de perfil del usuario ${user.displayName}`">
                        <div class="font-medium ">
                            <div><Link :href="`/perfil/${user.id}`">{{ user.displayName }}
                            </Link></div>
                        </div>
                    </div>

                    <div class="p-4 m-1 min-h-[65vh] border rounded">
                        <ul v-if="!loadingMessages" class="flex flex-col items-start">
                            <li v-for="message in messages" class="my-2 rounded p-2" :class="{
                                'bg-orange-0/30': loginUser.id !== message.user_id,
                                'bg-blue-0 self-end': loginUser.id === message.user_id
                            }">
                                <div v-if="message.user_id!==loginUser.id">
                                    <Link class="font-medium text-blue-1000 underline"
                                        :href="`/perfil/${message.user_id}`">{{ user.displayName }} </Link>
                                </div>
                                <div>{{ message.text }}</div>
                                <div class="text-sm text-gray-700">{{ formatDate(message.created_at) || 'Enviando' }}</div>
                            </li>
                        </ul>
                        <Spinner v-else></Spinner>
                    </div>
                    <form @submit.prevent="handleSubmit" action="" class="flex gap-3 items-stretch m-1 mt-2">
                        <label for="text" class="sr-only">Mensaje</label>
                        <textarea required name="text" id="text"
                            class="resize-none focus:ring-1 focus:ring-blue-300 focus:outline-none w-full min-h-10 p-2 border rounded-xl"
                            v-model="newMessage.text"></textarea>
                        <button type="submit" class="bg-blue-1000 text-white rounded-lg px-1 py-1 m-1">
                            <svg class="w-7 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span class="sr-only">Enviar mensaje</span>
                        </button>
                    </form>
                </div> 

            <template #fallback>
                <Spinner></Spinner>
            </template>
        </Suspense>
</template>

