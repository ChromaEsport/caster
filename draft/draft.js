import {
    db,
    doc,
    onSnapshot
} from "../firebase.js";

const draftRef = doc(
    db,
    "draft",
    "current"
);

const heroRoles = {

   "D.Va":{role:"TANK",icon:"tank.png"},
"Doomfist":{role:"TANK",icon:"tank.png"},
"Hazard":{role:"TANK",icon:"tank.png"},
"Junker Queen":{role:"TANK",icon:"tank.png"},
"Mauga":{role:"TANK",icon:"tank.png"},
"Orisa":{role:"TANK",icon:"tank.png"},
"Ramattra":{role:"TANK",icon:"tank.png"},
"Reinhardt":{role:"TANK",icon:"tank.png"},
"Roadhog":{role:"TANK",icon:"tank.png"},
"Sigma":{role:"TANK",icon:"tank.png"},
"Winston":{role:"TANK",icon:"tank.png"},
"Wrecking Ball":{role:"TANK",icon:"tank.png"},
"Zarya":{role:"TANK",icon:"tank.png"},
"Domina":{role:"TANK",icon:"tank.png"},
"Lifeweaver":{role:"SUPPORT",icon:"support.png"},

"Anran":{role:"DAMAGE",icon:"damage.png"},
"Ashe":{role:"DAMAGE",icon:"damage.png"},
"Bastion":{role:"DAMAGE",icon:"damage.png"},
"Cassidy":{role:"DAMAGE",icon:"damage.png"},
"Echo":{role:"DAMAGE",icon:"damage.png"},
"Emre":{role:"DAMAGE",icon:"damage.png"},
"Freja":{role:"DAMAGE",icon:"damage.png"},
"Genji":{role:"DAMAGE",icon:"damage.png"},
"Hanzo":{role:"DAMAGE",icon:"damage.png"},
"Junkrat":{role:"DAMAGE",icon:"damage.png"},
"Mei":{role:"DAMAGE",icon:"damage.png"},
"Pharah":{role:"DAMAGE",icon:"damage.png"},
"Reaper":{role:"DAMAGE",icon:"damage.png"},
"Sierra":{role:"DAMAGE",icon:"damage.png"},
"Sojourn":{role:"DAMAGE",icon:"damage.png"},
"Soldier: 76":{role:"DAMAGE",icon:"damage.png"},
"Sombra":{role:"DAMAGE",icon:"damage.png"},
"Symmetra":{role:"DAMAGE",icon:"damage.png"},
"Torbjörn":{role:"DAMAGE",icon:"damage.png"},
"Tracer":{role:"DAMAGE",icon:"damage.png"},
"Vendetta":{role:"DAMAGE",icon:"damage.png"},
"Venture":{role:"DAMAGE",icon:"damage.png"},
"Widowmaker":{role:"DAMAGE",icon:"damage.png"},
"Shion":{role:"DAMAGE",icon:"damage.png"},

"Ana":{role:"SUPPORT",icon:"support.png"},
"Baptiste":{role:"SUPPORT",icon:"support.png"},
"Brigitte":{role:"SUPPORT",icon:"support.png"},
"Illari":{role:"SUPPORT",icon:"support.png"},
"Jetpack Cat":{role:"SUPPORT",icon:"support.png"},
"Juno":{role:"SUPPORT",icon:"support.png"},
"Kiriko":{role:"SUPPORT",icon:"support.png"},
"Lifeweaver":{role:"SUPPORT",icon:"support.png"},
"Lúcio":{role:"SUPPORT",icon:"support.png"},
"Mercy":{role:"SUPPORT",icon:"support.png"},
"Mizuki":{role:"SUPPORT",icon:"support.png"},
"Moira":{role:"SUPPORT",icon:"support.png"},
"Wuyang":{role:"SUPPORT",icon:"support.png"},
"Zenyatta":{role:"SUPPORT",icon:"support.png"}
};



const lastBans = {};


const mapPicked =
    document.getElementById("mapPicked");

const pickedMapName =
    document.getElementById("pickedMapName");

let lastSelectedMap = 0;

let animationRunning = false;

function sleep(ms){

    return new Promise(resolve => setTimeout(resolve, ms));

}

async function playMapSelection(mapIndex){

    if(animationRunning) return;

    animationRunning = true;

    const cards = document.querySelectorAll(".map-card");

    // Nettoyage
    cards.forEach(card=>{

        card.classList.remove(
            "selected",
            "left",
            "right",
            "dim"
        );

    });

    // Laisse le navigateur appliquer le nettoyage
    await sleep(50);

    // Déplacement des cartes
    cards.forEach((card,index)=>{

        const i = index + 1;

        if(i < mapIndex){

            card.classList.add("left","dim");

        }
        else if(i > mapIndex){

            card.classList.add("right","dim");

        }

    });

    // On attend que les cartes se déplacent
    await sleep(500);

    // Zoom de la carte sélectionnée
    document
        .getElementById(`map${mapIndex}`)
        .classList.add("selected");

    // On attend la fin du zoom
    await sleep(700);

    // Affichage du bandeau
    pickedMapName.textContent =
        document.getElementById(`map${mapIndex}Name`).textContent;

    mapPicked.classList.add("show");

    await sleep(2000);

    mapPicked.classList.remove("show");

    animationRunning = false;

}

