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
    <div class="flex justify-start bg-white border-gray-200 m-4 border rounded-lg">
        <img class="h-auto rounded-l-lg max-md:max-w-36  lg:max-w-52" :src="cover?.medium || imgDefault" :alt="text">
        <div class=" ms-4 mt-4 me-4">

            <p class="text-2xl font-medium mb-3">{{titleSerie}}</p>
            <p class="mb-3">{{synopsis.length > 200 ? `${synopsis.slice(0, 200)}...` : synopsis}}</p>
            <p class="mb-3">{{dateSerie}}</p>
        </div>
    </div>
</template>