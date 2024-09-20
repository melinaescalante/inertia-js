<!-- <script>
export default {
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
  watch: {
    formInput(value) {
      if (value.length >= 2) {
        this.getAnswer(value);
      }
    }
  },
methods: {
  async getAnswer(value) {
    this.loading = true;

    try {
      this.$inertia.replace(`/buscador?name=${value}`, {
        onFinish: () => {
          this.loading = false; // Esto asegurará que el estado loading se actualice cuando la llamada termine
        }
      });
    } catch (error) {
      console.error('Error al buscar series:', error);
      this.loading = false; // Asegurarte de que el estado loading cambie incluso si hay un error
    }
  }
}

}
</script> -->
<script setup>
import { ref, watch, onMounted } from 'vue'
import { usePage, router } from '@inertiajs/vue3' 

const { props } = usePage()
const seriesArray =ref([])

const formInput = ref('')
const response = ref('')
const loading = ref(false)
const series = ref([]) 

onMounted(() => {
  series.value = seriesArray.value || []
  seriesArray.value= props.seriesArray
  console.log(props.seriesArray)

})

watch(formInput, (newValue) => {
  if (newValue.length % 2 == 0) {
    getAnswer(newValue)
  }
})

const getAnswer = async (value) => {
  loading.value = true
  response.value = "Buscando series"

  try {
    response.value = "Buscando series.."
    router.replace(`/buscador?name=${value}`, {
      onFinish: () => {
        seriesArray.value = props.seriesArray 
        series.value = seriesArray.value || []
        loading.value = false
        response.value = series.value.length ? '' : "No se encontraron series"
        console.log(props.seriesArray)
      }
    })
  } catch (error) {
    response.value = "Error al buscar series"
    console.error('Error al buscar series:', error)
    loading.value = false
  }
}
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
  <div v-if="loading">{{ response }}</div>
  <div v-else-if="series.length == 0">{{response}}</div>
  <ul v-if="!loading && series.length">
    <li v-for="show in series">{{ show.name }}</li>
  </ul>

</template>