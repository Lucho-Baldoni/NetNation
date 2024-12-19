import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, editUserProfile, getUserProfileById } from "./user-profiles";
import { getFileURL, uploadFile } from "./file-storage";

const AUTH_ERROR_MESSAGES_MAP = {
    'auth/invalid-email': 'El email no tiene un formato correcto.',
    'auth/weak-password': 'El password debe tener la menos 6 caracteres.',
    'auth/invalid-credential': 'Las credencial es ingresadas no coinciden con nuestros registros.',
}

let loggedUser = {
    id: null,
    email: null,
    displayName: null,
    bio: null,
    career: null,
    photoURL: null,
}

if(localStorage.getItem('user')) {
    loggedUser = JSON.parse(localStorage.getItem('user'));
}

let observers = [];

onAuthStateChanged(auth, user => {
    if(user) {
        updateLoggedUser({
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        });

        getUserProfileById(user.uid)
            .then(profile => {
                updateLoggedUser({
                    bio: profile.bio,
                    career: profile.career,
                });
            });
    } else {
        updateLoggedUser({
            id: null,
            email: null,
            displayName: null,
            bio: null,
            career: null,
            photoURL: null,
        });
        localStorage.removeItem('user');
    }
});

/**
 * 
 * @param {{email: string, password: string}} credentials
 */
export async function register({email, password}) {
    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        
        await createUserProfile(credentials.user.uid, { email });
    } catch (error) {
        console.error("[auth.js login] Error al registrar el usuario: ", error);
        throw AUTH_ERROR_MESSAGES_MAP[error.code];
    }
}

/**
 * 
 * @param {{email: string, password: string}} credentials
 */
export async function login({email, password}) {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("[auth.js login] Error al autenticar: ", error);
        throw AUTH_ERROR_MESSAGES_MAP[error.code] || error.message;
    }
}

/**
 * 
 * @param {{displayName: string, bio: string, career: string}} data
 */
export async function editMyProfile({ displayName, bio, career }) {
    try {
        const promiseAuth = updateProfile(auth.currentUser, { displayName });

        const promiseFirestore = editUserProfile(loggedUser.id, { displayName, bio, career });

        await Promise.all([promiseAuth, promiseFirestore]);

        updateLoggedUser({
            displayName,
            bio,
            career,
        });
    } catch (error) {
        console.error("[auth.js editMyProfile] Error al editar el perfil: ", error);
        throw error;
    }
}

/**
 * 
 * @param {File} photo 
 */
export async function editMyProfilePhoto(photo) {
    try {
      
        const filepath = `users/${loggedUser.id}/avatar.jpg`; 

        await uploadFile(filepath, photo);


        const photoURL = await getFileURL(filepath);

        const promiseAuth = updateProfile(auth.currentUser, { photoURL });
        const promiseFirestore = editUserProfile(loggedUser.id, { photoURL });

        await Promise.all([promiseAuth, promiseFirestore]);

        updateLoggedUser({ photoURL });
    } catch (error) {
        console.error("[auth.js editMyProfilePhoto] Error al editar la foto de perfil: ", error);
        throw error;
    }
}

/**
 * Cierra la sesión.
 */
export async function logout() {
    await signOut(auth);
}

/**
 * 
 * @param {Function} callback - El Observer a asociar.
 * @returns {Function} Función para cancelar la suscripción del Observer.
 */
export function subscribeToAuthChanges(callback) {
    observers.push(callback);

    
    notify(callback);

    
    return () => {
        observers = observers.filter(obs => obs !== callback);
    }
}

/**
 * Ejecuta el callback del observer y le pasa una copia de los
 * datos del usuario autenticado (o no autenticado).
 * 
 * @param {Function} callback 
 */
function notify(callback) {
    callback({...loggedUser});
}

/**
 * Notifica a todos los observers.
 */
function notifyAll() {
    observers.forEach(callback => notify(callback));
}

/**
 * Actualiza la data del usuario autenticado.
 * 
 * @param {{}} newData 
 */
function updateLoggedUser(newData) {
    loggedUser = {
        ...loggedUser,
        ...newData,
    }
    localStorage.setItem('user', JSON.stringify(loggedUser));
    notifyAll();
}