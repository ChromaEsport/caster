import {
db,
doc,
onSnapshot
}
from "./firebase.js";



const matchRef = doc(
db,
"matches",
"current"
);



onSnapshot(matchRef,(doc)=>{


const data = doc.data();


if(data){


document.getElementById("team1").innerHTML =
data.team1;


document.getElementById("team2").innerHTML =
data.team2;


document.getElementById("score1").innerHTML =
data.score1;


document.getElementById("score2").innerHTML =
data.score2;


document.getElementById("map").innerHTML =
data.map;


document.getElementById("mapCurrent").innerHTML =
data.mapCurrent;


document.getElementById("mapTotal").innerHTML =
data.mapTotal;


}


});