<script setup>
defineProps({
  titleSerie:String,
  dateSerie:String,
  synopsis:String,
  cover: String,
  text:String
});
const imgDefault= '/noimage.png'
</script>
<template>
    <div class="flex justify-start bg-slate-400 m-4 border rounded">
        <img class="h-48" :src="cover?.medium || imgDefault" :alt="text">
        <div class=" ms-4 mt-4">

            <p class="text-2xl">{{titleSerie}}</p>
            <p>{{synopsis}}</p>
            <p>{{dateSerie}}</p>
        </div>
    </div>
</template>