import {
    db,
    doc,
    onSnapshot
} from "../dofus-firebase.js";



const matchRef = doc(
    db,
    "dofusMatches",
    "current"
);



onSnapshot(matchRef, (snapshot) => {
    const data = snapshot.data();

    if (!data) return;

    document.querySelector(".event").textContent =
        data.eventName || "ÉVÉNEMENT DOFUS";

    document.querySelector(".team1").textContent =
        data.teamA || "ÉQUIPE A";

    document.querySelector(".team2").textContent =
        data.teamB || "ÉQUIPE B";
});


const welcome = document.querySelector(".welcome");

const line1 = document.getElementById("welcome-line1");

const line2 = document.getElementById("welcome-line2");



const text1 = "BIENVENUE SUR LE LIVE";

const text2 = "LE MATCH VA COMMENCER";



let i = 0;

let j = 0;



function writeLine1(){


    if(i < text1.length){

        line1.textContent += text1.charAt(i);

        i++;

        setTimeout(writeLine1,80);

    }

    else {

        setTimeout(writeLine2,500);

    }

}



function writeLine2(){


    if(j < text2.length){

        line2.textContent += text2.charAt(j);

        j++;

        setTimeout(writeLine2,80);

    }

}



function showWelcome(){


    line1.textContent="";

    line2.textContent="";


    i=0;

    j=0;


    welcome.classList.add("show");


    writeLine1();



    setTimeout(()=>{


        hideWelcome();


    },8000);


}



function hideWelcome(){


    welcome.classList.remove("show");



    setTimeout(()=>{


        showWelcome();


    },3000);


}



setTimeout(showWelcome,1000);
