<script setup>
import { ref , watch} from 'vue';
const props=defineProps({
    isclosed:Boolean
})
const showModal = ref(false);

function openModal() {
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
}
watch(() => props.isclosed, (val) => {
    if (val === false) {
        closeModal();
    } 
});

</script>
<template>
    <div v-if="showModal"
        class="fixed  top-0 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-80  flex justify-center z-[11000] items-end "
        @click="closeModal">
        <div class="flex  flex-col w-full bg-white max-w-[500px] rounded-3xl rounded-b-none rounded-bl-none  rounded-s-3xl p-7 "
            style="box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    animation: slide-up 0.3s ease-out" @click.stop>
            <button class="self-end" @click="closeModal"><svg class="w-6 h-6 text-gray-400  "
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
            </button>
            <slot></slot>
        </div>
    </div>
    <button @click="openModal">
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 6h.01M12 12h.01M12 18h.01"/>
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
