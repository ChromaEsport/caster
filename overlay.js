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

    // Détection d'un changement de score
    if (
        previousScore1 !== null &&
        (
            data.score1 !== previousScore1 ||
            data.score2 !== previousScore2
        )
    ) {

        const score = document.querySelector(".score");

        score.classList.remove("animate");

        // Force le navigateur à rejouer l'animation
        void score.offsetWidth;

        score.classList.add("animate");
    }

    // Mise à jour des anciennes valeurs
    previousScore1 = data.score1;
    previousScore2 = data.score2;

    // Mise à jour de l'overlay
    document.getElementById("team1").textContent = data.team1;

    document.getElementById("team2").textContent = data.team2;

    document.getElementById("score1").textContent = data.score1;

    document.getElementById("score2").textContent = data.score2;

    document.getElementById("map").textContent = data.map;

    document.getElementById("mapCurrent").textContent = data.mapCurrent;

    document.getElementById("mapTotal").textContent = data.mapTotal;

});
