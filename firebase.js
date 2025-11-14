import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase (ya proporcionada)
const firebaseConfig = {
  apiKey: "AIzaSyC3lMMDySzX9N4XeCeuCvYX1KzMa_X9PjU",
  authDomain: "trabajoisladelcocolourdeselena.firebaseapp.com",
  projectId: "trabajoisladelcocolourdeselena",
  storageBucket: "trabajoisladelcocolourdeselena.firebasestorage.app",
  messagingSenderId: "459451487850",
  appId: "1:459451487850:web:7bf9037201a1c5920e9c13"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
