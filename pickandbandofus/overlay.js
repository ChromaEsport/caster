/*

* Chroma Esport — Overlay Pick & Ban
* Fichier prévu pour fonctionner avec un control.js séparé.
*
* Le panneau de contrôle peut envoyer les mises à jour avec :
* localStorage.setItem("chromaDraftState", JSON.stringify(state));
*
* Pour une synchronisation entre deux pages OBS/control ouvertes
* dans le même navigateur, le stockage local peut suffire.
* Pour deux appareils ou navigateurs différents, il faut un backend
* commun (Firebase, WebSocket, etc.).
  */

const DRAFT_CLASSES = [
"Féca", "Osamodas", "Enutrof", "Sram",
"Xélor", "Écaflip", "Éniripsa", "Iop",
"Cra", "Sadida", "Sacrieur", "Pandawa",
"Roublard", "Zobal", "Steamer", "Eliotrope",
"Huppermage", "Ouginak", "Forgelance"
];

/*

* Remplace les noms ci-dessous par les noms exacts de tes cartes
* disponibles. Les chemins d'images peuvent être renseignés ensuite.
  */
  const DEFAULT_MAPS = [
  { name: "Carte 01", image: "" },
  { name: "Carte 02", image: "" },
  { name: "Carte 03", image: "" },
  { name: "Carte 04", image: "" },
  { name: "Carte 05", image: "" }
  ];

const DEFAULT_STATE = {
teamA: "ÉQUIPE A",
teamB: "ÉQUIPE B",
map: null,
mapLocked: false,
actions: [],
picks: {
A: { J1: null, J2: null, J3: null },
B: { J1: null, J2: null, J3: null }
},
bans: {
A: [],
B: []
}
};

const STORAGE_KEY = "chromaDraftState";

function readState() {
try {
const saved = localStorage.getItem(STORAGE_KEY);
if (!saved) return structuredClone(DEFAULT_STATE);


    const parsed = JSON.parse(saved);
    return {
        ...structuredClone(DEFAULT_STATE),
        ...parsed,
        picks: parsed.picks || structuredClone(DEFAULT_STATE.picks),
        bans: parsed.bans || structuredClone(DEFAULT_STATE.bans),
        actions: Array.isArray(parsed.actions) ? parsed.actions : []
    };
} catch (error) {
    console.error("Impossible de lire l'état du draft :", error);
    return structuredClone(DEFAULT_STATE);
}


}

function characterImage(character) {
/*
* Optionnel : ajoute ici les chemins des portraits.
* Exemple :
* const images = { "Féca": "../dofus/classes/feca.png" };
*/
const images = {};
return images[character] || "";
}

