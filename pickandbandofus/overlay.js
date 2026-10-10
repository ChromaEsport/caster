
/*
 * Chroma Esport — Overlay Pick & Ban Dofus
 * Synchronisation en temps réel avec Firebase.
 * Projet séparé : dofus-firebase.js
 */

import {
    db,
    doc,
    onSnapshot
} from "./dofus-firebase.js";

const DRAFT_CLASSES = [
    "Féca", "Osamodas", "Enutrof", "Sram",
    "Xélor", "Écaflip", "Éniripsa", "Iop",
    "Crâ", "Sadida", "Sacrieur", "Pandawa",
    "Roublard", "Zobal", "Steamer", "Eliotrope",
    "Huppermage", "Ouginak", "Forgelance"
];

const DEFAULT_STATE = {
    teamA: "ÉQUIPE A",
    teamB: "ÉQUIPE B",
    caster1: "",
    caster2: "",
    eventName: "",
    scoreA: 0,
    scoreB: 0,
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

let currentState = structuredClone(DEFAULT_STATE);
let matchLoaded = false;
let draftLoaded = false;

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

/*
 * Images des classes.
 * Ajoute les chemins des portraits lorsque tes images seront prêtes.
 */


function characterImage(character) {
    const images = {
        "Féca": "feca.png",
        "Osamodas": "osamodas.png",
        "Enutrof": "enutrof.png",
        "Sram": "sram.png",
        "Xélor": "xelor.png",
        "Écaflip": "ecaflip.png",
        "Éniripsa": "eniripsa.png",
        "Iop": "iop.png",
        "Crâ": "crâ.png",
        "Sadida": "sadida.png",
        "Sacrieur": "sacrieur.png",
        "Pandawa": "pandawa.png",
        "Roublard": "roublard.png",
        "Zobal": "zobal.png",
        "Steamer": "steamer.png",
        "Eliotrope": "eliotrope.png",
        "Huppermage": "huppermage.png",
        "Ouginak": "ouginak.png",
        "Forgelance": "forgelance.png"
    };

    return images[character]
        ? `./portraits/${images[character]}`
        : "";
}

function characterIcon(character) {
    const images = {
        "Féca": "classe-feca.png",
        "Osamodas": "classe-osamodas.png",
        "Enutrof": "classe-enutrof.png",
        "Sram": "classe-sram.png",
        "Xélor": "classe-xelor.png",
        "Écaflip": "classe-ecaflip.png",
        "Éniripsa": "classe-eniripsa.png",
        "Iop": "classe-iop.png",
        "Crâ": "classe-crâ.png",
        "Sadida": "classe-sadida.png",
        "Sacrieur": "classe-sacrieur.png",
        "Pandawa": "classe-pandawa.png",
        "Roublard": "classe-roublard.png",
        "Zobal": "classe-zobal.png",
        "Steamer": "classe-steamer.png",
        "Eliotrope": "classe-eliotrope.png",
        "Huppermage": "classe-huppermage.png",
        "Ouginak": "classe-ouginak.png",
        "Forgelance": "classe-forgelance.png"
    };

    return images[character]
        ? `./classes/${images[character]}`
        : "";
}

function normalizeState(data = {}) {
    return {
        ...structuredClone(DEFAULT_STATE),
        ...data,
        picks: {
            A: {
                ...DEFAULT_STATE.picks.A,
                ...(data.picks?.A || {})
            },
            B: {
                ...DEFAULT_STATE.picks.B,
                ...(data.picks?.B || {})
            }
        },
        bans: {
            A: Array.isArray(data.bans?.A) ? data.bans.A : [],
            B: Array.isArray(data.bans?.B) ? data.bans.B : []
        },
        actions: Array.isArray(data.actions) ? data.actions : []
    };
}

function renderPlayer(state, team, player) {
    const pick = state.picks?.[team]?.[player] || null;

    const bans = (state.bans?.[team] || [])
        .filter(ban => ban.player === player)
        .slice(0, 2);

    const pickImage = pick?.character
        ? characterImage(pick.character)
        : "";

    
const pickMarkup = pick
    ? `
        ${pickImage
            ? `<img class="character-used" src="${escapeHTML(pickImage)}" alt="">`
            : '<div class="pick-placeholder character-used">?</div>'}
        <span class="pick-badge pick-badge-used">${team}-${player}</span>
        <div class="character-name">
            ${escapeHTML(pick.character)}
        </div>
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
                    ${image
                        ? `<img src="${escapeHTML(image)}" alt="">`
                        : ""}
                    <span class="ban-badge">
                        ${escapeHTML(ban.team || team)}
                    </span>
                    <div class="ban-name">
                        ${escapeHTML(ban.character)}
                    </div>
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
    const teamAName = document.getElementById("teamAName");
    const teamBName = document.getElementById("teamBName");
    const playersA = document.getElementById("playersA");
    const playersB = document.getElementById("playersB");

    if (teamAName) {
        teamAName.textContent = state.teamA || "ÉQUIPE A";
    }

    if (teamBName) {
        teamBName.textContent = state.teamB || "ÉQUIPE B";
    }

    if (playersA) {
        playersA.innerHTML = ["J1", "J2", "J3"]
            .map(player => renderPlayer(state, "A", player))
            .join("");
    }

    if (playersB) {
        playersB.innerHTML = ["J1", "J2", "J3"]
            .map(player => renderPlayer(state, "B", player))
            .join("");
    }
}

function renderMap(state) {
    const mapName = document.getElementById("mapName");
    const mapStatus = document.getElementById("mapStatus");
    const mapArt = document.getElementById("mapArt");

    if (!mapName || !mapStatus || !mapArt) return;

    if (!state.map) {
        mapName.textContent = "EN ATTENTE";
        mapStatus.textContent = "TIRAGE NON EFFECTUÉ";
        mapArt.style.backgroundImage = "";
        return;
    }

    mapName.textContent = state.map.name || "CARTE DU MATCH";
    mapStatus.textContent = state.mapLocked
        ? "CARTE VERROUILLÉE"
        : "CARTE TIRÉE";

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
    const actionCount = document.getElementById("actionCount");

    if (!timeline) return;

    const actions = state.actions || [];

    if (actionCount) {
        actionCount.textContent =
            `${actions.length} ACTION${actions.length > 1 ? "S" : ""}`;
    }

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
                <div class="timeline-info">
                    <small>
                        ${index + 1}. ${type.toUpperCase()} · ${owner}
                    </small>
<span>${escapeHTML(action.className || action.character || "Classe inconnue")}</span>


                </div>
            </div>
        `;
    }).join("");

    timeline.scrollLeft = timeline.scrollWidth;
}

