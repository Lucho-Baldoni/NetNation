import { db } from './firebase'; // Asegúrate de importar tu instancia de Firestore
import { collection, addDoc, onSnapshot, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';

const postsCollection = collection(db, 'posts');
const commentsCollection = collection(db, 'comments');

/**
 * Guarda una nueva publicación en Firestore.
 * @param {Object} post - El objeto de la publicación a guardar.
 * @param {string} post.text - El texto de la publicación.
 * @param {string} post.user_id - El ID del usuario que crea la publicación.
 * @returns {Promise<Object>} - Devuelve una promesa que resuelve con el objeto de la publicación guardada, incluyendo su ID.
 * @throws {Error} - Lanza un error si los datos de la publicación son inválidos o si ocurre un error al guardar.
 */
export const savePublicPost = async (post) => {
    if (!post.text || !post.user_id) {
        throw new Error("Los datos de la publicación son inválidos.");
    }
    try {
        const docRef = await addDoc(postsCollection, post);
        return { id: docRef.id, ...post };
    } catch (error) {
        console.error("Error al guardar la publicación:", error);
        throw new Error("No se pudo guardar la publicación.");
    }
};

/**
 * Actualiza una publicación existente en Firestore.
 * @param {string} postId - El ID de la publicación a actualizar.
 * @param {Object} updatedData - Los datos actualizados de la publicación.
 * @returns {Promise<void>} - Devuelve una promesa que se resuelve cuando la publicación ha sido actualizada.
 * @throws {Error} - Lanza un error si ocurre un error al actualizar la publicación.
 */
export const updatePost = async (postId, updatedData) => {
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, updatedData);
    } catch (error) {
        console.error("Error al actualizar la publicación:", error);
        throw new Error("No se pudo actualizar la publicación.");
    }
};

/**
 * Se suscribe a las publicaciones en Firestore y ejecuta un callback con los datos de las publicaciones.
 * @param {Function} callback - La función que se ejecutará con los datos de las publicaciones.
 * @returns {Function} - Devuelve una función que se puede llamar para cancelar la suscripción.
 */
export const subscribeToPublicPosts = (callback) => {
    return onSnapshot(postsCollection, async (snapshot) => {
        const posts = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
            const postData = { id: docSnapshot.id, ...docSnapshot.data() };

            // Aquí se obtiene la referencia al documento del perfil del usuario
            const userDocRef = doc(db, 'user-profiles', postData.user_id);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                postData.userName = userData.displayName;
                postData.userPhotoURL = userData.photoURL;
            } else {
                postData.userName = 'Usuario desconocido';
                postData.userPhotoURL = '';
            }

            return postData;
        }));
        callback(posts);
    });
};

/**
 * Guarda un comentario en Firestore.
 * @param {Object} comment - El objeto del comentario a guardar.
 * @param {string} comment.text - El texto del comentario.
 * @param {string} comment.post_id - El ID de la publicación a la que pertenece el comentario.
 * @returns {Promise<void>} - Devuelve una promesa que se resuelve cuando el comentario ha sido guardado.
 * @throws {Error} - Lanza un error si los datos del comentario son inválidos o si ocurre un error al guardar.
 */
export const saveComment = async (comment) => {
    if (!comment.text || !comment.post_id) {
        throw new Error("Los datos del comentario son inválidos.");
    }
    try {
        await addDoc(commentsCollection, comment);
    } catch (error) {
        console.error("Error al guardar el comentario:", error);
        throw new Error("No se pudo guardar el comentario.");
    }
};

/**
 * Se suscribe a los comentarios de una publicación en Firestore y ejecuta un callback con los datos de los comentarios.
 * @param {string} postId - El ID de la publicación para la que se quieren obtener los comentarios.
 * @param { Function} callback - La función que se ejecutará con los datos de los comentarios.
 * @returns {Function} - Devuelve una función que se puede llamar para cancelar la suscripción.
 */
export const subscribeToComments = (postId, callback) => {
    const commentsRef = collection(db, 'comments');
    const commentsQuery = query(commentsRef, where('post_id', '==', postId)); 
    return onSnapshot(commentsQuery, async (snapshot) => {
        const comments = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
            const commentData = { id: docSnapshot.id, ...docSnapshot.data() };

            // Aquí se obtiene la referencia al documento del perfil del usuario
            const userDocRef = doc(db, 'user-profiles', commentData.user_id);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                commentData.userName = userData.displayName;
            } else {
                commentData.userName = 'Usuario desconocido';
            }

            return commentData;
        }));
        callback(comments);
    });
};