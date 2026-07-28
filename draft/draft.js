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

    // Affichage
    slot.classList.remove("play");
    slot.classList.add("show");
    slot.classList.add("banned");
    slot.classList.add("glow");

    await sleep(800);

    slot.classList.remove("glow");

}


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
    .querySelectorAll(".hero-ban")
    .forEach(img=>{

        img.src = "";

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

}



    if(data.selectedMap !== lastSelectedMap){

    lastSelectedMap = data.selectedMap;

    if(data.selectedMap > 0){

        playMapSelection(data.selectedMap);

    }

}
    

const card = document.querySelector(`#map${data.selectedMap}`);
    

    document.getElementById("map1Name").textContent = data.map1;
    document.getElementById("map1Img").src =`../maps/${data.map1}.png`;

    document.getElementById("map2Name").textContent = data.map2;
    document.getElementById("map2Img").src = `../maps/${data.map2}.png`;

    document.getElementById("map3Name").textContent = data.map3;
    document.getElementById("map3Img").src = `../maps/${data.map3}.png`;

    document.getElementById("map4Name").textContent = data.map4;
    document.getElementById("map4Img").src = `../maps/${data.map4}.png`;

    document.getElementById("map5Name").textContent = data.map5;
    document.getElementById("map5Img").src = `../maps/${data.map5}.png`;

    const currentRound = data.currentMap;

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
    
    //document.getElementById("ban1_2Img").src =`../heroes/${data.ban1_2}.png`;


});