async function playBanAnimation(fieldName, heroName){

    const slot = document.getElementById(fieldName + "Slot");
    const img = document.getElementById(fieldName + "Img");


    const heroNameElement = document.getElementById(fieldName + "Name");
    const heroRoleElement = document.getElementById(fieldName + "Role");
    const heroRoleImg = document.getElementById(fieldName + "RoleImg");
    const heroContainer = document.getElementById(fieldName + "Container");

    
    if(!slot || !img) return;

    const round = fieldName.split("_")[0].replace("ban", "");

    const title = document.getElementById(`banTitle${round}`);

    if(title){

    title.classList.add("show");

}

    // Remise à zéro
    slot.classList.remove("show");
    slot.classList.remove("play");
    slot.classList.remove("banned");



    await sleep(50);

    // Bandeau BAN
    slot.classList.add("play");

    await sleep(450);

    // Chargement du héros
    img.src = `../heroes/${heroName}.png`;
    img.style.display = "block";

    heroNameElement.textContent = heroName.toUpperCase();

const heroData = heroRoles[heroName];

if(heroData){

    heroRoleElement.textContent = heroData.role;

    heroRoleImg.src = `../roles/${heroData.icon}`;
    heroRoleImg.style.display = "block";

}else{

    heroRoleElement.textContent = "";
    heroRoleImg.removeAttribute("src");
    

}

    // Affichage
     if(heroContainer){

    heroContainer.classList.add("show");
    slot.classList.remove("play");
    slot.classList.add("show");
    slot.classList.add("banned");
    slot.classList.add("glow");

    await sleep(800);

    slot.classList.remove("glow");

}}


onSnapshot(draftRef, (docSnap) => {

    const data = docSnap.data();

    if (!data) return;

   if(data.selectedMap === 0){
       
    document
    .querySelectorAll(".map-card")
    .forEach(card=>{

        card.classList.remove(
            "selected",
            "left",
            "right",
            "dim"
        );

    });

    document
.querySelectorAll(".ban-title")
.forEach(title=>{

    title.classList.remove("show");

});   

    document
.querySelectorAll(".hero-ban")
.forEach(img=>{

    img.removeAttribute("src");
    img.style.display = "none";


    });

    document
    .querySelectorAll(".map-image img")
    .forEach(img=>{

        img.removeAttribute("src");

        img.style.display = "none";

    });   


    document
    .querySelectorAll(".hero-slot")
    .forEach(slot=>{

        slot.classList.remove(
            "show",
            "play",
            "banned",
            "glow"
        );

    });

       document
.querySelectorAll(".hero-name")
.forEach(name=>{

    name.textContent = "";

});


document
.querySelectorAll(".hero-role span")
.forEach(role=>{

    role.textContent = "";

});


document
.querySelectorAll(".hero-role img")
.forEach(icon=>{

    icon.removeAttribute("src");
    icon.style.display = "none";

});

   document
.querySelectorAll(".hero-container, .hero-info")
.forEach(container => {

    container.classList.remove("show");

});    

}



    if(data.selectedMap !== lastSelectedMap){

    lastSelectedMap = data.selectedMap;

    if(data.selectedMap > 0){

        playMapSelection(data.selectedMap);


};
}



const card = document.querySelector(`#map${data.selectedMap}`);
    

    for(let i = 1; i <= 5; i++){

    const img = document.getElementById(`map${i}Img`);
    const name = document.getElementById(`map${i}Name`);
    const map = data[`map${i}`];

    name.textContent = map || "";

    if(map){
 img.style.display = "block";
        img.src = `../maps/${map}.png`;

    }else{

        img.removeAttribute("src");
img.style.display = "none";

    }

}

    const currentRound = data.currentMap;

document
.querySelectorAll(".map-card")
.forEach((card, index) => {

    const roundNumber = index + 1;

    if(currentRound > roundNumber){

        card.classList.add("previous-round");

    }else{

        card.classList.remove("previous-round");

    }

});

    
if(currentRound){

    const ban1 = data[`ban${currentRound}_1`];
    const ban2 = data[`ban${currentRound}_2`];

    if(ban1 && lastBans[`ban${currentRound}_1`] !== ban1){

        lastBans[`ban${currentRound}_1`] = ban1;

        playBanAnimation(
            `ban${currentRound}_1`,
            ban1
        );

    }

    if(ban2 && lastBans[`ban${currentRound}_2`] !== ban2){

        lastBans[`ban${currentRound}_2`] = ban2;

        playBanAnimation(
            `ban${currentRound}_2`,
            ban2
        );

    }

}

});           
