import { db, collection, onSnapshot } from "../firebase.js";
const banner=document.getElementById("banner");
const playersEl=document.getElementById("players");
const roles={TANK:"TANK",DPS:"DPS",SOUTIEN:"SOUTIEN"};
onSnapshot(collection(db,"playerbar"),snapshot=>{
  const active=snapshot.docs.map(d=>d.data()).filter(p=>p.visible&&String(p.pseudo||"").trim()).sort((a,b)=>String(a.playerId||"").localeCompare(String(b.playerId||"")));
  playersEl.replaceChildren();
  for(const player of active){
    const card=document.createElement("article");card.className="player-card";
    const name=document.createElement("strong");name.className="player-name";name.textContent=String(player.pseudo).toUpperCase();
    const role=document.createElement("span");role.className="player-role";role.textContent=roles[player.role]||"JOUEUR";
    const mark=document.createElement("i");mark.className="role-mark";
    card.append(mark,name,role);playersEl.append(card);
  }
  banner.classList.toggle("visible",active.length>0);
  banner.setAttribute("aria-hidden",String(active.length===0));
},error=>console.error("Chroma playerbar:",error));
