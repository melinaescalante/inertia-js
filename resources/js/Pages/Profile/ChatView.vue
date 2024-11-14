<script setup>
import NavBar from '../../components/NavBar.vue'
import { useLoginUser } from "../../composables/useLoginUser";
import { allChats } from '../../../services/private-chat'
import { ref, onMounted } from 'vue'
import { getUserName, getEmailUser, getPhotoURL } from "../../../services/users";
import { Link } from '@inertiajs/vue3';
import Spinner from '../../components/Spinner.vue';
const { loginUser } = useLoginUser()
const chats = ref([])
const loading = ref(true)
const chatsNames = ref([])
onMounted(async () => {
    if (loginUser.value.id) {

        chats.value = await allChats(loginUser.value.id)
        console.log(chats.value)
        const chatsWithUserNames = await Promise.all(

            chats.value.map(async (chat) => {
                console.log(chat)
                const userId = Object.keys(chat.users);
                const userIdFound = userId.find((id) => id !== loginUser.value.id)
                const userName = await getUserName(userIdFound);
                console.log(userName)
                const email = await getEmailUser(userIdFound);
                const photo = await getPhotoURL(userIdFound);
                console.log(userName)
                return { ...chat, userName, email, photo };
            })
        );
        chats.value = chatsWithUserNames;

        console.log(await chats.value)
        loading.value = false
    }

})
</script>
<template>

    <NavBar></NavBar>
    <div class="flex items-center justify-between">

        <h1 class="ms-2 text-xl mt-4 mb-4">Chat recientes</h1>
        <span>
            <Link href="/buscadorUsuarios">
            <img class="h-6 w-6 fill-blue-0 me-2" src="/public/images/plus.svg" alt="Crear un nuevo chat el privado">
            </Link>
        </span>
    </div>
    <div>
        <div v-if="!loading" v-for="(chat, index) in chats" :key="index"
            class="flex items-center gap-4  p-4  border-b border-blue-1000">
            <img class="w-10 h-10 rounded-full" :src="chat.photo || '/noimage.png'" :alt="`Foto de perfil del usuario ${chat.userName}`">
            <div class="font-medium ">
                <div>
                    <Link
                        :href="`/chatPrivado/${Object.keys(chat.users).find(id => id !== loginUser.id)}/${chat.email}`">
                    {{ chat.userName }}</Link>
                </div>
            </div>
        </div>
        <div  v-else>

            <Spinner class="mx-auto" msg="Cargando chats"></Spinner>
        </div>
    </div>
</template>