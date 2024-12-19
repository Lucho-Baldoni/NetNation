
import { DocumentReference, addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Guarda los documentos de los chats privados.
 * 
 * @type {Object}
 */
let cacheChats = {};

/**
 * Retorna la clave del caché para la conversación entre estos dos usuarios.
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns 
 */
function getCacheKey(senderId, receiverId) {
    return [senderId, receiverId].sort().join("_");
}

/**
 * 
 * @param {string} key 
 * @param {any} value 
 */
function putInCache(key, value) {
    cacheChats[key] = value;
}

/**
 * 
 * @param {string} key 
 * @returns {any}
 */
function retrieveFromCache(key) {
    return cacheChats[key] || null;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<DocumentReference>}
 */
async function getChatDocument(senderId, receiverId) {

    const cacheKey = getCacheKey(senderId, receiverId);
    const cacheDoc = retrieveFromCache(cacheKey);

    if(cacheDoc) {
        return cacheDoc;
    }


    const chatRef = collection(db, 'private-chats');

    const chatQuery = query(chatRef, where('users', '==', {
        [senderId]: true,
        [receiverId]: true,
    }), limit(1));

    const chatSnapshot = await getDocs(chatQuery);

    let chatDoc;

    if(chatSnapshot.empty) {
        chatDoc = await addDoc(chatRef, {
            users: {
                [senderId]: true,
                [receiverId]: true,
            }
        });
    } else {
        chatDoc = chatSnapshot.docs[0];
    }

    putInCache(cacheKey, chatDoc);

    return chatDoc;
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} text 
 */
export async function savePrivateChatMessage(senderId, receiverId, text) {

    const chatDoc = await getChatDocument(senderId, receiverId);

    const messagesRef = collection(db, `private-chats/${chatDoc.id}/messages`);

    await addDoc(messagesRef, {
        user_id: senderId,
        text,
        created_at: serverTimestamp(),
    });
}

/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {Function} callback 
 * @returns {Promise<import("firebase/firestore").Unsubscribe>}
 */
export async function subscribeToPrivateChatMessages(senderId, receiverId, callback) {
    const chatDoc = await getChatDocument(senderId, receiverId);

    const messagesRef = collection(db, `private-chats/${chatDoc.id}/messages`);

    const messagesQuery = query(messagesRef, orderBy('created_at'));

    return onSnapshot(messagesQuery, snapshot => {
        const messages = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                user_id: doc.data().user_id,
                text: doc.data().text,
                created_at: doc.data().created_at?.toDate(),
            }
        });

        callback(messages);
    });
}

