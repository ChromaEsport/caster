import {
    db,
    doc,
    onSnapshot
} from "./firebase.js";


/* =========================================================
   CHROMA ESPORT — DOFUS OVERLAY
   Connexion au Control Panel Chroma
   ========================================================= */


/* ---------------------------------------------------------
   DOCUMENT FIREBASE

   Même document que le Control Panel :

   matches/current
   --------------------------------------------------------- */

const matchRef = doc(
    db,
    "matches",
    "current"
);


/* ---------------------------------------------------------
   ÉLÉMENTS HTML
   --------------------------------------------------------- */

const team1Element = document.getElementById("team1");
const team2Element = document.getElementById("team2");

const score1Element = document.getElementById("score1");
const score2Element = document.getElementById("score2");


/* ---------------------------------------------------------
   DONNÉES PAR DÉFAUT
   --------------------------------------------------------- */

const defaultMatch = {

    team1: "ÉQUIPE 1",

    team2: "ÉQUIPE 2",

    score1: 0,

    score2: 0

};


/* ---------------------------------------------------------
   AFFICHAGE
   --------------------------------------------------------- */

function updateOverlay(data) {

    /*
        Si Firebase n'a pas encore de données,
        on utilise les valeurs par défaut.
    */

    const match = {

        ...defaultMatch,

        ...data

    };


    /* ÉQUIPE 1 */

    team1Element.textContent =
        match.team1 || "ÉQUIPE 1";


    /* SCORE 1 */

    score1Element.textContent =
        Number(match.score1) || 0;


    /* SCORE 2 */

    score2Element.textContent =
        Number(match.score2) || 0;


    /* ÉQUIPE 2 */

    team2Element.textContent =
        match.team2 || "ÉQUIPE 2";

}


/* ---------------------------------------------------------
   CONNEXION TEMPS RÉEL FIREBASE
   --------------------------------------------------------- */

onSnapshot(

    matchRef,

    (snapshot) => {

        if (!snapshot.exists()) {

            console.log(
                "Aucun match trouvé dans matches/current"
            );

            updateOverlay(defaultMatch);

            return;
        }


        const data = snapshot.data();


        console.log(
            "Match reçu :",
            data
        );


        updateOverlay(data);

    },

    (error) => {

        console.error(
            "Erreur Firebase :",
            error
        );

    }

);


/* ---------------------------------------------------------
   INITIALISATION
   --------------------------------------------------------- */

updateOverlay(defaultMatch);
