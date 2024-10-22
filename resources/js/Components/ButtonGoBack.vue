<script setup>
function goBack() {
  window.history.back();
}
</script>
<template>

  <button @click="goBack" type="button"
    class=" bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center ms-2 ">
    <svg class="w-6 h-6 text-white text-center" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
      height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14 8-4 4 4 4" />
    </svg>
    <span class="sr-only">Volver atras</span>
  </button>
</template>