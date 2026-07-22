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



const welcome = document.querySelector(".welcome");

const line1 = document.getElementById("welcome-line1");

const line2 = document.getElementById("welcome-line2");

const socialLogo = document.getElementById("socialLogo");

const text1 = "Merci à tous pour votre SOUTIEN";

const text2 = "Le stream est maintenant terminé";

const socialCard = document.querySelector(".social-card");

const socialsContainer = document.querySelector(".socials");



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


    },10000);


}



function hideWelcome(){


    welcome.classList.remove("show");



    setTimeout(()=>{


        showWelcome();


    },1000);


}



setTimeout(showWelcome,1000);

const socials = [

    {
        logo:"../asset/instagram.svg",
        name:"INSTAGRAM",
        value:"@chroma.esport_"
    },

    {
        logo:"../asset/tiktok.svg",
        name:"TIKTOK",
        value:"@chroma.esport_"
    },

    {
        logo:"../asset/discord.svg",
        name:"DISCORD",
        value:"https://discord.gg/SSF8V28QDK"
    },

    {
        logo:"../asset/youtube.svg",
        name:"YOUTUBE",
        value:"@chroma.esport"
    }

];

let current = 0;

const socialContent = document.getElementById("socialContent");

function updateSocial(){

    socialLogo.src = socials[current].logo;

    document.getElementById("socialName").textContent =
        socials[current].name;

    document.getElementById("socialValue").textContent =
        socials[current].value;

}

function changeSocial(){

    // Animation de sortie de la carte
    socialCard.classList.add("hide");


    setTimeout(()=>{


        // Passage au réseau suivant
        current++;

        if(current >= socials.length)
            current = 0;



        // Mise à jour du contenu

        socialLogo.src = socials[current].logo;


        document.getElementById("socialName").textContent =
            socials[current].name;


        document.getElementById("socialValue").textContent =
            socials[current].value;



        // Animation de retour

        socialCard.classList.remove("hide");


    },500);

}
setTimeout(()=>{

    socialsContainer.classList.add("show");
    
    socialCard.classList.add("show");
    
    updateSocial();

},9000);


setInterval(changeSocial,3000);

