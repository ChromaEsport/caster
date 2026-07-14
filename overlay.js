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

        const score1Element = document.getElementById("score1");
const score2Element = document.getElementById("score2");

if (
    previousScore1 !== null &&
    data.score1 !== previousScore1
) {

    score1Element.classList.remove("animate");
    void score1Element.offsetWidth;
    score1Element.classList.add("animate");

}

if (
    previousScore2 !== null &&
    data.score2 !== previousScore2
) {

    score2Element.classList.remove("animate");
    void score2Element.offsetWidth;
    score2Element.classList.add("animate");

}
    }

    // Mise à jour des anciennes valeurs
    previousScore1 = data.score1;
    previousScore2 = data.score2;

    // Mise à jour de l'overlay
    document.getElementById("team1").textContent =
    data.team1.toUpperCase();

    document.getElementById("team2").textContent =
    data.team2.toUpperCase();

    document.getElementById("score1").textContent = data.score1;

    document.getElementById("score2").textContent = data.score2;

    document.getElementById("map").textContent =
    data.map.toUpperCase();

});
