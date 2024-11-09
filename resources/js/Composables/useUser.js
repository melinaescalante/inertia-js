import { onMounted, onUnmounted } from "vue";
import { getUsersProfileById } from "../../services/users";
import { ref } from "vue";

export  function useUser(id, email, username) {

    // const name = ref(await getUserName(id));
    const user = ref({
        id: null,
        email: null,
        displayName: username,
        bio: null,
        genres: null,
        photoURL: null
    });
    // const loading = ref(true);
    onMounted(async () => {
        user.value = await getUsersProfileById(          id,email,displayName,
        );
        // loading.value = false;
        console.log(user)
        
    });

    return { user };
}
