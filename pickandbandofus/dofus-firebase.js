
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    doc,
    setDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuration du NOUVEAU projet Firebase Dofus
// Remplace les valeurs ci-dessous par celles de ton projet.

const firebaseConfig = {
    apiKey: "AIzaSyBjAXL0MmZwbmOhEMNiBydxw5g03gh67tk",
  authDomain: "chroma-dofus-caster.firebaseapp.com",
  projectId: "chroma-dofus-caster",
  storageBucket: "chroma-dofus-caster.firebasestorage.app",
  messagingSenderId: "682274634660",
  appId: "1:682274634660:web:8b17175ad7317783631f31"
};

// Application Firebase indépendante d'Overwatch
const dofusApp = initializeApp(firebaseConfig, "ChromaDofus");

const db = getFirestore(dofusApp);

export {
    db,
    doc,
    setDoc,
    onSnapshot
};
