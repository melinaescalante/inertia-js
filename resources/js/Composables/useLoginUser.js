import { onMounted, onUnmounted, ref } from "vue";
import { suscribeToAuthChanged } from "../../services/auth";
export function useLoginUser() {
    let unsubscribeFromAuth = () => { };
    const loginUser = ref({
        id: null,
        email: null,
        displayName: null,
        bio: null,
        genres: null,
        photoURL: null
    });
    onMounted(() => {
        unsubscribeFromAuth = suscribeToAuthChanged(newUserData => loginUser.value = newUserData)
    })
    onUnmounted(() => {
        unsubscribeFromAuth();
    })
    return {
        loginUser
    }
}