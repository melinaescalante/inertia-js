import { onMounted } from "vue";
import { getUsersProfileById, getUserName } from "../../services/users";
import { ref } from "vue";

export function useUser(id,email) {
const displayName=ref( getUserName(id))
    const user = ref({
        id: null,
        email: null,
        displayName: displayName.value,
        bio: null,
        genres: null,
    });
    const loading = ref(true)
    onMounted(async () => {
        user.value = await getUsersProfileById(id, email,user.value.displayName)
        loading.value = false
    });
    return {user,loading}
}