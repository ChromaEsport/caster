import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import { 
getFirestore,
doc,
setDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHMDcbowJ2XfD6_RbmMiPj8epjfoXMA1M",
  authDomain: "chroma-caster.firebaseapp.com",
  projectId: "chroma-caster",
  storageBucket: "chroma-caster.firebasestorage.app",
  messagingSenderId: "657595541032",
  appId: "1:657595541032:web:270a4394e10a8d2b1df71d"
};

const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


export {
db,
doc,
setDoc,
onSnapshot
};
