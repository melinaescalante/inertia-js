<script setup>
import { Link } from '@inertiajs/vue3'

defineProps({
    titleLink:String,
    route:String,
    svg:String,
    loginUser:String
})
</script>
<template>

<Link :title="{titleLink}" :href="`/${route}/${loginUser}`" data-tooltip-target="tooltip-profile"
                class="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50  group">
            <svg class="w-5 h-5 mb-1 text-gray-500  group-hover:text-blue-600 " aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <title>{{titleLink}}</title>

                <path
                    d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            <span class="sr-only">{{ titleLink }}</span>
            </Link>
            <div id="tooltip-profile" role="tooltip"
                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
                {{ titleLink }}
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
</template>