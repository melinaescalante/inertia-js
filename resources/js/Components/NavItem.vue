<script setup>
import { Link } from '@inertiajs/vue3'

defineProps({
    titleLink: String,
    route: String,
    roundedClass: String
})
</script>
<template>
    <div class="flex flex-col justify-center items-center mt-2">

        
        <Link :title="titleLink" :href="`${route}`"
        :class="`flex flex-col items-center justify-center group ${roundedClass} `">
        <slot></slot>
        
        <span class="text-center text-sm">{{ titleLink!=='Postear'? titleLink: '' }}</span>
        <!-- <span class="text-center text-sm m-1">{{ titleLink }}</span> -->


    </Link>
    <span class="text-center text-sm m-1" :class="{'hidden':titleLink!=='Postear'}">{{   titleLink==='Postear'? titleLink: '' }}</span>
</div>
</template>