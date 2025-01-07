<script>
import { router } from '@inertiajs/vue3';
import Spinner from './Spinner.vue';
import { Link, usePage } from '@inertiajs/vue3';
import { useLoginUser } from '../composables/useLoginUser';

let debounceTimeout;

export default {
  components: {
    Spinner,
    Link
  },
  props: {
    series: {
      type: Array,
      default: () => []
    },
  },
  data() {
    const page = usePage()
    const currentPage = page.component
    return {
      formInput: '',
      answer: '',
      currentPage,

      loading: false,
      loginUser: null,
    };
  }, created() {
    const { loginUser } = useLoginUser(); // Usar el composable
    this.loginUser = loginUser; // Asignar a una propiedad de data
  },
  methods: {
    debounce(fn, delay) {
      return (...args) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => fn(...args), delay);
      };
    },
    async translateToEnglish(text) {
      // Simula un traductor o usa un servicio de API para traducción
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`);
      const data = await response.json();
      return data.responseData.translatedText;
    },

    async fetchSeries(value) {
      if (this.loading) return;

      if (!value.trim()) {
        this.answer = '';
        return;
      }

      this.loading = true;
      this.answer = 'Buscando series...';
      const translatedValue = await this.translateToEnglish(value);
      try {
        router.reload({
          data: { name: translatedValue },
          onSuccess: (page) => {
            if (!this.series.length) {
              this.answer = 'No se encontraron series.';
            } else {
              this.answer = '';
            }
            this.loading = false;
          },
        });
      } catch (error) {
        this.answer = 'Error al buscar series.';
        this.loading = false;
      }
    },
    handleInput(value) {
      this.debounce(this.fetchSeries, 500)(value);
      // Delay de medio segundo
    },
    handleSubmit() {
      this.fetchSeries(this.formInput);
    }
  }
};
</script>
<template>
  <section class="mt-20" id="buscador">


  <form @submit.prevent="handleSubmit" class="max-w-2xl m-4 mt-5" method="get">
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only ">
      Busca tu serie
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
        </svg>
      </div>
      <input type="search" id="default-search"
        class="block w-full p-4 ps-10 text-sm text-gray-900 border rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none mt-4"
        placeholder="Busca tu serie" required v-model="formInput" @input="handleInput(formInput)" />

      <button type="submit"
        class="text-blue-1000 absolute end-2.5 bottom-2.5 bg-blue-0 hover:bg-blue-800 hover:text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
        Buscar
      </button>
    </div>
  </form>
  <div class="flex gap-4 flex-wrap justify-center mb-3 skiptranslate">
    <Link href="/buscador" class="border  rounded-lg px-2 py-1"
      :class="currentPage === 'SearchView' ? 'bg-blue-1000 text-white border-blue-1000 font-normal' : 'text-black bg-white border-blue-0 '">
    Series</Link>
    <Link v-show="loginUser.id" href="/buscadorUsuarios" class="border rounded-lg border-blue-0 px-2 py-1">Personas
    </Link>
  </div>
  <div v-if="loading" class="flex flex-col justify-center items-center mb-2 skiptranslate">

    <p>{{ answer }}</p>
    <Spinner msg="Buscando series"></Spinner>
  </div>

  <ul v-if="!loading && series.length">

    <li class="p-2 ps-6 border flex items-center " v-for="item in series">
      <img class="h-[100%] w-12" :src="item.show.image ? item.show.image.medium : 'noimage.png'" :alt="item.show.name">
      <div class="flex flex-col">

        <Link :href="`/show/${item.show.id}`" class="ms-3 font-medium block"> {{ item.show.name }}</Link>
        <div class="flex">

          <p v-for="genre in item.show.genres" class="ms-3 text-blue-400 ">{{ genre }}</p>
        </div>
      </div>
    </li>

  </ul>
  <div v-if="!loading && answer == 'No se encontraron series.'" class="p-4 m-2 bg-red-200 rounded-md">
    <p>{{ answer }}</p>
  </div>
  </section>
</template>
