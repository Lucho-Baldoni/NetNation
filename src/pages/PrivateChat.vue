<script setup>
import BaseHeading1 from '../components/BaseHeading1.vue';
import BaseLoader from '../components/BaseLoader.vue';
import useAuth from '../composables/useAuth';
import useUserProfile from '../composables/useUserProfile';
import { savePrivateChatMessage, subscribeToPrivateChatMessages } from '../services/private-chat';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { formatDate } from '../libraries/date';
import { onUnmounted } from 'vue';

const route = useRoute();

const { loggedUser } = useAuth();
const { user, loadingUser } = useUserProfile(route.params.id);
const { newMessage, handleSubmit } = usePrivateChatForm(loggedUser.value.id, route.params.id);
const { messages, loadingMessages } = usePrivateChatMessages(loggedUser.value.id, route.params.id);

/**
 * Composable para manejar los mensajes del chat privado.
 * @param {string} senderId - ID del usuario que envía el mensaje.
 * @param {string} receiverId - ID del usuario que recibe el mensaje.
 * @returns {Object} - Un objeto que contiene los mensajes y el estado de carga.
 * @property {Ref<Array>} messages - Mensajes del chat.
 * @property {Ref<boolean>} loadingMessages - Indica si se están cargando los mensajes.
 */
function usePrivateChatMessages(senderId, receiverId) {
    const messages = ref([]);
    const loadingMessages = ref(true);

    let unsubscribe = () => {};

    async function fetchMessages() {
        unsubscribe = await subscribeToPrivateChatMessages(
            senderId,
            receiverId,
            newMessages => {
                loadingMessages.value = false;
                messages.value = newMessages;
            }
        );
    }
    fetchMessages();

    onUnmounted(unsubscribe);

    return {
        messages,
        loadingMessages,
    };
}

/**
 * Composable para manejar el formulario de mensajes del chat privado.
 * @param {string} senderId - ID del usuario que envía el mensaje.
 * @param {string} receiverId - ID del usuario que recibe el mensaje.
 * @returns {Object} - Un objeto que contiene el nuevo mensaje y la función para enviarlo.
 * @property {Ref<Object>} newMessage - Objeto reactivo que contiene el texto del nuevo mensaje.
 * @property {Function} handleSubmit - Función para enviar el mensaje.
 */
function usePrivateChatForm(senderId, receiverId) {
    const newMessage = ref({
        text: '',
    });

    /**
     * Maneja el envío del nuevo mensaje.
     * @returns {Promise<void>}
     */
    async function handleSubmit() {
        try {
            await savePrivateChatMessage(
                senderId,
                receiverId,
                newMessage.value.text
            );
            newMessage.value.text = '';
        } catch (error) {
            console.error('[PrivateChat handleSubmit] Error al grabar el mensaje privado. ', error);
        }
    }

    return {
        newMessage,
        handleSubmit,
    };
}
</script>

<template>
    <div 
        v-if="loadingUser || loadingMessages"
        class="flex justify-center p-4"
    >
        <BaseLoader />
    </div>
    <template v-else>
        <BaseHeading1 class="text-center mb-4">Chat Privado con {{ user.email }}</BaseHeading1>

        <section class="mb-4">
            <h2 class="sr-only">Mensajes</h2>

            <div class="min-h-[300px] p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-md overflow-y-auto">
                <ul class="flex flex-col items-start gap-4">
                    <li
                        v-for="message in messages"
                        :key="message.id"
                        class="p-4 rounded-lg transition duration-200"
                        :class="{
                            'bg-gray-200 text-gray-800 shadow-md': message.user_id !== loggedUser.id,
                            'bg-blue-200 text-gray-800 self-end shadow-md': message.user_id === loggedUser.id,
                        }"
                    >
                        <div class="font-semibold">{{ message.user_id === loggedUser.id ? 'Tú' : user.email }}</div>
                        <div class="text-gray-700">{{ message.text }}</div>
                        <div class="text-xs text-gray-500 mt-1">{{ formatDate(message.created_at) || 'Enviando...' }}</div>
                    </li>
                </ul>
            </div>
        </section>
        <form 
            action="#"
            class="flex gap-4 items-stretch mt-4"
            @submit.prevent="handleSubmit"
        >
            <textarea
                id="text"
                class="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                aria-label="Mensaje"
                placeholder="Escribir..."
                v-model="newMessage.text"
            ></textarea>
            <button
                type="submit"
                class="py-2 px-4 text-black rounded-lg bg-[#07DBA8]  hover:bg-[#05b58b] transition duration-200"
            >Enviar</button>
        </form>
    </template>
</template>