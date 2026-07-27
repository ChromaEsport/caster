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

const ban1_1Slot = document.getElementById("ban1_1Slot");
const ban1_1Img = document.getElementById("ban1_1Img");

let lastBan1_1 = "";


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

onSnapshot(draftRef, (docSnap) => {

    const data = docSnap.data();

    if (!data) return;

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

    if(data.ban1_1 !== lastBan1_1){

    lastBan1_1 = data.ban1_1;

    // On remet le slot à zéro
    ban1_1Slot.classList.remove("show");
    ban1_1Slot.classList.remove("play");
    ban1_1Slot.classList.remove("banned");

    // Petit délai pour relancer l'animation
    setTimeout(()=>{

        // Affiche le bandeau BAN
        ban1_1Slot.classList.add("play");

        // Après 450 ms
        setTimeout(()=>{

            // Charge le héros
            ban1_1Img.src = `../heroes/${data.ban1_1}.png`;

            // Cache le bandeau
            ban1_1Slot.classList.remove("play");

            // Affiche le portrait avec un zoom
            ban1_1Slot.classList.add("show");

            ban1_1Slot.classList.add("banned");

            ban1_1Slot.classList.add("glow");

setTimeout(()=>{

    ban1_1Slot.classList.remove("glow");

},800);

        },450);

    },50);

}
    
    //document.getElementById("ban1_2Img").src =`../heroes/${data.ban1_2}.png`;


});
