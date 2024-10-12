<script setup>
defineProps({
    href: String,
    name:String,
    param:String
})
</script>
<template>
    <a :href="`/show/${href}/${param}/${name}`" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none"><slot></slot></a>
</template>