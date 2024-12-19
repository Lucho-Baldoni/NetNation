// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPtL6UOeDzFE4da1nIlG0ClJOBuIXy4E0",
    authDomain: "net-nation-b2dbd.firebaseapp.com",
    projectId: "net-nation-b2dbd",
    storageBucket: "net-nation-b2dbd.firebasestorage.app",
    messagingSenderId: "404418525938",
    appId: "1:404418525938:web:3e59b339c9dfc82a51ae6b"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);