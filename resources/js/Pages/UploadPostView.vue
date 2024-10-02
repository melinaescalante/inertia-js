<script setup>
import { Link } from '@inertiajs/vue3';
import SearchComponent from '../Components/SearchComponent.vue';
import { uploadPost, uploadPhoto } from '../../services/posts'
import { suscribeToAuthChanged } from "../../services/auth";
import { ref, onMounted } from 'vue';
onMounted(() => {
    suscribeToAuthChanged(newUserData => loginUser.value = newUserData)
})
defineProps({
    series: Array  
})
const imageInput = ref(null); // Ref para el input de tipo file
const newPost = ref({
  userid:null,
  serie: '',
  text: '',
  image: '',
  date: ''
})
const loginUser = ref({
    id: null,
    email: null,
    displayName: null,
    bio:null

})
async function handlePost() {
  let imageURL
  if (imageInput !== null) {
    imageURL = await uploadPhoto(newPost.value.image);
  } else {
    imageURL = null
  }
  newPost.value.image=imageURL
  newPost.value.userid =loginUser.value.id

  newPost.value.date = new Date().toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires'
  })
  uploadPost({ ...newPost.value })
  newPost.value.text = '';
  newPost.value.serie = '';
  newPost.value.image = null;
  if (imageInput.value) {
    imageInput.value.value = '';
  }
}
function handleImageChange(e) {
  const file = e.target.files[0];
  newPost.value.image = file;
}

</script>
<template>
  
  <nav class="flex justify-between items-center p-4 bg-slate-200 text-slate-800">
    <Link href="/" class="text-xl">Tv On</Link>

  </nav>
  
  <h1 class="text-xl m-2">Subir publicacion</h1>
  <form action="" enctype="multipart/form-data" @submit.prevent="handlePost">
    <div class="flex flex-col mb-3">
      <span class="sr-only">Escribe la serie con la que te quieres referir</span>
      <label class="m-2" for="serie">¿Sobre qué serie estas pensando?</label>
      <!-- <SearchComponent :series="series">

      </SearchComponent> -->
      <input type="search" class="p-2 m-2  border rounded-md" name="serie" id="serie" v-model="newPost.serie"
        required />
    </div>
    <div class="flex flex-col mb-3">
      <span class="sr-only">Escribe lo que quieras</span>
      <label for="description"></label>
      <textarea class=" p-2 m-2 border rounded-md" name="description" id="description"
        placeholder="Escribe lo que quieras" v-model="newPost.text"></textarea>
    </div>
    <div class="m-2 mb-4 mt-3 ">

      <label class="block">
        <span class="sr-only">Puedes subir una imagen:</span>
        <input ref="imageInput" type="file" @change="handleImageChange" class="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-500
                hover:file:bg-violet-100" />
      </label>
    </div>

    <input type="submit" class="m-2 border rounded-lg py-2 px-4 bg-blue-700 text-white hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-900
      transition-colors" value="Publicar">

  </form>
</template>