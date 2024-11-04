<script>
import Spinner from './Spinner.vue';
import { getUsers } from '../../services/users';

export default {
  components: {
    Spinner
  },
  data() {
    return {
      formInput: '',
      answer: '',
      loading: false,
      users: []  // Mover users a data si va a ser dinámico
    };
  },
  methods: {
    async getAnswer(value) {
      if (value) {
        this.loading = true;
        this.answer = 'Buscando usuarios...';
        try {
          const users = await getUsers(value, (array) => {
            this.users = array
            console.log(this.users)
          });
          if (this.users) {
            this.users = users;
            this.loading = false;

          } else {
            this.answer = "No se encontraron usuarios.";
          }
        } catch (error) {
          this.answer = 'Error al buscar usuarios.';
          console.error(error);
          this.loading = false;
        }
      }
    },
    handleSubmit() {
      this.getAnswer(this.formInput);
    }
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="max-w-2xl m-4 mb-5 mt-5" method="get">
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
      Busca a tus amigos
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
        placeholder="Busca a tus amigos" required v-model="formInput" @input="getAnswer(formInput)" />

      <button type="submit"
        class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
        Buscar
      </button>
    </div>
  </form>
  <div v-if="loading" class="flex flex-col justify-center items-center">

    <p>{{ answer }}</p>
    <Spinner msg="Buscando usuarios"></Spinner>
  </div>
  <ul v-if="!loading && users.length">

    <li class="p-2 ps-6 border flex items-center" v-for="user in users">
      <img class="h-[100%] w-12" :src="user.photoURL ? user.photoURL : 'noimage.png'" :alt="user.displayName">
      <div class="flex flex-col">

        <a :href="`/perfil/${user.id}`" class="ms-3 font-medium block"> {{ user.displayName }}</a>
        <div class="flex">

          <p v-for="genre in user.genres" class="ms-3 text-blue-400 ">{{ genre }}</p>
        </div>
      </div>
    </li>

  </ul>
  <div v-if="!loading && answer == 'No se encontraron usuarios.'" class="p-4 m-2 bg-red-200 rounded-md">
    <p>{{ answer }}</p>
  </div>

</template>
