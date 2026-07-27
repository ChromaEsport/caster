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

onSnapshot(draftRef, (docSnap) => {

    const data = docSnap.data();

    if (!data) return;

    // Retire les anciennes sélections
document.querySelectorAll(".map-card").forEach(card=>{

    card.classList.remove("selected");
    card.classList.remove("dim");

});

// Si une map est sélectionnée
if(data.selectedMap > 0){

    document.querySelectorAll(".map-card").forEach(card=>{

        card.classList.add("dim");

    });

    document
        .querySelector(`#map${data.selectedMap}`)
        .classList.remove("dim");

    document
        .querySelector(`#map${data.selectedMap}`)
        .classList.add("selected");

}

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

    document.getElementById("ban1_1Img").src =`../heroes/${data.ban1_1}.png`;
    console.log(`../heroes/${data.ban1_1}.png`);
    
    //document.getElementById("ban1_2Img").src =`../heroes/${data.ban1_2}.png`;


});
