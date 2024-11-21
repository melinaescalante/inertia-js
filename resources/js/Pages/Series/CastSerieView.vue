<script setup>
import NavBar from '../../components/NavBar.vue'

defineProps({
    cast: Array,
    name: String
})
</script>
<template>

    <NavBar></NavBar>
    <h1 class="font-medium text-2xl m-2 mt-3 mb-3">Elenco {{ name }}</h1>
    <section id="cast">

        <div class="grid grid-cols-2 gap-8 p-2 m-auto justify-items-center grid-rows-none  items-baseline ">

            <div class="flex flex-col items-start justify-center text-start" v-for="person in cast">
                <img class="max-h-72   object-cover"
                    :src="person.person.image.medium ? person.person.image.medium : '/public/noimage.png'" alt="">
                <p>{{ person.person.name }} como</p>
                <p class="font-medium inline-block text-start">{{ person.character.name }}</p>
            </div>
        </div>
    </section>
</template>