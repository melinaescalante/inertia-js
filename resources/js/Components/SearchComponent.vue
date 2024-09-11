<!-- 
<script setup>
import { ref } from 'vue';

const formInput = ref(''); // El término de búsqueda que ingresa el usuario
const results = ref([]); // Los resultados de la búsqueda

const searchSeries = async () => {
  if (formInput.value.length > 3) { // Solo realizar la búsqueda si hay más de 3 caracteres
    try {
      // Llamar directamente a la API de TVMaze con fetch
      const response = await fetch(`/buscador/${formInput.value}`);
      if (response.ok) {
        const data = await response.json();
        results.value = data;
        console.log(data)
      } else {
        console.error('NO HAY RESULTADOS');
      }
    } catch (error) {
      console.error('Error en la solicitud a la API externa', error);
    }
  } else {
    results.value = []; // Limpiar resultados si no hay más de 3 caracteres
  }
};
</script> -->
<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Inertia } from '@inertiajs/inertia';

const formInput = ref('');
const answer = ref('');
const router = useRouter()
const results = ref([]);

// const searchSeries = async () => {
//   if (formInput.value.length > 3) {
//     try {
//       console.log(formInput.value)
//       // $inertia.replace(this.route('notes.index', {q:value}))
//       Inertia.get('search',formInput.value)

//     } catch (error) {
//       console.error('Error en la solicitud', error);
//     }
//   } else {

//   }
// };
const question = ref('')

const loading = ref(false)

// watch works directly on a ref
watch(formInput, async (newQuestion, oldQuestion) => {
  if (newQuestion.length > 3) {
    loading.value = true
    answer.value = 'Buscando series...'
    Inertia.visit('/buscador',{ name: newQuestion});
  //   try {
  //     // Hacer una solicitud al controlador de Laravel
  //     const res = await fetch(`/buscador?name=${newQuestion}`)
  //     if (res.ok) {
  //       const data = await res.json()
  //       answer.value = data.series
  //       console.log(data)
  //     } else {
  //       throw new Error('Error en la solicitud.')
      }
  //   } catch (error) {
  //     answer.value = 'Error! Could not reach the API. '
  //   }

  // }
})

</script>

<template>
  <form class="max-w-2xl m-4 mb-5 mt-5" action="#" method="get">
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
      Busca tu serie
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
        </svg>
      </div>
      <input type="search" id="default-search"
        class="block w-full p-4 ps-10 text-sm text-gray-900 border rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none mt-4"
        placeholder="Busca tu serie" v-model="formInput" required />
      <button type="submit"
        class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
        Buscar
      </button>
    </div>
  </form>
  <h2>{{ answer }}</h2>
</template>
