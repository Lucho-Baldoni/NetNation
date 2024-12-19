<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { editMyProfilePhoto } from '../services/auth';

/**
 * Componente para editar la foto de perfil del usuario.
 */
export default {
    name: 'MyProfileEditPhoto',
    components: { BaseHeading1 },
    data() {
        return {
            editData: {
                photo: null,
                photoPreview: null,
            },
            saving: false,
        }
    },
    methods: {
        /**
         * Maneja el envío del formulario para actualizar la foto de perfil.
         * @returns {Promise<void>}
         */
        async handleSubmit() {
            this.saving = true;

            try {
                await editMyProfilePhoto(this.editData.photo);
            } catch (error) {
                // TODO: Manejar el error...
            }

            this.saving = false;
        },

        /**
         * Maneja la selección de un archivo de imagen.
         * @param {Event} ev - El evento de cambio del input de archivo.
         */
        handleFileSelection(ev) {
            this.editData.photo = ev.target.files[0];

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.editData.photoPreview = reader.result;
            });

            reader.readAsDataURL(this.editData.photo);
        },

        /**
         * Navega hacia atrás en el historial.
         */
        goBack() {
            this.$router.go(-1);
        }
    }
}
</script>

<template>
    <BaseHeading1>Editar mi Foto de Perfil</BaseHeading1>

    <div class="container bg-white p-6 shadow-lg rounded-lg">
        <div class="flex gap-4 items-start">
            <form
                action="#"
                class="w-1/2"
                @submit.prevent="handleSubmit"
            >
                <div class="mb-4">
                    <label for="photo" class="block mb-2">Nueva Foto</label>
                    <input
                        type="file"
                        id="photo"
                        class="w-full p-2 border border-gray-400 rounded"
                        @change="handleFileSelection"
                    >
                </div>
                <div class="mb-4 flex gap-2">
                    <button
                        type="submit"
                        class="py-2 px-4 text-black rounded bg-[#07DBA8] hover:bg-[#05b58b]"
                    >
                        {{ !saving ? 'Actualizar Mi Foto' : 'Grabando cambios...' }}
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
            <div class="w-1/2 flex flex-col items-center">
                <h2>Previsualización</h2>
                <img
                    v-if="editData.photoPreview"
                    :src="editData.photoPreview"
                    alt="Previsualización de la foto"
                    class="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                >
                <p v-else class="text-gray-500">No hay imagen seleccionada</p> 
            </div>
        </div>
    </div>
</template>



<style scoped>
.container {
    padding: 1.5rem;
}

.flex {
    gap: 1.5rem;
}
</style>