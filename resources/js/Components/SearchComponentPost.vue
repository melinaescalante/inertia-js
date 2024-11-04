<script>
import { router } from "@inertiajs/vue3";
export default {
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
                    // Usamos el método "reload" del router para refrescar la ruta de la vista "/buscador".
                    // https://inertiajs.com/manual-visits
                    router.reload({
                        // Le pasamos los datos que queremos que tenga en el query string.
                        data: { name: value },
                        // Manejamos los resultados en caso de éxito. Faltaría manejar en caso de error.
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
            // Al seleccionar una serie, actualizamos el campo de búsqueda
            this.formInput = item.show.name;
            // Limpiamos la lista de resultados
            this.localSeries = [];
            this.$emit("serie-seleccionada", item.show.name);
            // this.formInput = '';
        },
    },
};
</script>
<template>
    <div class="m-2">
       
        <input
            class="block w-full p-2 ps-10 text-sm text-gray-900 border rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none mt-4"
            type="text"
            v-model="formInput"
            @input="getAnswer(formInput)"
            placeholder="Buscar..."
        />
        <ul v-if="!loading && localSeries.length">
            <div class="relative">
                <li
                    class="p-2 ps-6 border flex items-center"
                    v-for="item in localSeries"
                    @click="selectResult(item)"
                >
                    <p class="ms-3 text-blue-400">{{ item.show.name }}</p>
                </li>
        
            </div>
        </ul>
    </div>
</template>
