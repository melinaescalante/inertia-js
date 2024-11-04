<script>
import { router } from '@inertiajs/vue3';
import Spinner  from './Spinner.vue'
export default {
  components: {
    Spinner
  },
  props: {
    series: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      formInput: '',
      answer: '',
      loading: false
    };
  },
  methods: {
    async getAnswer(value) {
      if (value.length % 2 == 0) {
        this.loading = true;
        this.answer = 'Buscando series...';
        try {
          // Usamos el método "reload" del router para refrescar la ruta de la vista "/buscador".
          // https://inertiajs.com/manual-visits
          router.reload({
            // Le pasamos los datos que queremos que tenga en el query string.
            data: { name: value},
            // Manejamos los resultados en caso de éxito. Faltaría manejar en caso de error.
            onSuccess: page => {
              if (!this.series.length > 0) {
                this.answer = "No se encontraron series.";
              }
              this.loading = false;
            },

          });
        } catch (error) {
          this.answer = 'Error al buscar series.';
          this.loading = false;
        }

      }
    },
    handleSubmit() {
      this.getAnswer(this.formInput); 
    }
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit" class="max-w-2xl m-4 mb-5 mt-5" method="get">
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
        placeholder="Busca tu serie"  required v-model="formInput" @input="getAnswer(formInput)" />
      
        <button type="submit"
        class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2" >
        Buscar
      </button>
    </div>
  </form>
  <div v-if="loading" class="flex flex-col justify-center items-center">

    <p>{{ answer }}</p>
<Spinner msg="Buscando series"></Spinner>
  </div>
  <ul v-if="!loading && series.length">

    <li class="p-2 ps-6 border flex items-center" v-for="item in series">
    <img class="h-[100%] w-12" :src="item.show.image ? item.show.image.medium : 'noimage.png'" :alt="item.show.name">  
    <div class="flex flex-col">
      
      <a :href="`/show/${item.show.id}`" class="ms-3 font-medium block">  {{ item.show.name }}</a>
      <div class="flex">

        <p v-for="genre in item.show.genres" class="ms-3 text-blue-400 ">{{ genre }}</p>
      </div>
    </div>
    </li>

  </ul>
  <div v-if="!loading && answer == 'No se encontraron series.'" class="p-4 m-2 bg-red-200 rounded-md">
    <p>{{ answer }}</p>
  </div>

</template>
