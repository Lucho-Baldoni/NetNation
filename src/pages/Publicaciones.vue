<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { subscribeToAuthChanges } from '../services/auth';
import { savePublicPost, subscribeToPublicPosts, saveComment, subscribeToComments, updatePost } from '../services/public-posts';
import '../style.css';

let unsubscribeFromAuth = () => {}

export default {
    name: 'Publicaciones',
    components: { BaseHeading1 },
    data() {
        return {
            posts: [],
            newPost: {
                text: '',
                image: '',
            },
            newComment: {},
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                bio: null,
                career: null,
            },
            loading: true,
            showForm: false,
            editingPost: null,
        };
    },
    methods: {
        /**
         * Formatea la fecha a un formato legible.
         * @param {string} timestamp - La marca de tiempo a formatear.
         * @returns {string} La fecha formateada.
         */
        formatDate(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        },

        /**
         * Maneja el envío del formulario para crear o editar una publicación.
         */
        async handleSubmit() {
            if (!this.newPost.text.trim()) {
                alert("El texto de la publicación no puede estar vacío.");
                return;
            }
            try {
                const postData = {
                    user_id: this.loggedUser.id,
                    email: this.loggedUser.email,
                    text: this.newPost.text,
                    image: this.newPost.image,
                    createdAt: new Date().toISOString(),
                    comments: [],
                };

                if (this.editingPost) {
                    const existingPost = this.posts.find(post => post.id === this.editingPost.id);
                    if (existingPost) {
                        postData.likes = existingPost.likes;
                    }
                    await updatePost(this.editingPost.id, postData);
                    const index = this.posts.findIndex(post => post.id === this.editingPost.id);
                    this.posts[index] = { ...this.editingPost, ...postData };
                    this.editingPost = null;
                } else {
                    const savedPost = await savePublicPost(postData);
                    this.posts.unshift({ ...savedPost, comments: [] });
                }

                this.newPost.text = "";
                this.newPost.image = "";
                this.toggleForm();
            } catch (error) {
                console.error("Error al guardar la publicación:", error);
                alert("Ocurrió un error al guardar la publicación.");
            }
        },

        /**
         * Agrega un comentario a una publicación.
         * @param {string} postId - El ID de la publicación a la que se agregará el comentario.
         */
        async addComment(postId) {
            const commentText = this.newComment[postId];
            if (!commentText) {
                alert("El comentario no puede estar vacío.");
                return;
            }

            try {
                const newCommentData = {
                    post_id: postId,
                    text: commentText,
                    user_id: this.loggedUser.id,
                    email: this.loggedUser.email,
                    createdAt: new Date().toISOString(),
                };

                await saveComment(newCommentData);
                this.newComment[postId] = "";
            } catch (error) {
                console.error("Error al guardar el comentario:", error);
                alert("Ocurrió un error al guardar el comentario.");
            }
        },

        /**
         * Maneja la carga de una imagen desde el dispositivo.
         * @param {Event} event - El evento de cambio del input de archivo.
         */
        async handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.newPost.image = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        /**
         * Carga los comentarios de una publicación específica.
         * @param {string} postId - El ID de la publicación para la que se cargarán los comentarios.
         */
        async loadComments(postId) {
            subscribeToComments(postId, (comments) => {
                const post = this.posts.find(p => p.id === postId);
                if (post) {
                    post.comments = comments;
                }
            });
        },

        /**
         * Alterna la visibilidad del formulario de creación/edición de publicaciones.
         */
        toggleForm() {
            this.showForm = !this.showForm;
        },

        /**
         * Alterna el estado de "me gusta" de una publicación.
         * @param {string} postId - El ID de la publicación a la que se le cambiará el estado de "me gusta".
         */
        async toggleLike(postId) {
            const post = this.posts.find(p => p.id === postId);
            if (!post) return;

            if (!post.likes) {
                post.likes = [];
            }

            const userIndex = post.likes.indexOf(this.loggedUser.id);
            if (userIndex === -1) {
                post.likes.push(this.loggedUser.id);
            } else {
                post.likes.splice(userIndex, 1);
            }

            try {
                await updatePost(post.id, { likes: post.likes });
            } catch (error) {
                console.error("Error al actualizar los likes:", error);
                alert("Ocurrió un error al actualizar los likes.");
            }
        },

        /**
         * Inicia el proceso de edición de una publicación.
         * @param {Object} post - La publicación que se va a editar.
         */
        editPost(post) {
            this.editingPost = post;
            this.newPost.text = post.text;
            this.newPost.image = post.image;
            this.showForm = true;
        },

        /**
         * Cancela la edición de una publicación y restablece el formulario.
         */
        cancelEdit() {
            this.editingPost = null;
            this.newPost.text = "";
            this.newPost.image = "";
            this.showForm = false;
        }
    },

    /**
     * Carga las publicaciones y sus comentarios al montar el componente.
     */
    async mounted() {
        subscribeToPublicPosts((newPosts) => {
            this.posts = newPosts.reverse();
            this.loading = false;

            newPosts.forEach(post => {
                this.loadComments(post.id);
            });
        });

        unsubscribeFromAuth = subscribeToAuthChanges(newUserData => this.loggedUser = newUserData);
    },

    /**
     * Limpia la suscripción de cambios de autenticación al desmontar el componente.
     */
    unmounted() {
        unsubscribeFromAuth();
    }
}
</script>

