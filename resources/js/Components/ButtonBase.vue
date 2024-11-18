<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
    href: String|Number,
    name:String|Number,
    param:String|Number
})
</script>
<template>
    <Link :href="`/show/${name}/${param}/${href}`" class="text-white bg-blue-1000 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2  focus:outline-none"><slot></slot></Link>
</template>