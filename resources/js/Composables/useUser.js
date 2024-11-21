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

    const loadUserProfile = async () => {
        user.value = await getUsersProfileById(id, email, displayName);
        return user.value
    };
    onMounted(() => {
        loadUserProfile();
    });

    return { user };
}