function renderClasses(state) {
    const classList = document.getElementById("classList");
    if (!classList) return;

    const usage = new Map();

    // 1. Récupération des picks et bans depuis les actions Firebase
    const actions = Array.isArray(state.actions) ? state.actions : [];

    const pickCounters = {
        A: 0,
        B: 0
    };

    for (const action of actions) {
        const character = action.className || action.character;

        if (!character) continue;

        const team = action.team === "B" ? "B" : "A";
        const type = action.type === "ban" ? "ban" : "pick";

        if (type === "ban") {
            // Badge rouge : A ou B
            usage.set(character, {
                label: team,
                type: "ban"
            });
        } else {
            // Badge vert : A-J1, A-J2, A-J3, B-J1...
            const player = action.player || `J${pickCounters[team] + 1}`;
            pickCounters[team]++;

            usage.set(character, {
                label: `${team}-${player}`,
                type: "pick"
            });
        }
    }

    // 2. Compatibilité avec les anciennes données picks / bans
    for (const team of ["A", "B"]) {
        for (const player of ["J1", "J2", "J3"]) {
            const pick = state.picks?.[team]?.[player];

            if (pick?.character && !usage.has(pick.character)) {
                usage.set(pick.character, {
                    label: `${team}-${player}`,
                    type: "pick"
                });
            }
        }

        for (const ban of state.bans?.[team] || []) {
            if (ban?.character && !usage.has(ban.character)) {
                usage.set(ban.character, {
                    label: ban.team || team,
                    type: "ban"
                });
            }
        }
    }

    // 3. Affichage des classes
    classList.innerHTML = DRAFT_CLASSES.map(character => {
        const used = usage.get(character);
        const image = characterIcon(character);

        return `
            <div class="class-tile ${used ? "used" : ""} ${used?.type === "ban" ? "banned" : ""}">
                ${image
                    ? `<img src="${escapeHTML(image)}" alt="${escapeHTML(character)}">`
                    : ""}
                ${used
                    ? `<span class="class-owner ${used.type === "ban" ? "ban-owner" : "pick-owner"}">${escapeHTML(used.label)}</span>`
                    : ""}
            </div>
        `;
    }).join("");
}

function render() {
    const state = currentState;

    renderTeams(state);
    renderMap(state);
    renderTimeline(state);
    renderClasses(state);

    const matchStatus = document.getElementById("matchStatus");

    if (matchStatus) {
        if (!matchLoaded || !draftLoaded) {
            matchStatus.textContent = "CONNEXION À FIREBASE…";
        } else {
            matchStatus.textContent = state.actions.length
                ? "DRAFT EN COURS"
                : "EN ATTENTE DU DRAFT";
        }
    }
}

/*
 * Synchronisation des informations du match.
 * Document Firestore : dofusMatches/current
 */
onSnapshot(
    doc(db, "dofusMatches", "current"),
    snapshot => {
        if (snapshot.exists()) {
            const data = snapshot.data();

            currentState = normalizeState({
                ...currentState,
                ...data
            });
        }

        matchLoaded = true;
        render();
    },
    error => {
        console.error("Erreur Firebase — informations du match :", error);

        const status = document.getElementById("matchStatus");
        if (status) status.textContent = "ERREUR FIREBASE — MATCH";
    }
);

/*
 * Synchronisation du Pick & Ban et de la carte.
 * Document Firestore : dofusDraft/current
 */
onSnapshot(
    doc(db, "dofusDraft", "current"),
    snapshot => {
        if (snapshot.exists()) {
            const data = snapshot.data();

            currentState = normalizeState({
                ...currentState,
                ...data
            });
        }

        draftLoaded = true;
        render();
    },
    error => {
        console.error("Erreur Firebase — draft :", error);

        const status = document.getElementById("matchStatus");
        if (status) status.textContent = "ERREUR FIREBASE — DRAFT";
    }
);

window.addEventListener("DOMContentLoaded", render);
window.addEventListener("focus", render);
