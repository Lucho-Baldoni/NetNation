<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { editMyProfile, subscribeToAuthChanges } from '../services/auth';

let unsubscribeFromAuth = () => {}

/**
 * Componente para editar el perfil del usuario.
 */
export default {
    name: 'MyProfileEdit',
    components: { BaseHeading1 },
    data() {
        return {
            editData: {
                displayName: '',
                bio: '',
                career: '',
            },
            saving: false,
        }
    },
    methods: {
        /**
         * Maneja el envío del formulario para actualizar el perfil.
         * @returns {Promise<void>}
         */
        async handleSubmit() {
            if (this.saving) return;

            this.saving = true;

            try {
                await editMyProfile({
                    ...this.editData,
                });
            } catch (error) {
                // TODO: Manejar el error...
            }

            this.saving = false;
        },

        /**
         * Navega hacia atrás en el historial.
         */
        goBack() {
            this.$router.go(-1);
        }
    },
    mounted() {
        unsubscribeFromAuth = subscribeToAuthChanges(userData => {
            this.editData = {
                displayName: userData.displayName,
                bio: userData.bio,
                career: userData.career,
            }
        });
    },
    unmounted() {
        unsubscribeFromAuth();
    }
}
</script>

<template>
    <BaseHeading1>Editar Mi Perfil</BaseHeading1>

    <div class="bg-white p-4 shadow-lg rounded-lg">
        <form 
            action="#"
            @submit.prevent="handleSubmit"
        >
            <div class="mb-4">
                <label for="bio" class="block mb-2">Biografía</label>
                <textarea
                    id="bio"
                    class="w-full min-h-7 p-2 border border-gray-400 rounded read-only:bg-gray-200"
                    :readonly="saving"
                    v-model="editData.bio"
                ></textarea>
            </div>
            <div class="mb-4">
                <label for="displayName" class="block mb-2">Nombre de Usuario</label>
                <input
                    type="text"
                    id="displayName"
                    class="w-full p-2 border border-gray-400 rounded read-only:bg-gray-300"
                    :readonly="saving"
                    v-model="editData.displayName"
                >
            </div>
            <div class="mb-4">
                <label for="career" class="block mb-2">Carrera</label>
                <input
                    type="text"
                    id="career"
                    class="w-full p-2 border border-gray-400 rounded read-only:bg-gray-200"
                    :readonly="saving"
                    v-model="editData.career"
                >
            </div>
            <div class="flex justify-between">
                <button
                    type="submit"
                    class="py-2 px-4 text-black rounded bg-[#07DBA8] hover:bg-[#05b58b] focus:bg-blue-500 active:bg-blue-900 "
                >
                    {{ !saving ? 'Actualizar Mi Perfil' : 'Grabando cambios...' }}
                </button>
                <button
                    type="button"
                    @click="goBack"
                    class="py-2 px-4 rounded bg-gray-700 hover:bg-gray-500 focus:bg-gray-500 active:bg-gray-900 text-white"
                >
                    Volver
                </button>
            </div>
        </form>
    </div>
</template>

