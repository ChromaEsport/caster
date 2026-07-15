import {
    db,
    doc,
    onSnapshot
} from "./firebase.js";



const matchRef = doc(
    db,
    "matches",
    "current"
);



onSnapshot(matchRef, (doc) => {


    const data = doc.data();


    if (!data) return;



    document.getElementById("casters").textContent =
    data.casters || "PSEUDO CASTER";



    document.getElementById("event").textContent =
    data.event || "NOM EVENEMENT";


});
const casterCard = document.querySelector(".caster-card");


setTimeout(() => {

    casterCard.classList.add("show");

}, 500);
