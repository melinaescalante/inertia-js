<script setup>
defineProps({
  titleSerie:String,
  dateSerie:String,
  synopsis:String,
  cover: String,
  text:String
});
// const truncatedSynopsis = ;

const imgDefault= '/noimage.png'
</script>
<template>
    <div class="flex justify-start bg-white border-gray-200 m-4 border rounded-lg min-w-[95%]">
      <img 
        class="h-[50%] lg:h-[100%] w-auto max-w-[15rem] rounded-l-lg object-cover" 
        :src="cover?.medium || imgDefault" 
        :alt="text"
      >
      <div class="flex flex-wrap ms-4 mt-4 me-4">
        <p class="text-2xl font-medium mb-2">{{ titleSerie }}</p>
        <p >
          {{ synopsis.length > 150 ? `${synopsis.slice(0, 200)}...` : synopsis }}
        </p>
        <p class="mb-3">{{ dateSerie }}</p>
      </div>
    </div>
  </template>