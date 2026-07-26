import {
    db,
    doc,
    onSnapshot
} from "../firebase.js";

const draftRef = doc(
    db,
    "draft",
    "current"
);

onSnapshot(draftRef, (docSnap) => {

    const data = docSnap.data();

    if (!data) return;

    document.getElementById("map1").textContent = data.map1 || "MAP 1";
    document.getElementById("map2").textContent = data.map2 || "MAP 2";
    document.getElementById("map3").textContent = data.map3 || "MAP 3";
    document.getElementById("map4").textContent = data.map4 || "MAP 4";
    document.getElementById("map5").textContent = data.map5 || "MAP 5";

});
