import {
db,
doc,
setDoc,
onSnapshot
} from "./firebase.js";



let score1 = 0;
let score2 = 0;



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


map:
document.getElementById("map").value


});


alert("Score envoyé !");


}

window.addScore1 = addScore1;
window.removeScore1 = removeScore1;

window.addScore2 = addScore2;
window.removeScore2 = removeScore2;

window.sendMatch = sendMatch;
