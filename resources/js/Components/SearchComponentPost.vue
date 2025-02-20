<script>
import Spinner from './Spinner.vue'
import { router } from "@inertiajs/vue3";
let debounceTimeout;

export default {
    components: {
        Spinner
    },
    props: {
        series: {
            type: Array,
            default: () => [],
        },
        refreshCount: {
            type: Number,
        }
    },
    data() {
        return {
            formInput: "",
            formInputES: "",
            answer: "",
            loading: false,
            localSeries: [],
        };
    },
    watch: {
        series: {
            handler(newVal) {
                this.localSeries = [...newVal];
            },
        },
        refreshCount: {
            handler(newVal) {
                this.formInput = '';
            }
        }
    },
    methods: {
        //Nos permite realizar bsuqueda cuando el usuario deja de escribir, y si sigue escribiendo se anula la anterior petición y sigue con la más nueva
        debounce(fn, delay) {
            return (...args) => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => fn(...args), delay);
            };
        },
        async translateToEnglish(text) {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`);
            const data = await response.json();
            return data.responseData.translatedText;
        },

        async fetchSeries(value) {
            if (this.loading) return;
            //Si sacamos espacios en blanco y no tiene valor retornamos
            if (!value.trim()) {
                this.answer = '';
                return;
            }

            this.loading = true;
            this.answer = 'Buscando usuarios...';
            const translatedValue = await this.translateToEnglish(value);
            
            try {
                router.reload({
                    data: { name: translatedValue },
                    onSuccess: (page) => {
                        if (!this.series.length > 0) {
                            this.answer = "No se encontraron series.";
                        }
                        if (this.series.length === 0) {
                            this.answer = "";
                        }
                        this.loading = false;
                    },
                });
            } catch (error) {
                this.answer = "Error al buscar series.";
                this.loading = false;
            }
        },
        async selectResult(item) {
        
             this.formInput = item.show.name;
            this.localSeries = [];
            this.$emit("id-serie-seleccionada", item.show.id)
            this.$emit("serie-seleccionada",item.show.name);
        },
        handleInput(value) {
            this.debounce(this.fetchSeries, 300)(value);
            // Delay de medio segundo
        },
    },
};
</script>
<template>
    <div class="m-2 ">
        <div class="relative ">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Spinner v-if="loading"></Spinner>
                <svg v-else class="w-6 h-6 text-gray-600 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                    fill="#ffcc99" viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                        d="M19.003 3A2 2 0 0 1 21 5v2h-2V5.414L17.414 7h-2.828l2-2h-2.172l-2 2H9.586l2-2H9.414l-2 2H3V5a2 2 0 0 1 2-2h14.003ZM3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3Zm2-2.414L6.586 5H5v1.586Zm4.553 4.52a1 1 0 0 1 1.047.094l4 3a1 1 0 0 1 0 1.6l-4 3A1 1 0 0 1 9 18v-6a1 1 0 0 1 .553-.894Z"
                        clip-rule="evenodd" />
                </svg>

            </div>
            <label for="default-search" class="sr-only">Buscá tu serie</label>
            <input type="search" id="default-search"
                class="block w-full p-4 ps-12  text-gray-900 border rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none mt-4 skiptranslate"
                v-model="formInput" @input="handleInput(formInput)" placeholder="Buscar serie..." required />


        </div>
        <ul v-if="!loading && localSeries.length">
            <div class="relative">
                <li class="p-2 ps-6 border flex items-center" v-for="item in localSeries" @click="selectResult(item)">
                    <p class="ms-3 text-blue-400 cursor-pointer">{{ item.show.name }}</p>
                </li>

            </div>
        </ul>

        <div v-if="answer === 'No se encontraron series.'"
            class="flex flex-col justify-center items-center bg-red-200 p-4 m-2 rounded-md">

            <p>{{ answer }}</p>
        </div>
    </div>
</template>
