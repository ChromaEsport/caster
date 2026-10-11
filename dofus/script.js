
import {
    db,
    doc,
    onSnapshot
} from "./firebase.js";

console.log("=================================");
console.log("CHROMA DOFUS OVERLAY");
console.log("Connexion Firebase");
console.log("=================================");

const matchRef = doc(
    db,
    "dofusMatches",
    "current"
);

const draftRef = doc(
    db,
    "dofusDraft",
    "current"
);

let matchData = {};
let draftData = {};

/*
============================================
OUTILS
============================================
*/

function getElement(id) {
    const element = document.getElementById(id);

    if (!element) {
        console.warn(`Élément HTML introuvable : #${id}`);
    }

    return element;
}

function isChroma(teamName) {
    return String(teamName || "")
        .toLowerCase()
        .includes("chroma");
}

/*
============================================
MISE À JOUR DES ÉQUIPES ET DES SCORES
============================================
*/

function renderMatch() {
    const teamA = getElement("teamA");
    const scoreA = getElement("scoreA");
    const teamB = getElement("teamB");
    const scoreB = getElement("scoreB");

    if (teamA) {
        teamA.textContent = matchData.teamA || "ÉQUIPE A";
    }

    if (scoreA) {
        scoreA.textContent = matchData.scoreA ?? 0;
    }

    if (teamB) {
        teamB.textContent = matchData.teamB || "ÉQUIPE B";
    }

    if (scoreB) {
        scoreB.textContent = matchData.scoreB ?? 0;
    }

    renderPlayers("playersA", "A");
    renderPlayers("playersB", "B");
}


/*
============================================
PORTRAITS DES CLASSES DOFUS
============================================
*/

// Chemins supposés : dossier images/classes/ dans dofus/.
// Adapte les chemins aux noms réels de tes fichiers.
const CLASS_IMAGES = {
    "Féca": "./pickandbandofus/portraits/feca.png",
    "Osamodas": "./pickandbandofus/portraits/osamodas.png",
    "Enutrof": "./pickandbandofus/portraits/enutrof.png",
    "Sram": "./pickandbandofus/portraits/sram.png",
    "Xélor": "./pickandbandofus/portraits/xelor.png",
    "Écaflip": "./pickandbandofus/portraits/ecaflip.png",
    "Éniripsa": "./pickandbandofus/portraits/eniripsa.png",
    "Iop": "./pickandbandofus/portraits/iop.png",
    "Crâ": "./pickandbandofus/portraits/crâ.png",
    "Sadida": "./pickandbandofus/portraits/sadida.png",
    "Sacrieur": "./pickandbandofus/portraits/sacrieur.png",
    "Pandawa": "./pickandbandofus/portraits/pandawa.png",
    "Roublard": "./pickandbandofus/portraits/roublard.png",
    "Zobal": "./pickandbandofus/portraits/zobal.png",
    "Steamer": "./pickandbandofus/portraits/steamer.png",
    "Eliotrope": "./pickandbandofus/portraits/eliotrope.png",
    "Huppermage": "../pickandbandofus/portraits/huppermage.png",
    "Ouginak": "./pickandbandofus/portraits/ouginak.png",
    "Forgelance": "./pickandbandofus/portraits/forgelance.png"
};

function getClassImage(className) {
    return CLASS_IMAGES[className] || "";
}

/*
============================================
JOUEURS CHROMA ET PERSONNAGES
============================================
*/

function renderPlayers(containerId, teamKey) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.replaceChildren();

    const teamName = teamKey === "A"
        ? matchData.teamA
        : matchData.teamB;

    // Les joueurs s'affichent uniquement du côté Chroma.
    if (!isChroma(teamName)) {
        return;
    }

    const actions = Array.isArray(draftData.actions)
        ? draftData.actions
        : [];

    const picks = actions.filter(action =>
        action.type === "pick" &&
        action.team === teamKey
    );

    const playerIds = ["J1", "J2", "J3"];

    playerIds.forEach((playerId, index) => {
        // Cherche le pick attribué à ce joueur.
        // Si aucun joueur n'est renseigné dans le pick,
        // utilise l'ordre des picks de son équipe.
        const action = picks.find(item =>
            item.player === playerId
        ) || picks[index];

        const playerName =
            matchData[`chroma${playerId}`] || playerId;

        const characterName = action
            ? (
                action.className ||
                action.character ||
                "Personnage choisi"
            )
            : "En attente";

        
const line = document.createElement("div");
line.className = "chroma-player";

const portrait = action
    ? getClassImage(characterName)
    : "";

if (portrait) {
    line.style.setProperty(
        "--class-image",
        `url("${portrait}")`
    );
} else {
    line.style.removeProperty("--class-image");
}


        const name = document.createElement("span");
        name.className = "player-name";
        name.textContent = playerName;

        const character = document.createElement("span");
        character.className = "player-class";
        character.textContent = characterName;

        line.append(name, character);
        container.appendChild(line);
    });
}

/*
============================================
AFFICHAGE DE LA MAP
============================================
*/

function renderMap() {
    const mapName = getElement("mapName");
    /*const mapImage = getElement("mapImage");*/

    if (!mapName /*|| !mapImage*/) {
        return;
    }

    const map = draftData.map;

    if (!map) {
        mapName.textContent = "MAP EN ATTENTE";
        /*mapImage.removeAttribute("src");
        mapImage.hidden = true;*/
        return;
    }

    mapName.textContent = map.name || "MAP DOFUS";

    /*if (map.image) {
        mapImage.onerror = () => {
            console.error(
                "Impossible de charger l'image de la map :",
                map.image
            );

            mapImage.hidden = true;
        };

        mapImage.onload = () => {
            mapImage.hidden = false;
        };

        mapImage.hidden = true;
        mapImage.src = map.image;
    } else {
        mapImage.removeAttribute("src");
        mapImage.hidden = true;
    }*/
}

/*
============================================
ÉCOUTE FIREBASE : MATCH
Équipes, scores et pseudos
============================================
*/

onSnapshot(
    matchRef,

    snapshot => {
        console.log("🔥 SNAPSHOT MATCH REÇU");
        console.log("Document existe :", snapshot.exists());

        if (!snapshot.exists()) {
            console.warn(
                "Le document dofusMatches/current n'existe pas."
            );
            return;
        }

        matchData = snapshot.data();

        console.log("📡 DONNÉES MATCH :", matchData);

        renderMatch();
    },

    error => {
        console.error("❌ ERREUR FIREBASE — MATCH");
        console.error(error);
        console.error("Code :", error.code);
        console.error("Message :", error.message);
    }
);

/*
============================================
ÉCOUTE FIREBASE : DRAFT
Map et picks
============================================
*/

onSnapshot(
    draftRef,

    snapshot => {
        console.log("🔥 SNAPSHOT DRAFT REÇU");

        draftData = snapshot.exists()
            ? snapshot.data()
            : {};

        console.log("📡 DONNÉES DRAFT :", draftData);

        renderMap();

        renderPlayers("playersA", "A");
        renderPlayers("playersB", "B");
    },

    error => {
        console.error("❌ ERREUR FIREBASE — DRAFT");
        console.error(error);
        console.error("Code :", error.code);
        console.error("Message :", error.message);
    }
);
