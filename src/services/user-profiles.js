import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * 
 * @param {string} id 
 * @returns {Promise<{id: string, email: string, displayName: string|null, bio: string|null, career: string|null, photoURL: string|null}>}
 */
export async function getUserProfileById(id) {
    const userRef = doc(db, `user-profiles/${id}`);

    const userDoc = await getDoc(userRef);

    return {
        id: userDoc.id,
        ...userDoc.data(),
    }
}

/**
 * 
 * @param {string} id 
 * @param {{displayName: string, bio: string, career: string, photoURL: string}} data 
 */
export async function createUserProfile(id, data) {
    const userRef = doc(db, `user-profiles/${id}`);
    await setDoc(userRef, data);
}

/**
 * 
 * @param {string} id 
 * @param {{displayName: string, bio: string, career: string, photoURL: string}} data
 */
export async function editUserProfile(id, data) {

    const userRef = doc(db, `user-profiles/${id}`);

    await updateDoc(userRef, {
        ...data
    });
}