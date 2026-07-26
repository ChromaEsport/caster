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

    document.getElementById("map1Name").textContent = data.map1;
    document.getElementById("map1Img").src =`../maps/${data.map1}.png`;

    document.getElementById("map2Name").textContent = data.map2;
    document.getElementById("map2Img").src = `caster/maps/${data.map2}.png`;

    document.getElementById("map3Name").textContent = data.map3;
    document.getElementById("map3Img").src = `../maps/${data.map3}.pngp`;

    document.getElementById("map4Name").textContent = data.map4;
    document.getElementById("map4Img").src = `../asset/maps/${data.map4}.webp`;

    document.getElementById("map5Name").textContent = data.map5;
    document.getElementById("map5Img").src = `../asset/maps/${data.map5}.webp`;

});
