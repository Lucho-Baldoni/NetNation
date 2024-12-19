import { ref, onMounted } from 'vue';
import { getUserProfileById } from '../services/user-profiles';

/**
 * Composable para manejar la carga del perfil de un usuario.
 * @param {string} id - El ID del usuario cuyo perfil se desea cargar.
 * @returns {Object} - Un objeto que contiene el estado del perfil del usuario.
 * @property {Ref<Object>} user - Un objeto reactivo que contiene la información del perfil del usuario.
 * @property {Ref<boolean>} loadingUser  - Un objeto reactivo que indica si se está cargando la información del usuario.
 */
export default function useUserProfile(id) {
    const user = ref({
        id: null,
        email: null,
        displayName: null,
        photoURL: null,
        bio: null,
        career: null,
    });
    const loadingUser  = ref(false);

    onMounted(async () => {
        loadingUser .value = true;
        user.value = await getUserProfileById(id);
        loadingUser .value = false;
    });

    return {
        loadingUser ,
        user,
    };
}