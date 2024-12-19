import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Sube un archivo al path indicado.
 * 
 * @param {string} path 
 * @param {File} file 
 */
export async function uploadFile(path, file) {

    const fileRef = ref(storage, path);

    await uploadBytes(fileRef, file);
}

/**
 * Retorna la URL absoluta desde donde descargar el archivo.
 * 
 * @param {string} path 
 * @returns {Promise<string>}
 */
export async function getFileURL(path) {
    const fileRef = ref(storage, path);

    return await getDownloadURL(fileRef);
}