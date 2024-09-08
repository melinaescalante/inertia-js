<script setup>
import { useRouter } from 'vue-router'; // Inertia router para navegación
import { ref } from 'vue'; // Ref para manejar el estado del input
const router= useRouter()
const form = ref(''); // Modelo para el campo de búsqueda

// function submit() {
  
// //     router.get(`/serie/${form.value}`);
//     router.replace(`/serie/${form.value}`)

// }
</script>

<template>
  <form @input="submit" class="max-w-2xl m-4 mb-5 mt-5" action="SearchView" method="get">   
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
      Busca tu serie
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none mt-4" placeholder="Busca tu serie" required v-model="form" />
      <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
        Buscar
      </button>
    </div>
  </form>
</template>
