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
"dofusMatches",
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
        "Équipe A :",
        data.teamA
    );

    console.log(
        "Score A :",
        data.scoreA
    );

    console.log(
        "Équipe B :",
        data.teamB
    );

    console.log(
        "Score B :",
        data.scoreB
    );


    /*
    ============================================
    MISE À JOUR DE L'OVERLAY
    ============================================
    */

    document.getElementById("teamA").textContent =
        data.teamA || "ÉQUIPE A";


    document.getElementById("scoreA").textContent =
        data.scoreA ?? 0;


    document.getElementById("teamB").textContent =
        data.teamB || "ÉQUIPE B";


    document.getElementById("scoreB").textContent =
        data.scoreB ?? 0;


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
