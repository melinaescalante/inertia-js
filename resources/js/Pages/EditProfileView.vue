<script setup>
import NavBar from '../components/NavBar.vue'
import { editProfile, suscribeToAuthChanged } from '../../services/auth'
import { ref, onMounted } from 'vue';

const editData = ref({
    displayName: '',
    bio: '',
    
})
const loading= ref(false)
onMounted(() => {
    suscribeToAuthChanged(newUserData => editData.value = {
        displayName: newUserData.displayName,
        bio: newUserData.bio
    }
)
console.log(editData.value)
})
async function handleSubmit() {
    loading.value = true
    try {
        await editProfile({ ...editData.value })
    } catch (error) {
        console.log("No se ha podido editar correctamente el perfil.")
    }
}
</script>
<template>
    <NavBar></NavBar>
    <h1  class="text-start text-2xl mt-8 mb-8 font-medium">Edita tu perfil</h1>
    <form action="#" @submit.prevent="handleSubmit" class=" border p-6 max-w-lg rounded-lg mx-auto">
        <div class="flex flex-col mb-3">
            <label for="bio" class="ms-2 m-2">Biografia</label>
            <textarea name="bio" id="bio" class="p-2 m-2 border rounded-md resize-none"
                v-model="editData.bio"></textarea>
        </div>
        <div class="flex flex-col mb-3">
            <label for="name" class="ms-2 m-2">Nombre de usuario</label>
            <input name="name" class="p-2 m-2  border rounded-md" id="name" v-model="editData.displayName" />
        </div>
        
        <div class="ms-2">

            <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">Confirmar</button>
        </div>
    </form>
</template>