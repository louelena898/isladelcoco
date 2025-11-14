// Firebase setup and helper utilities
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

const firebaseConfig = {
  apiKey: "AIzaSyC3lMMDySzX9N4XeCeuCvYX1KzMa_X9PjU",
  authDomain: "trabajoisladelcocolourdeselena.firebaseapp.com",
  projectId: "trabajoisladelcocolourdeselena",
  storageBucket: "trabajoisladelcocolourdeselena.firebasestorage.app",
  messagingSenderId: "459451487850",
  appId: "1:459451487850:web:7bf9037201a1c5920e9c13"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

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

export async function uploadFile(path, file) {
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file);
  return getDownloadURL(ref);
}

// Demo: show auth state in the page
onAuthChange(user => {
  const statusEl = document.getElementById('userStatus');
  if (statusEl) statusEl.textContent = user ? `Conectado: ${user.email}` : 'No hay usuario conectado';
});

function showError(message) {
  console.error(message);
  const el = document.getElementById('errorMsg');
  if (!el) return;
  el.textContent = message;
  el.classList.remove('d-none');
  setTimeout(() => el.classList.add('d-none'), 8000);
}

function showStatus(message) {
  console.log(message);
  const el = document.getElementById('statusMsg');
  if (!el) return;
  el.textContent = message;
  el.classList.remove('d-none');
  setTimeout(() => el.classList.add('d-none'), 8000);
}

// Helper to render posts
function renderPosts(posts) {
  const container = document.getElementById('posts');
  if (!container) return;
  container.innerHTML = '';
  posts.forEach(p => {
    const el = document.createElement('div');
    el.className = 'post';
  el.innerHTML = `<h4>${p.title}</h4>${p.imageUrl ? `<img src="${p.imageUrl}" alt="" style="max-width:100%;height:auto;margin-bottom:8px;"/>` : ''}<p>${p.body || ''}</p>`;
    container.appendChild(el);
  });
}

// Wire forms
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const signinForm = document.getElementById('signinForm');
  const signoutBtn = document.getElementById('signoutBtn');
  const postForm = document.getElementById('postForm');
  const uploadBtn = document.getElementById('uploadBtn');
  const fileInput = document.getElementById('fileInput');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      try {
        await signUpWithEmail(email, password);
        alert('Cuenta creada');
        signupForm.reset();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  }

  if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signinEmail').value;
      const password = document.getElementById('signinPassword').value;
      try {
        await signInWithEmail(email, password);
        alert('Sesión iniciada');
        signinForm.reset();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  }

  if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
      await signOutUser();
    });
  }

  if (postForm) {
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('postTitle').value;
      const body = document.getElementById('postBody').value;
      const file = document.getElementById('fileInput')?.files?.[0];
      // Require authenticated user
      if (!auth || !auth.currentUser) {
        return showError('Debes iniciar sesión para publicar.');
      }
        showStatus('Iniciando publicación...');
        console.log('auth.currentUser:', auth.currentUser);
        if (file) console.log('file selected:', file.name, file.size, file.type);
        else console.log('no file selected');
      try {
        let imageUrl = null;
        if (file) {
          try {
            const path = `uploads/${auth.currentUser.uid}/${Date.now()}_${file.name}`;
            showStatus('Subiendo imagen a: ' + path);
            console.log('upload path:', path);
            imageUrl = await uploadFile(path, file);
            showStatus('Imagen subida.');
          } catch (err) {
            // don't block post creation if image fails, but show warning
            showError('No se pudo subir la imagen: ' + (err && err.message ? err.message : err));
          }
        }
          showStatus('Guardando publicación en Firestore...');
          const doc = await addDocument('posts', { title, body, imageUrl, createdAt: Date.now(), uid: auth.currentUser.uid });
          console.log('addDocument result:', doc);
          showStatus('Publicación creada con id: ' + (doc && doc.id));
          postForm.reset();
          const posts = await getCollectionDocuments('posts');
          renderPosts(posts);
      } catch (err) {
        showError('Error al agregar publicación: ' + (err && err.message ? err.message : err) + '\nSi estás autenticado, revisa las reglas de Firestore (Permission denied).');
      }
    });
  }

  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', async () => {
      const file = fileInput.files[0];
      if (!file) return alert('Selecciona un archivo');
      try {
        const url = await uploadFile(`uploads/${Date.now()}_${file.name}`, file);
        const out = document.getElementById('uploadResult');
        out.innerHTML = `Archivo subido: <a href="${url}" target="_blank">${file.name}</a>`;
      } catch (err) {
          showError('Error al subir archivo: ' + (err && err.message ? err.message : err));
      }
    });
  }

  // initial load of posts
  (async () => {
    try {
      const posts = await getCollectionDocuments('posts');
      renderPosts(posts);
    } catch (err) {
      console.warn('No se pudieron cargar posts:', err.message);
    }
  })();
});
