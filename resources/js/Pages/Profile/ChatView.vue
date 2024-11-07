<script setup>
import NavBar from '../../components/NavBar.vue'
import { useLoginUser } from "../../composables/useLoginUser";
import {allChats} from '../../../services/private-chat'
import { ref, onMounted} from 'vue'
import { getUserName } from "../../../services/users";
const { loginUser } = useLoginUser()
const chats=ref([])
const loading=ref(true)
const chatsNames=ref([])
onMounted(async() => {
    if (loginUser.value.id) {
        
        chats.value= await allChats(loginUser.value.id)
        console.log(chatsNames.value)
        const chatsWithUserNames = await Promise.all(

            chats.value.map(async (chat) => {
                console.log(chat)
                const userId = Object.keys(chat.users);
                const userIdFound= userId.find((id)=>id!==loginUser.value.id)
                const userName = await getUserName(userIdFound);
                console.log(userName)
                return { ...chat, userName };
            })
        );
        chats.value = chatsWithUserNames;
   
        console.log(await chats.value)
        loading.value=false
    }

})
</script>
<template>
    
    <NavBar></NavBar>
    <h1 class="ms-2 text-xl mt-4 mb-4">Chat recientes</h1>
<div>
    <div v-if="!loading" v-for="(chat, index) in chats" :key="index"
    class="flex items-center gap-4  p-4  border-b border-blue-1000">
            <img class="w-10 h-10 rounded-full" src="/public/noimage.png" alt="">
            <div class="font-medium dark:text-white">
                <div>{{ chat.userName}}</div>
            </div>
        </div>
</div>
</template>