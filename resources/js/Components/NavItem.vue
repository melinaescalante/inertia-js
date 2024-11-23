<script setup>
import { Link } from '@inertiajs/vue3'

defineProps({
    titleLink: String,
    route: String,
    roundedClass: String
})
</script>
<template>

    <Link :title="titleLink" :href="`${route}`"
        :class="`flex flex-col items-center justify-center group ${roundedClass} px-0 py-2`">
    <slot></slot>

<span class="text-center text-sm">{{ titleLink!=='Nuevo Posteo'? titleLink: '' }}</span>
<!-- <span class="text-center text-sm m-1">{{  titleLink }}</span> -->
</Link>
</template>