<script setup>
import { ref } from 'vue';

const showModal = ref(false);

function openModal() {
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
}
</script>
<template>
    <div v-if="showModal"
        class="fixed top-0 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-80  flex justify-center z-[1000] items-end"
        @click="closeModal">
        <div class=" w-full bg-white max-w-[500px] rounded-3xl rounded-b-none rounded-bl-none  rounded-s-3xl p-7 "
            style="box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    animation: slide-up 0.3s ease-out" @click.stop>
            <slot></slot>
            <button @click="closeModal">Cerrar</button>
        </div>
    </div>
    <button @click="openModal">
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
                d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2" />
        </svg>
    </button>
</template>

<style>
@keyframes slide-up {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}
</style>