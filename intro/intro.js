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
const welcome = document.querySelector(".welcome");
const text = document.getElementById("welcome-text");


const message = "BIENVENUE SUR LE LIVE";


let index = 0;



function typeWriter(){


    if(index < message.length){

        text.textContent += message.charAt(index);

        index++;

        setTimeout(typeWriter,80);

    }


}



function showWelcome(){


    welcome.classList.add("show");


    text.textContent="";

    index=0;


    typeWriter();



    setTimeout(()=>{


        welcome.classList.remove("show");


    },6000);


}



setTimeout(showWelcome,1000);
