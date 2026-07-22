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
        logo:"assets/instagram.svg",
        name:"INSTAGRAM",
        value:"@chroma.esport_"
    },

    {
        logo:"assets/tiktok.svg",
        name:"TIKTOK",
        value:"@chroma.esport_"
    },

    {
        logo:"assets/discord.svg",
        name:"DISCORD",
        value:"https://discord.gg/SSF8V28QDK"
    },

    {
        logo:"assets/youtube.svg",
        name:"YOUTUBE",
        value:"@chroma.esport"
    }

];

let current = 0;

const socialContent = document.getElementById("socialContent");

function changeSocial(){

    // Disparition
    socialContent.classList.add("fade");

    setTimeout(()=>{

        current++;

        if(current >= socials.length)
            current = 0;

        document.getElementById("socialLogo").src =
            socials[current].logo;

        document.getElementById("socialName").textContent =
            socials[current].name;

        document.getElementById("socialValue").textContent =
            socials[current].value;

           // Prépare l'entrée
        socialContent.style.transform = "translateY(12px)";

        requestAnimationFrame(()=>{

            socialContent.classList.remove("fade");

            socialContent.style.transform = "translateY(0)";

        });

    },350);

}

setInterval(changeSocial,2000);
