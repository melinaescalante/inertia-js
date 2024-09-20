<script setup>
import { Link } from '@inertiajs/vue3';
import { db, storage } from '../../services/firebase'
import { collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

import { ref } from 'vue';

const imageInput = ref(null); // Ref para el input de tipo file
const newPost = ref({
  serie: '',
  text: '',
  image: '',
  date: ''
})
async function handlePost() {
  let imageURL
  if (imageInput!==null) {
    imageURL = await uploadPhoto();  
  }
  const postRef = collection(db, 'posts-public')
  addDoc(postRef, {
    text: newPost.value.text,
    serie: newPost.value.serie,
    image: newPost.value.image ? imageURL : null,
    date: new Date().toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires'
    })
  });

  newPost.value.text = '';
  newPost.value.serie = '';
  newPost.value.image = null;

  if (imageInput.value) {
    imageInput.value = '';
  }
}
function handleImageChange(e) {
  const file = e.target.files[0];
  newPost.value.image = file;
}
async function uploadPhoto() {
  const fileInput = newPost.value.image
    try {
      const storageRefe = storageRef(storage, `posts/${fileInput.name}`);
      await uploadBytes(storageRefe, fileInput);
      // Obtén la URL de descarga
      const downloadURL = await getDownloadURL(storageRefe);
      // Agrega la URL y los datos asociados a la colección 'fotos' en Firestore
      return downloadURL
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  
}
</script>
<template>
  <nav class="flex justify-between items-center p-4 bg-slate-200 text-slate-800">
    <Link href="/" class="text-xl">Tv On</Link>

    <ul class="flex items-center">
    </ul>
  </nav>

  <h1 class="text-xl m-2">Subir publicacion</h1>
  <form action="" enctype="multipart/form-data" @submit.prevent="handlePost">
    <div class="flex flex-col mb-3">
      <span class="sr-only">Escribe la serie con la que te quieres referir</span>
      <label class="m-2" for="serie">¿Sobre qué serie estas pensando?</label>
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