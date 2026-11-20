import { db, doc, setDoc, onSnapshot } from "../firebase.js";
const idInput=document.getElementById("player-id");
const pseudo=document.getElementById("pseudo");
const role=document.getElementById("role");
const hero=document.getElementById("hero");
const design=document.getElementById("design");
const status=document.getElementById("status");
const params=new URLSearchParams(location.search);
idInput.value=(params.get("id")||"").toLowerCase().replace(/[^a-z0-9_-]/g,"").slice(0,24);
let ready=false, visible=false, saveTimer=null, unsubscribe=null;
function cleanId(){return idInput.value.toLowerCase().replace(/[^a-z0-9_-]/g,"").slice(0,24);}
function listen(){
  if(unsubscribe)unsubscribe();
  const id=cleanId();
  ready=false;
  if(!id){status.textContent="Saisis ton identifiant personnel.";return;}
  idInput.value=id;
  const ref=doc(db,"playerbar",id);
  unsubscribe=onSnapshot(ref,snap=>{
    const data=snap.exists()?snap.data():{};
    pseudo.value=data.pseudo||"";
    role.value=data.role||"TANK";
    hero.value=data.hero||"";
    design.value=data.design||"broadcast";
    visible=!!data.visible;
    ready=true;
    status.textContent=visible?"Ton bandeau est actuellement affiché.":"Prêt — tu peux afficher ton bandeau.";
  },error=>{console.error(error);status.textContent="Connexion Firebase impossible.";});
}
async function save(show){
  const id=cleanId(),name=pseudo.value.trim().slice(0,18);
  if(!id){status.textContent="Choisis d'abord ton identifiant personnel.";return;}
  if(show&&!name){status.textContent="Renseigne ton pseudo avant l'affichage.";return;}
  ready=false;
  try{
    await setDoc(doc(db,"playerbar",id),{playerId:id,pseudo:name,role:role.value,design:design.value,hero:hero.value,visible:show,updatedAt:Date.now()});
    visible=show;ready=true;
    status.textContent=show?"Ton bandeau est affiché en direct !":"Ton bandeau est masqué.";
    const url=new URL(location.href);url.searchParams.set("id",id);history.replaceState({}, "",url);
  }catch(error){console.error(error);ready=true;status.textContent="Erreur d'enregistrement. Vérifie Firebase.";}
}
idInput.addEventListener("change",listen);
idInput.addEventListener("input",()=>{ready=false;status.textContent="Valide ton identifiant en quittant le champ.";});
pseudo.addEventListener("input",()=>{if(visible){clearTimeout(saveTimer);saveTimer=setTimeout(()=>save(true),350);}});
role.addEventListener("change",()=>{if(visible)save(true);});
hero.addEventListener("change",()=>save(visible));
design.addEventListener("change",()=>save(visible));
document.getElementById("show").addEventListener("click",()=>save(true));
document.getElementById("hide").addEventListener("click",()=>save(false));
listen();
