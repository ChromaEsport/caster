/* =========================================================
CHROMA ESPORT — DOFUS OVERLAY
Prototype 01
========================================================= */

/*
DONNÉES DE TEST

```
Ces valeurs seront remplacées par les données
provenant du Control Panel / Firebase.
```

*/

const match = {
team1: "CHROMA ESPORT",
score1: 1,


team2: "ADVERSAIRE",
score2: 0


};

/* ---------------------------------------------------------
AFFICHAGE
--------------------------------------------------------- */

function updateOverlay() {


const team1Element = document.getElementById("team1");
const team2Element = document.getElementById("team2");

const score1Element = document.getElementById("score1");
const score2Element = document.getElementById("score2");


if (team1Element) {
    team1Element.textContent = match.team1;
}

if (team2Element) {
    team2Element.textContent = match.team2;
}

if (score1Element) {
    score1Element.textContent = match.score1;
}

if (score2Element) {
    score2Element.textContent = match.score2;
}


}

/* ---------------------------------------------------------
INITIALISATION
--------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {


updateOverlay();


});
