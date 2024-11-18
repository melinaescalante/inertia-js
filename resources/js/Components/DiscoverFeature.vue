<script setup>
import { Link } from '@inertiajs/vue3';
defineProps({
  genres: Array,
  id:Number,
  titleSerie: String,
  dateSerie: String,
  synopsis: String,
  cover: Object,
  text: String
});


const imgDefault = '/noimage.png'
</script>
<template>
  <div class="flex flex-col justify-center bg-white border-gray-200 m-4 mt-0 border rounded-lg min-w-[92%]">
    <div >

      <Link class="flex" :href="`/show/${id}`" >
      <img class="h-[40%] lg:h-[100%] w-auto max-w-[15rem] rounded-l-lg object-cover" :src="cover?.medium || imgDefault"
        :alt="text">
      <div class="flex flex-wrap ms-4 mt-4 me-4">
        <p class="text-2xl font-medium mb-2">{{ titleSerie }}</p>
        <p v-html="synopsis.length > 150 ? `${synopsis.slice(0, 200)}...` : synopsis">
        </p>
        <p class="mb-3">{{ dateSerie }}</p>


      </div>
      </Link>
    </div>
    <div class="flex
    ">
      <p v-for="genre in genres" class=" rounded-xl bg-opacity-70   border border-orange-0 text-blue-1000  text-sm font-normal px-2 py-1 m-1 text-center">{{ genre }}</p>
    </div>
  </div>
</template>