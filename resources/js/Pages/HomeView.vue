<script setup>
import NavBar from '../components/NavBar.vue'
import PostUser from '../components/PostUser.vue'
import { db } from '../../services/firebase'
import { collection, addDoc, getDocs , onSnapshot} from 'firebase/firestore'
import { onMounted, ref } from 'vue';
const posts = ref([])
onMounted(async () => {
  const postsRef = collection(db, 'posts-public')
  // const snapshot = await getDocs(postsRef)
  onSnapshot(postsRef, snapshot=>{
    posts.value = snapshot.docs.map(doc => {
      return { id: doc.id, serie: doc.data().serie, text: doc.data().text, image: doc.data().image , date: doc.data().date}
    })

  })
})
</script>
<template>
  <NavBar></NavBar>
  <h1 class="text-2xl m-4">Pagina de posteos</h1>
  <section class="posts px-3">

    <PostUser v-for="post in posts"
    :descriptionUser="post.text"
    :img="post.image"
    :imgAlt="post.image"
    :serie="post.serie"
    :date="post.date"
    >{{ console.log(posts.value) }}</PostUser>
  </section>

</template>