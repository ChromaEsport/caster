import { db, doc, onSnapshot } from "../firebase.js";
const banner=document.getElementById("banner");
const nameEl=document.getElementById("player-name");
const roleEl=document.getElementById("player-role");
const stateRef=doc(db,"playerbar","current");
onSnapshot(stateRef,snap=>{
  const data=snap.exists()?snap.data():{};
  nameEl.textContent=(data.pseudo||"PSEUDO").toUpperCase();
  roleEl.textContent=(data.role||"TANK").toUpperCase();
  const visible=!!data.visible && !!(data.pseudo||"").trim();
  banner.classList.toggle("visible",visible);
  banner.setAttribute("aria-hidden",String(!visible));
},error=>console.error("Chroma playerbar:",error));
