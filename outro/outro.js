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
        value:"@chroma.esport_",
        class:"instagram"
    },

    {
        logo:"../asset/tiktok.svg",
        name:"TIKTOK",
        value:"@chroma.esport_",
        class:"tiktok"
    },

    {
        logo:"../asset/discord.svg",
        name:"DISCORD",
        value:"https://discord.gg/SSF8V28QDK",
        class:"discord"
    },

    {
        logo:"../asset/youtube.svg",
        name:"YOUTUBE",
        value:"@chroma.esport",
        class:"youtube"
    }

];

let current = 0;

const socialContent = document.getElementById("socialContent");

function updateCardColor(){

    socialCard.className = "social-card";

    socialCard.classList.add(
        socials[current].class
    );

}

function updateSocial(){

    socialLogo.src = socials[current].logo;

    document.getElementById("socialName").textContent =
        socials[current].name;

    document.getElementById("socialValue").textContent =
        socials[current].value;

     updateCardColor();
}

function changeSocial(){


    socialCard.classList.add("change");


    setTimeout(()=>{


        current++;


        if(current >= socials.length)
            current = 0;



        socialLogo.src = socials[current].logo;


        document.getElementById("socialName").textContent =
            socials[current].name;


        document.getElementById("socialValue").textContent =
            socials[current].value;

        updateCardColor();

        socialCard.classList.remove("change");


    },500);


}
setTimeout(()=>{


    socialsContainer.style.opacity = "1";

    socialCard.classList.add("visible");

    updateSocial();


    setInterval(changeSocial,3000);


},9000);