function escapeHTML(value) {
return String(value ?? "").replace(/[&<>"']/g, char => ({
"&": "&",
"<": "<",
">": ">",
'"': """,
"'": "'"
})[char]);
}

function renderPlayer(team, player) {
const state = readState();
const pick = state.picks?.[team]?.[player] || null;
const bans = (state.bans?.[team] || [])
.filter(ban => ban.player === player)
.slice(0, 2);


const pickImage = pick?.character ? characterImage(pick.character) : "";

const pickMarkup = pick
    ? `
        <img src="${escapeHTML(pickImage)}" alt="">
        <span class="pick-badge">${team}-${player}</span>
        <div class="character-name">${escapeHTML(pick.character)}</div>
    `
    : `
        <div class="pick-placeholder">?</div>
        <span class="pick-badge">${team}-${player}</span>
        <div class="character-name">PICK EN ATTENTE</div>
    `;

let banMarkup = "";

for (let i = 0; i < 2; i++) {
    const ban = bans[i];

    if (ban) {
        const image = characterImage(ban.character);
        banMarkup += `
            <div class="ban-card">
                ${image ? `<img src="${escapeHTML(image)}" alt="">` : ""}
                <span class="ban-badge">${escapeHTML(ban.team || team)}</span>
                <div class="ban-name">${escapeHTML(ban.character)}</div>
            </div>
        `;
    } else {
        banMarkup += `
            <div class="ban-card">
                <div class="ban-placeholder">—</div>
            </div>
        `;
    }
}

return `
    <article class="player-card">
        <div class="player-label">${player}</div>
        <div class="pick-card">${pickMarkup}</div>
        <div class="bans-label">BANS</div>
        <div class="bans">${banMarkup}</div>
    </article>
`;


}

function renderTeams(state) {
document.getElementById("teamAName").textContent = state.teamA || "ÉQUIPE A";
document.getElementById("teamBName").textContent = state.teamB || "ÉQUIPE B";


document.getElementById("playersA").innerHTML =
    ["J1", "J2", "J3"].map(player => renderPlayer("A", player)).join("");

document.getElementById("playersB").innerHTML =
    ["J1", "J2", "J3"].map(player => renderPlayer("B", player)).join("");


}

function renderMap(state) {
const mapName = document.getElementById("mapName");
const mapStatus = document.getElementById("mapStatus");
const mapArt = document.getElementById("mapArt");


if (!state.map) {
    mapName.textContent = "EN ATTENTE";
    mapStatus.textContent = "TIRAGE NON EFFECTUÉ";
    mapArt.style.backgroundImage = "";
    return;
}

mapName.textContent = state.map.name || "CARTE DU MATCH";
mapStatus.textContent = state.mapLocked ? "CARTE VERROUILLÉE" : "CARTE TIRÉE";

if (state.map.image) {
    mapArt.style.backgroundImage =
        `linear-gradient(rgba(1,12,44,.45), rgba(1,12,44,.8)), url("${state.map.image}")`;
    mapArt.style.backgroundSize = "cover";
    mapArt.style.backgroundPosition = "center";
} else {
    mapArt.style.backgroundImage = "";
}


}

function renderTimeline(state) {
const timeline = document.getElementById("timeline");
const actions = state.actions || [];


document.getElementById("actionCount").textContent =
    `${actions.length} ACTION${actions.length > 1 ? "S" : ""}`;

if (!actions.length) {
    timeline.innerHTML =
        '<div class="timeline-empty">Les actions de pick et ban apparaîtront ici.</div>';
    return;
}

timeline.innerHTML = actions.map((action, index) => {
    const type = action.type === "ban" ? "ban" : "pick";
    const team = action.team === "B" ? "B" : "A";
    const arrow = team === "A" ? "➜" : "⟵";
    const owner = type === "pick"
        ? `${team}-${action.player || "J1"}`
        : `Équipe ${team}`;

    return `
        <div class="timeline-item team-${team.toLowerCase()} ${type}">
            <span class="timeline-arrow">${arrow}</span>
            <div class="timeline-info">
                <small>${index + 1}. ${type.toUpperCase()} · ${owner}</small>
                <span>${escapeHTML(action.character || "Classe inconnue")}</span>
            </div>
        </div>
    `;
}).join("");

timeline.scrollLeft = timeline.scrollWidth;


}

function renderClasses(state) {
const classList = document.getElementById("classList");
const usage = new Map();


for (const team of ["A", "B"]) {
    for (const player of ["J1", "J2", "J3"]) {
        const pick = state.picks?.[team]?.[player];
        if (pick?.character) {
            usage.set(pick.character, {
                team,
                label: `${team}-${player}`,
                type: "pick"
            });
        }
    }

    for (const ban of state.bans?.[team] || []) {
        if (ban?.character) {
            usage.set(ban.character, {
                team: ban.team || team,
                label: ban.team || team,
                type: "ban"
            });
        }
    }
}

classList.innerHTML = DRAFT_CLASSES.map(character => {
    const used = usage.get(character);
    const image = characterImage(character);

    return `
        <div class="class-tile ${used ? "used" : ""} ${used?.type === "ban" ? "banned" : ""}">
            ${image ? `<img src="${escapeHTML(image)}" alt="">` : ""}
            <span class="class-name">${escapeHTML(character)}</span>
            ${used ? `<span class="class-owner">${escapeHTML(used.label)}</span>` : ""}
        </div>
    `;
}).join("");


}

function render() {
const state = readState();


renderTeams(state);
renderMap(state);
renderTimeline(state);
renderClasses(state);

document.getElementById("matchStatus").textContent =
    state.actions?.length ? "DRAFT EN COURS" : "EN ATTENTE DU DRAFT";


}

window.addEventListener("storage", event => {
if (event.key === STORAGE_KEY) render();
});

window.addEventListener("DOMContentLoaded", render);
window.addEventListener("focus", render);

render();
