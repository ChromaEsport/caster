import {
    db,
    doc,
    onSnapshot
} from "../firebase.js";



const matchRef = doc(
    db,
    "matches",
    "current"
);



onSnapshot(matchRef, (doc) => {


    const data = doc.data();


    if (!data) return;



    document.querySelector(".event").textContent =
        data.event || "FACEIT MATCH";



    document.querySelector(".team1").textContent =
        data.team1 || "CHROMA";



    document.querySelector(".team2").textContent =
        data.team2 || "ADVERSAIRE";


});
