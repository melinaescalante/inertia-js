import { onMounted, onUnmounted, ref } from "vue";
import { suscribeToAuthChanged } from "../../services/auth";
export function useLoginUser() {
    let unsubscribeFromAuth = () => { };
    const loginUser = ref({
        id: null,
        email: null,
        displayName: null,
        bio: null,
        genres:null
    });
    onMounted(() => {
        unsubscribeFromAuth = suscribeToAuthChanged(newUserData =>  loginUser.value = newUserData)
        console.log(loginUser.value)
    })
    onUnmounted(() => {
        unsubscribeFromAuth();
    })
    return{
        loginUser
    }
}