import {
db,
doc,
onSnapshot
} from "./firebase.js";

console.log("=================================");
console.log("CHROMA DOFUS OVERLAY");
console.log("Script chargé");
console.log("=================================");

const matchRef = doc(
db,
"matches",
"current"
);

console.log("Écoute Firebase :", matchRef.path);

onSnapshot(
matchRef,


(snapshot) => {

    console.log("🔥 SNAPSHOT REÇU");

    console.log("Document existe :", snapshot.exists());


    if (!snapshot.exists()) {

        console.warn(
            "⚠️ Le document matches/current n'existe pas."
        );

        return;
    }


    const data = snapshot.data();


    console.log(
        "📡 DONNÉES FIREBASE :",
        data
    );


    console.log(
        "Équipe 1 :",
        data.team1
    );

    console.log(
        "Score 1 :",
        data.score1
    );

    console.log(
        "Équipe 2 :",
        data.team2
    );

    console.log(
        "Score 2 :",
        data.score2
    );


    /*
    ============================================
    MISE À JOUR DE L'OVERLAY
    ============================================
    */

    document.getElementById("team1").textContent =
        data.team1 || "ÉQUIPE 1";


    document.getElementById("score1").textContent =
        data.score1 ?? 0;


    document.getElementById("team2").textContent =
        data.team2 || "ÉQUIPE 2";


    document.getElementById("score2").textContent =
        data.score2 ?? 0;


    console.log(
        "✅ OVERLAY MIS À JOUR"
    );

},


(error) => {

    console.error(
        "❌ ERREUR FIREBASE"
    );

    console.error(error);

    console.error(
        "Code erreur :",
        error.code
    );

    console.error(
        "Message :",
        error.message
    );

}


);
