import {
db,
doc,
setDoc,  
onSnapshot
} from "./firebase.js";


let currentMapNumber = 1;

const maps = [
    "Antarctic Peninsula",
    "Busan",
    "Circuit Royal",
    "Colosseo",
    "Dorado",
    "Eichenwalde",
    "Esperança",
    "Hanaoka",
    "Havana",
    "Hollywood",
    "Ilios",
    "Junk City",
    "King's Row",
    "Lijiang Tower",
    "Midtown",
    "Nepal",
    "New Junk City",
    "New Queen Street",
    "Numbani",
    "Oasis",
    "Paraíso",
    "Route 66",
    "Runasapi",
    "Samoa",
    "Shambali Monastery",
    "Suravasa",
    "Temple of Anubis",
];

const heroes = [
    "Ana",
    "Ashe",
    "Baptiste",
    "Bastion",
    "Brigitte",
    "Cassidy",
    "D.Va",
    "Doomfist",
    "Echo",
    "Freja",
    "Genji",
    "Hanzo",
    "Hazard",
    "Illari",
    "Junker Queen",
    "Junkrat",
    "Juno",
    "Kiriko",
    "Lifeweaver",
    "Lúcio",
    "Mauga",
    "Mei",
    "Mercy",
    "Moira",
    "Orisa",
    "Pharah",
    "Ramattra",
    "Reaper",
    "Reinhardt",
    "Roadhog",
    "Sigma",
    "Sojourn",
    "Soldier: 76",
    "Sombra",
    "Symmetra",
    "Torbjörn",
    "Tracer",
    "Venture",
    "Widowmaker",
    "Winston",
    "Wrecking Ball",
    "Zarya",
    "Zenyatta"
];

heroes.sort((a, b) => a.localeCompare(b));

const heroSelect = document.getElementById("heroSelect");

heroes.forEach(hero => {

    const option = document.createElement("option");

    option.value = hero;
    option.textContent = hero;

    heroSelect.appendChild(option);

});

maps.sort((a, b) => a.localeCompare(b));

const mapSelect = document.getElementById("mapSelect");

maps.forEach(map => {

    const option = document.createElement("option");

    option.value = map;
    option.textContent = map;

    mapSelect.appendChild(option);

});

let score1 = 0;
let score2 = 0;


const matchRef = doc(
db,
"matches",
"current"
);

const draftRef = doc(
    db,
    "draft",
    "current"
);

onSnapshot(matchRef,(doc)=>{

const data = doc.data();


if(data){


score1 = data.score1;
score2 = data.score2;


document.getElementById("team1").value =
data.team1;


document.getElementById("team2").value =
data.team2;


document.getElementById("score1").innerHTML =
data.score1;


document.getElementById("score2").innerHTML =
data.score2;

document.getElementById("casters").value =
data.casters || "";


document.getElementById("event").value =
data.event || "";
    

}


});

function addScore1(){

score1++;

document.getElementById("score1").innerHTML = score1;

}


function removeScore1(){

if(score1 > 0){
score1--;
}

document.getElementById("score1").innerHTML = score1;

}



function addScore2(){

score2++;

document.getElementById("score2").innerHTML = score2;

}


function removeScore2(){

if(score2 > 0){
score2--;
}

document.getElementById("score2").innerHTML = score2;

}



async function sendMatch(){


const matchRef = doc(
db,
"matches",
"current"
);



await setDoc(matchRef,{

team1:
document.getElementById("team1").value,


team2:
document.getElementById("team2").value,


score1: score1,


score2: score2,

    
casters:
document.getElementById("casters").value.toUpperCase(),


event:
document.getElementById("event").value.toUpperCase(),




});


alert("Score envoyé !");


}


function selectMap(mapNumber){

currentMapNumber = Number(mapNumber);


// enlève la sélection des autres boutons

document
.querySelectorAll(".round-btn")
.forEach(button=>{

button.classList.remove("active");

});


// active le bouton choisi

document
.getElementById(`round${mapNumber}`)
.classList.add("active");



document.getElementById("selectedRound").innerHTML =
"Manche sélectionnée : Manche " + currentMapNumber;



console.log(
"Manche préparée :",
currentMapNumber
);

}

async function sendMap(){


const mapName =
document.getElementById("mapSelect").value;


let data = {};


data[`map${currentMapNumber}`] = mapName;


data.currentMap = currentMapNumber;


// déclenche l'animation
data.selectedMap = currentMapNumber;


await setDoc(
draftRef,
data,
{merge:true}
);


console.log(
"Map envoyée :",
mapName
);


}

async function sendBan1(){

    const hero =
        document.getElementById("heroSelect").value;

    let data = {};

    data[`ban${currentMapNumber}_1`] = hero;

    await setDoc(
        draftRef,
        data,
        { merge: true }
    );

    console.log(
        `Ban 1 envoyé : ${hero}`
    );

}

async function sendBan2(){

    const hero =
        document.getElementById("heroSelect").value;

    let data = {};

    data[`ban${currentMapNumber}_2`] = hero;

    await setDoc(
        draftRef,
        data,
        { merge: true }
    );

    console.log(
        `Ban 2 envoyé : ${hero}`
    );

}

async function resetDraft(){

    await setDoc(draftRef,{

        currentMap: 0,
        selectedMap: 0,

        map1:"",
        map2:"",
        map3:"",
        map4:"",
        map5:"",

        ban1_1:"",
        ban1_2:"",
        ban2_1:"",
        ban2_2:"",
        ban3_1:"",
        ban3_2:"",
        ban4_1:"",
        ban4_2:"",
        ban5_1:"",
        ban5_2:""

    });

    console.log("Draft réinitialisé");

}

window.addScore1 = addScore1;
window.removeScore1 = removeScore1;

window.addScore2 = addScore2;
window.removeScore2 = removeScore2;

window.sendMatch = sendMatch;

window.selectMap = selectMap;
window.sendMap = sendMap;

window.sendBan1 = sendBan1;
window.sendBan2 = sendBan2;

window.resetDraft = resetDraft;
