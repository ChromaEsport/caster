import {
db,
doc,
onSnapshot
}
from "./firebase.js";


const matchRef = doc(
db,
"matches",
"current"
);


let previousScore1 = null;
let previousScore2 = null;


onSnapshot(matchRef, (doc) => {


    const data = doc.data();


    if (!data) return;



    const team1Element = document.getElementById("team1");
    const team2Element = document.getElementById("team2");

    const score1Element = document.getElementById("score1");
    const score2Element = document.getElementById("score2");



    // Animation score équipe 1

    if (
        previousScore1 !== null &&
        data.score1 !== previousScore1
    ) {

        score1Element.classList.remove("animate");

        void score1Element.offsetWidth;

        score1Element.classList.add("animate");

    }



    // Animation score équipe 2

    if (
        previousScore2 !== null &&
        data.score2 !== previousScore2
    ) {

        score2Element.classList.remove("animate");

        void score2Element.offsetWidth;

        score2Element.classList.add("animate");

    }



    // Mise à jour des équipes

    team1Element.textContent =
    data.team1.toUpperCase();


    team2Element.textContent =
    data.team2.toUpperCase();



    // Retire les anciennes couleurs

    team1Element.classList.remove("chroma-team");

    team2Element.classList.remove("chroma-team");



    // Ajoute la couleur Chroma automatiquement

    if(data.team1.toUpperCase() === "CHROMA") {

        team1Element.classList.add("chroma-team");

    }


    if(data.team2.toUpperCase() === "CHROMA") {

        team2Element.classList.add("chroma-team");

    }



    // Mise à jour scores

    score1Element.textContent =
    data.score1;


    score2Element.textContent =
    data.score2;



    // Mise à jour carte

    document.getElementById("map").textContent =
    data.map.toUpperCase();



    // Sauvegarde ancien score

    previousScore1 = data.score1;

    previousScore2 = data.score2;


});
