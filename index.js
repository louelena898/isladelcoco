// ...existing code...
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { auth, db, storage } from "./firebase.js";

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