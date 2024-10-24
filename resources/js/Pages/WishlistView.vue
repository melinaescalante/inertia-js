<script setup>
import NavBar from '../components/NavBar.vue'
import ButtonGoBack from '../components/ButtonGoBack.vue'
import { Link } from '@inertiajs/vue3';
defineProps({
    seriesToWatch:Array
})
</script>
<template>
    <NavBar></NavBar>
    <h1>Tus series a ver</h1>{{
    console.log(seriesToWatch)}}
    <ul>

        <li v-for="series in seriesToWatch" :key="series.id">{{ series.name }}</li>
    </ul>
</template>