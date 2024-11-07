<script>
import Spinner from './Spinner.vue'
import { router } from "@inertiajs/vue3";
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
        async getAnswer(value) {
            if (value.length % 2 == 0) {
                this.loading = true;
                this.answer = "Buscando series...";
                try {
                  
                    router.reload({
                  
                        data: { name: value },
                        
                        onSuccess: (page) => {
                            if (this.series.length > 0) {
                                this.answer = "Success";
                            } else {
                                this.answer = "No se encontraron series.";
                            }
                            this.loading = false;
                        },
                    });
                } catch (error) {
                    this.answer = "Error al buscar series.";
                    this.loading = false;
                }
            }
        },
        selectResult(item) {
            this.formInput = item.show.name;
            this.localSeries = [];
            this.$emit("serie-seleccionada", item.show.name);
        },
    },
};
</script>
<template>
    <div class="m-2">
        <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Spinner v-if="loading"></Spinner>
                <svg v-else class="w-6 h-6 text-gray-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M19.003 3A2 2 0 0 1 21 5v2h-2V5.414L17.414 7h-2.828l2-2h-2.172l-2 2H9.586l2-2H9.414l-2 2H3V5a2 2 0 0 1 2-2h14.003ZM3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3Zm2-2.414L6.586 5H5v1.586Zm4.553 4.52a1 1 0 0 1 1.047.094l4 3a1 1 0 0 1 0 1.6l-4 3A1 1 0 0 1 9 18v-6a1 1 0 0 1 .553-.894Z" clip-rule="evenodd"/>
</svg>

            </div>
            <input type="search" id="default-search"
                class="block w-full p-4 ps-12  text-gray-900 border rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none mt-4 "
                v-model="formInput" @input="getAnswer(formInput)" placeholder="Buscar..." required/>


        </div>
        <ul v-if="!loading && localSeries.length">
            <div class="relative">
                <li class="p-2 ps-6 border flex items-center" v-for="item in localSeries" @click="selectResult(item)">
                    <p class="ms-3 text-blue-400 cursor-pointer">{{ item.show.name }}</p>
                </li>

            </div>
        </ul>
    </div>
</template>
