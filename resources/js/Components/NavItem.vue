<script setup>
import { Link } from '@inertiajs/vue3'

defineProps({
    titleLink:String,
    route:String,
   roundedClass:String
})
</script>
<template>

<Link :title="titleLink" :href="`${route}`" data-tooltip-target="tooltip-profile"
                :class="`inline-flex flex-col items-center justify-center px-5  group ${roundedClass}`">
           <slot></slot>
            <span class="sr-only">{{ titleLink }}</span>
            </Link>
            <div id="tooltip-profile" role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
                {{ titleLink }}
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
</template>