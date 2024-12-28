<script>
import Spinner from './Spinner.vue';
import { getUsers } from '../../services/users';
import { Link, usePage } from '@inertiajs/vue3';
const page = usePage()
const currentPage = page.component
export default {
  components: {
    Spinner,
    Link,
  },
  data() {
    const page = usePage();
    const currentPage = page.component; 

    return {
      formInput: '',
      answer: '',
      loading: false,
      users: [],
      currentPage, 
    };
  },
  methods: {
    async getAnswer(value) {
      if (value) {
        this.loading = true;
        this.answer = 'Buscando usuarios...'; 
        this.users = [];  
        try {
          
          await getUsers(value, (array) => {
            this.users = array;
            this.loading = false;
            
            if (this.users.length === 0) {
              this.answer = "No se encontraron usuarios.";
            }
            if (this.formInput.length===0) {
                            this.answer = "";

                        }
          });
        } catch (error) {
          this.answer = 'Error al buscar usuarios.';
          console.error(error);
          this.loading = false;
        }
      } else {
        this.users = []; 
        this.answer = ''; 
      }
    },
    handleSubmit() {
      this.getAnswer(this.formInput);
    },
  },
};
</script>


<template>
  <form @submit.prevent="handleSubmit" class="max-w-2xl m-4 mt-5" method="get">
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only ">
      Busca a tus amigos
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
        </svg>
      </div>
      <label for="default-search" class="sr-only">Buscá a tus amigos</label>
      <input type="search" id="default-search"
        class="block w-full p-4 ps-10 text-sm text-gray-900 border rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none mt-4"
        placeholder="Busca a tus amigos" required v-model="formInput" @input="answer = ''; getAnswer(formInput)" />

      <button type="submit"
        class="text-blue-1000 absolute end-2.5 bottom-2.5 bg-blue-0 hover:bg-blue-800  hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
        Buscar
      </button>
    </div>
  </form>
  <div class="flex gap-4 flex-wrap justify-center">
        <Link href="/buscador" class="border  rounded-lg border-blue-0 px-2 py-1">Series</Link>
        <Link href="/buscadorUsuarios" :class="currentPage === 'SearchUsersView' ? 'bg-blue-1000 text-white border-blue-1000 font-normal' : 'text-black bg-white border-blue-0 '" class="border rounded-lg px-2 py-1" >Personas</Link>
    </div>
  <div v-if="loading && answer === 'Buscando usuarios...'" class="flex flex-col justify-center items-center">

    <p>{{ answer }}</p>
    <Spinner msg="Buscando usuarios"></Spinner>
  </div>
  <div v-if="!loading && answer === 'No se encontraron usuarios.'" class="p-4 m-2 bg-red-200 rounded-md">
    <p>{{ answer }}</p>
  </div>
  <ul class="mb-2 skiptranslate" v-if="!loading && users?.length">

    <li class="p-2 ps-6 border flex items-center" v-for="user in users">
      <img class="h-[100%] w-12" :src="user.photoURL ? user.photoURL : 'noimage.png'" :alt="user.username">
      <div class="flex flex-col">

        <Link :href="`/perfil/${user.id}`" class="ms-3 font-medium block"> @{{ user.username }}</Link>
        <div class="flex ms-2 flex-wrap">

          <p v-for="genre in user.genres"  class="rounded-xl bg-opacity-70   border border-orange-0 text-blue-1000 text-sm  font-normal py-0 px-1 m-1 text-center"> {{Object.values(genre)[0]}}</p>
        </div>
      </div>
    </li>

  </ul>

</template>
