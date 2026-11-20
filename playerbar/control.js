import { db, doc, setDoc, onSnapshot } from "../firebase.js";
const stateRef = doc(db, "playerbar", "current");
const pseudo = document.getElementById("pseudo");
const role = document.getElementById("role");
const status = document.getElementById("status");
let ready = false;
let visible = false;
let saveTimer;
function payload(show = visible){return {pseudo:pseudo.value.trim().slice(0,18),role:role.value,visible:show,updatedAt:Date.now()};}
async function save(show = visible){
  if(!ready)return;
  visible=show;
  try{await setDoc(stateRef,payload(show));status.textContent=show?"Bandeau affiché sur le stream.":"Bandeau masqué.";}
  catch(error){console.error(error);status.textContent="Erreur d'enregistrement. Vérifie la connexion.";}
}
function queueSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>save(visible),250);}
pseudo.addEventListener("input",queueSave);
role.addEventListener("change",queueSave);
document.getElementById("show").addEventListener("click",()=>save(true));
document.getElementById("hide").addEventListener("click",()=>save(false));
onSnapshot(stateRef,snap=>{
  const data=snap.exists()?snap.data():{};
  if(data.pseudo!==undefined)pseudo.value=data.pseudo;
  if(data.role)role.value=data.role;
  visible=!!data.visible;
  ready=true;
  status.textContent=visible?"Bandeau actuellement affiché.":"Prêt — renseigne ton pseudo et ton rôle.";
},error=>{console.error(error);status.textContent="Impossible de se connecter à Firebase.";});
