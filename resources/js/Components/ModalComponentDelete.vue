<script setup>
import { router, usePage } from '@inertiajs/vue3';
import { ref } from 'vue';
import { deletePost } from '../../services/posts'
import { defineEmits } from 'vue';
import { useLoginUser } from '../composables/useLoginUser';
const page = usePage()
const currentPage = page.component
defineProps({
    id: String
})

const showModal = ref(false);
const emit = defineEmits(['closeModal']);

function openModal() {
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
}

async function handleDeletePost(id) {
    try {
        await deletePost(id)
        emit('closeModal',false);
        showModal.value = false;
        if (currentPage==='SinglePostView') {
            router.replace('/miPerfil')
        }
    } catch (error) {

    }
}
</script>

<template>
    <button @click="openModal"
        class="block text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 "
        type="button">
        Eliminar posteo
    </button>

    <div v-if="showModal" class="fixed inset-0 flex justify-center items-center z-50 bg-gray-800 bg-opacity-50"
        @click.self="closeModal">
        <div tabindex="-1" class="relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow ">
                <button @click="closeModal" type="button"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center ">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Cerrar modal</span>
                </button>
                <div class="p-4 md:p-5 text-center">
                    <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 " aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <h3 class="mb-5 text-lg font-normal text-gray-500 ">¿Estás seguro de eliminar esta
                        publicación?</h3>
                    <button @click="handleDeletePost(id)" type="button"
                        class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300  font-medium rounded-full text-sm inline-flex items-center px-5 py-2.5 text-center">
                        Si, la quiero eliminar
                    </button>
                    <button type="button"
                        class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 "
                        @click="closeModal">No, cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>
