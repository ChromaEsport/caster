import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import { 
getFirestore,
doc,
setDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjAXL0MmZwbmOhEMNiBydxw5g03gh67tk",
  authDomain: "chroma-dofus-caster.firebaseapp.com",
  projectId: "chroma-dofus-caster",
  storageBucket: "chroma-dofus-caster.firebasestorage.app",
  messagingSenderId: "682274634660",
  appId: "1:682274634660:web:8b17175ad7317783631f31"
};

const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


export {
db,
doc,
setDoc,
onSnapshot
};