<template>
    <BaseHeading1 class="sr-only">Publicaciones</BaseHeading1>

    <div>
        <div v-if="showForm" class="dark-background"></div>
        <div class="flex flex-col items-center max-w-6xl mx-auto p-4">
            <!-- Publicaciones -->
            <section class="w-full md:w-3/4">
                <h2 class="sr-only">Publicaciones</h2>

                <div class="min-h-40 p-4 shadow-lg rounded-lg">
                    <div v-if="loading" class="text-center text-gray-600">Cargando publicaciones...</div>
                    <ul v-else class="space-y-6">
                        <li
                            v-for="post in posts"
                            :key="post.id"
                            class="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300"
                        >
                            <div class="text-gray-400 text-sm">{{ formatDate(post.createdAt) }}</div>
                            <div class="flex items-center mt-2">
                                <router-link :to="`/usuario/${post.user_id}`">
                                    <img :src="post.userPhotoURL" alt="Foto de perfil" class="w-10 h-10 rounded-full mr-2" />
                                </router-link>
                                <div>
                                    <div class="font-semibold text-black">{{ post.userName }}</div>
                                </div>
                            </div>
                            <div class="text-gray-800 mt-1">{{ post.text }}</div>
                            <img v-if="post.image" :src="post.image" alt="Imagen de la publicación" class="mt-2 w-full h-auto rounded" />

                            <div class="mt-2">
                                <h3 class="font-semibold">Comentarios:</h3>
                                <ul class="mt-1 space-y-1">
                                    <li v-for="comment in post.comments" :key="comment.id" class="text-gray-600">
                                        <strong>{{ comment.userName }}:</strong> {{ comment.text }} 
                                        <span class="text-gray-400 text-sm">({{ formatDate(comment.createdAt) }})</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="mt-2 flex items-center">
                                <input
                                    v-model="newComment[post.id]"
                                    :id="'comment-' + post.id"
                                    :name="'comment-' + post.id"
                                    type="text"
                                    placeholder="Agregar un comentario..."
                                    autocomplete="off"
                                    class="border border-gray-300 rounded-lg p-2 flex-grow focus:ring-2 focus:ring-blue-500 transition duration-200"
                                />
                                <button 
                                    @click.prevent="addComment(post.id)" 
                                    class="ml-2 bg-[#07DBA8] hover:bg-[#05b58b] text-black py-2 px-4 rounded-lg transition duration-200">
                                    Comentar
                                </button>
                            </div>
                            <div class="mt-2 flex items-center">
                                <button @click="toggleLike(post.id)" class="mr-2 p-2 transition duration-200">
                                    <i :class="post.likes && post.likes.includes(loggedUser.id) ? 'fas fa-heart text-red-600' : 'far fa-heart text-gray-600'"></i>
                                </button>
                                <span>{{ post.likes ? post.likes.length : 0 }} Likes</span>
                                <!-- Mostrar el botón de editar solo si el usuario es el propietario de la publicación -->
                                <button v-if="post.user_id === loggedUser.id" @click="editPost(post)" class="ml-2 text-black bg-[#07DBA8] hover:bg-[#05b58b] py-2 px-4 rounded-lg transition duration-200">Editar</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <!-- Crear o Editar Publicación -->
            <section v-if="showForm" class="floating-form rounded-lg">
                <h2 class="mb-4 text-xl font-semibold">{{ editingPost ? 'Editar Publicación' : 'Crear una publicación' }}</h2>

                <form @submit.prevent="handleSubmit" class="bg-white p-4 rounded-lg shadow-lg">
                    <div class="mb-4">
                        <label for="text" class="block mb-2 font-semibold">Publicación</label>
                        <div class="relative">
                            <textarea
                                id="text"
                                name="text"
                                class="w-full min-h-40 p-2 pl-10 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                v-model="newPost.text"
                                placeholder="Escribe algo..."
                                required
                            ></textarea>
                            <i class="fas fa-pencil-alt absolute top-2 left-2 text-gray-400"></i>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label for="image-upload" class="block mb-2 font-semibold">Subir imagen desde el dispositivo</label>
                        <div class="relative">
                            <input
                                id="image-upload"
                                name="image-upload"
                                type="file"
                                accept="image/*"
                                @change="handleImageUpload"
                                class="w-full p-2 pl-10 border border-gray-400 rounded-lg transition duration-200"
                            />
                            <i class="fas fa-upload absolute top-2 left-2 text-gray-400"></i>
                        </div>
                    </div>
                    <button
    type="submit"
    class="w-full py-2 px-4 rounded-lg text-black bg-[#07DBA8] hover:bg-[#07D4S8] focus:bg-blue-700 text-white transition duration-200 mb-4">
    {{ editingPost ? 'Actualizar Publicación' : 'Crear Publicación' }}
</button>
<button
    type="button"
    @click="cancelEdit"
    class="w-full border-2 border-[#07DBA8] text-[#07DBA8] py-2 px-4 rounded-lg transition duration-200 hover:bg-[#e0e0e0]">
    Cancelar
</button>
                </form>
            </section>

            <button
                @click="toggleForm"
                class="fixed bottom-4 right-4 bg-[#07DBA8] hover:bg-[#05b58b] text-black p-4 rounded-full shadow-lg transition duration-200"
            >
                <i class="fas fa-plus"></i>
            </button>
        </div>
    </div>
</template>



<style scoped>
.dark-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 998;
}

li {
    border-radius: 10px;
}

textarea {
    resize: none;
}

.floating-form {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 400px;
    z-index: 1000;
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>