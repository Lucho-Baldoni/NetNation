<script setup>
import BaseButton from '../components/BaseButton.vue';
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseLabel from '../components/BaseLabel.vue';
import BaseAlert from '../components/BaseAlert.vue';
import { login } from '../services/auth';
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { dependencyGlobalFeedbackKey } from '../constants/dependency-keys';

const { updateGlobalFeedback } = inject(dependencyGlobalFeedbackKey);
const router = useRouter();

/**
 * Lógica del formulario de inicio de sesión.
 * @param {import('vue-router').Router} router - La instancia del router de Vue.
 * @returns {Object} - Un objeto que contiene el estado del formulario de inicio de sesión.
 * @property {Ref<Object>} formData - Objeto reactivo que contiene los datos del formulario.
 * @property {Ref<boolean>} loading - Indica si el formulario está en proceso de envío.
 * @property {Ref<string|null>} feedbackLogin - Mensaje de feedback para el usuario.
 * @property {Function} handleSubmit - Función para manejar el envío del formulario.
 */
 function useLoginForm(router) {
    const formData = ref({
        email: '',
        password: '',
    });
    const loading = ref(false);
    const feedbackLogin = ref(null);

    /**
     * Maneja el envío del formulario de inicio de sesión.
     * @returns {Promise<void>} - Devuelve una promesa que se resuelve cuando se completa el envío.
     */
    async function handleSubmit() {
        feedbackLogin.value = null;
        loading.value = true;

        try {
            await login({ ...formData.value });
            updateGlobalFeedback({
                message: "¡Hola de vuelta!",
                type: 'success',
            });
            router.push('/mi-perfil');
        } catch (error) {
            feedbackLogin.value = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
        } finally {
            const delay = new Promise(resolve => setTimeout(resolve, 3000)); 
            await delay;
            loading.value = false;
        }
    }

    return {
        formData,
        loading,
        feedbackLogin,
        handleSubmit,
    };
}

const { formData, loading, feedbackLogin, handleSubmit } = useLoginForm(router);
</script>

<template>
  <div>
    <BaseHeading1>Iniciar Sesión</BaseHeading1>
    <form @submit.prevent="handleSubmit">
      <BaseLabel for="email">Correo Electrónico</BaseLabel>
      <BaseInput v-model="formData.email" id="email" type="email" autocomplete="email" required />
      
      <BaseLabel for="password">Contraseña</BaseLabel>
      <BaseInput v-model="formData.password" id="password" type="password" autocomplete="current-password" required />
      
      <BaseButton :loading="loading" class="mt-4">Iniciar Sesión</BaseButton>
      
      <BaseAlert v-if="feedbackLogin">{{ feedbackLogin }}</BaseAlert>
    </form>
  </div>
</template>