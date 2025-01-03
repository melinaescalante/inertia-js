
<script setup>
import { Link,usePage } from '@inertiajs/vue3';
const page = usePage()
const currentPage = page.component

</script>
<template>


    <div class="flex mx-auto rounded-md justify-center mt-2 skiptranslate gap-2">
        <Link href="/" aria-current="page"
            class="px-4 py-2 text-sm font-medium bg-white border-b hover:text-blue-1000  border-gray-200  hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white" :class="currentPage === 'HomeView' ? 'border-b-blue-1000 text-blue-1000' : 'text-gray-500 border-b-gray-200'" >
            Para ti
        </Link>
       
        <Link href="/siguiendo"
            class="px-4 py-2  text-sm font-medium   bg-white border-b hover:bg-gray-100 hover:text-blue-1000 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700  dark:focus:ring-blue-500 dark:focus:text-white skiptranslate"
            :class="currentPage === 'HomeFollowingView' ? 'border-b-blue-1000 text-blue-1000': 'border-b-gray-200 text-gray-500 '" >
            Seguidos
        </Link>
    </div>

</template>