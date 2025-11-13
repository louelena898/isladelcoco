// ...existing code...
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

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

// --- Funciones de autenticación ---
export async function signUpWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
  return signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// --- Funciones Firestore básicas ---
export async function addDocument(collectionName, data) {
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, data);
  return { id: docRef.id };
}

export async function getCollectionDocuments(collectionName) {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- Función de Storage para subir archivos ---
export async function uploadFile(path, file) {
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file);
  return getDownloadURL(ref);
}

// Ejemplos de uso (descomenta según necesites)
// onAuthChange(user => console.log('Usuario:', user));
// signUpWithEmail('test@example.com', 'password123').then(console.log).catch(console.error);
// addDocument('posts', { title: 'Hola', createdAt: