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


const casterOverlay = document.querySelector(".caster-border");


// Temps en millisecondes

const FIRST_DISPLAY = 120000; // 2 minutes

const HIDDEN_TIME = 300000; // 5 minutes

const DISPLAY_TIME = 60000; // 1 minute



function showCaster(){

     casterOverlay.classList.add("show");

}



function hideCaster(){

     casterOverlay.classList.remove("show");

}



// Première apparition

setTimeout(() => {


    showCaster();


    // Après 2 minutes → disparition

    setTimeout(() => {


        hideCaster();



        // Après 5 minutes caché → retour

        setTimeout(() => {


            showCaster();



            // Après 1 minute → disparition

            setTimeout(() => {


                hideCaster();


                // Relance le cycle

                startCycle();


            }, DISPLAY_TIME);



        }, HIDDEN_TIME);



    }, FIRST_DISPLAY);



}, 500);





function startCycle(){


    setTimeout(() => {


        showCaster();



        setTimeout(() => {


            hideCaster();


            startCycle();


        }, DISPLAY_TIME);



    }, HIDDEN_TIME);


}
