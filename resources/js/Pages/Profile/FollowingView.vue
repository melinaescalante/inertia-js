<script setup>
import { getUsername, allFollowing, getPhotoURL } from '../../../services/users';
import { Link } from '@inertiajs/vue3';
import NavBar from '../../components/NavBar.vue';
import { onMounted, ref } from 'vue';
import { useLoginUser } from '../../composables/useLoginUser';
import Spinner from '../../Components/Spinner.vue';
const { loginUser } = useLoginUser()
const loading = ref(true)
const props= defineProps({
    usersArray:Array
})
const following = ref([])
onMounted(async () => {

    try {
        const users = await allFollowing(loginUser.value.id);

        const userDetails = await Promise.all(
            users.map(async user => {
                let idUser = Object.keys(user.following).toString();
                const username = await getUsername(idUser);
                const photo = await getPhotoURL(idUser);
                return { idUser, username, photo };
            })
        );

        following.value = userDetails;
        loading.value = false
        console.log(following.value);
    } catch (error) {
        console.log(error)
    }

})
 console.log(props.usersArray) 
</script>
<template>
    <NavBar></NavBar>
    <h1  class="font-medium text-2xl m-2 mt-3 mb-5">Seguidos</h1>
    <div v-if="!loading" v-for="(user, index) in following" :key="index"
        class="flex items-center gap-4  p-4  border-b-[1px]  border-blue-1000 skiptranslate">
        <img class="w-10 h-10 rounded-full" :src="user.photo || '/noimage.png'"
            :alt="`Foto de perfil del usuario ${user.username}`">
        <div class="font-medium ">
            <div>
            
                <Link :href="`/perfil/${user.idUser}`">
                {{ user.username }}</Link>
             
            </div>
        </div>
    </div>
    <div v-else>

        <Spinner class="mx-auto" msg="Cargando chats"></Spinner>
    </div>
</template>