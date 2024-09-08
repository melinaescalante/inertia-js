<script setup>import { useRouter } from 'vue-router';
const router= useRouter()
</script>
<template>
<h1>{{ router.params.name }}</h1>
</template>