import { onUnmounted, ref } from "vue";
import { subscribeToAuthChanges } from "../services/auth";

/**
 * Composable para manejar la autenticación del usuario.
 * @returns {Object} - Un objeto que contiene el estado del usuario autenticado.
 * @property {Ref<Object>} loggedUser  - Un objeto reactivo que contiene la información del usuario autenticado.
 */
export default function useAuth() {
    const loggedUser  = ref({
        id: null,
        email: null,
        displayName: null,
        bio: null,
        career: null,
        photoURL: null,
    });

    /**
     * Suscribe a los cambios de autenticación del usuario.
     * @param {Function} newUser Data - Callback que se ejecuta cuando hay un cambio en los datos del usuario.
     */
    let unsubscribeFromAuth = subscribeToAuthChanges(newUserData => {
        loggedUser .value = newUserData;
    });

    onUnmounted(() => {
        unsubscribeFromAuth();
    });

    return {
        loggedUser ,
    };
}