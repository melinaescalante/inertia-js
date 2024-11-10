import { ref, onMounted } from "vue";
import { getUsersProfileById } from "../../services/users";

export function useUser(id, email, displayName) {
    const user = ref({
        id: null,
        email: null,
        displayName: null,
        bio: null,
        genres: null,
        photoURL: null
    });

    // Función asíncrona separada para cargar el perfil
    const loadUserProfile = async () => {
        user.value = await getUsersProfileById(id, email, displayName);
        console.log("Perfil cargado:", user.value);
    };

    // Llamamos a la función asíncrona dentro de onMounted sin await
    onMounted(() => {
        loadUserProfile();
    });

    return { user };
}
