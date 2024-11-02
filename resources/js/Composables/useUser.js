import { onMounted } from "vue";
import { getUsersProfileById } from "../../services/users";
import { ref } from "vue";

export function useUser(id,email) {

    const user = ref({
        id: null,
        email: null,
        displayName: null,
        bio: null,
        genres: null,
    });
    const loading = ref(true)
    onMounted(async () => {
        user.value = await getUsersProfileById(id, email)
        loading.value = false
    });
    return {user,loading}
}