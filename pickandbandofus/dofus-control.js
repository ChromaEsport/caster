import {
    db,
    doc,
    setDoc,
    onSnapshot
} from "./firebase.js";

/*
 * Documents séparés de ceux d'Overwatch :
 * dofusMatches/current
 * dofusDraft/current
 */

const matchRef = doc(db, "dofusMatches", "current");
const draftRef = doc(db, "dofusDraft", "current");

const CLASSES = [
    "Féca",
    "Osamodas",
    "Enutrof",
    "Sram",
    "Xélor",
    "Écaflip",
    "Éniripsa",
    "Iop",
    "Crâ",
    "Sadida",
    "Sacrieur",
    "Pandawa",
    "Roublard",
    "Zobal",
    "Steamer",
    "Eliotrope",
    "Huppermage",
    "Ouginak",
    "Forgelance"
];

let matchState = {
    caster1: "",
    caster2: "",
    eventName: "",
    teamA: "",
    teamB: "",
    scoreA: 0,
    scoreB: 0
};

let draftState = {
    mapNumber: 1,
    mapLocked: false,
    actions: []
};

let applyingRemoteMatch = false;
let applyingRemoteDraft = false;

const $ = id => document.getElementById(id);

function setStatus(message) {
    $("syncMessage").textContent = message;
}

function normalizeClass(value) {
    return String(value || "").trim();
}

function usedClasses(exceptActionIndex = -1) {
    return new Set(
        draftState.actions
            .filter((action, index) => index !== exceptActionIndex)
            .map(action => normalizeClass(action.className))
            .filter(Boolean)
    );
}

function fillMapOptions() {
    $("mapSelect").replaceChildren();

    for (let number = 1; number <= 54; number++) {
        const option = document.createElement("option");
        option.value = String(number);
        option.textContent = `Map ${String(number).padStart(2, "0")}`;
        $("mapSelect").appendChild(option);
    }

    $("mapSelect").value = String(draftState.mapNumber);
    updateMapDisplay();
}

function fillClassSelect(select) {
    select.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choisir une classe…";
    select.appendChild(placeholder);

    [...CLASSES]
        .sort((a, b) => a.localeCompare(b, "fr"))
        .forEach(className => {
            const option = document.createElement("option");
            option.value = className;
            option.textContent = className;
            select.appendChild(option);
        });
}

function refreshClassOptions() {
    const selects = [
        $("banA"),
        $("pickA"),
        $("banB"),
        $("pickB")
    ];

    const used = usedClasses();

    selects.forEach(select => {
        const previousValue = select.value;

        [...select.options].forEach(option => {
            if (!option.value) return;
            option.disabled = used.has(option.value);
        });

        if (used.has(previousValue)) {
            select.value = "";
        }
    });
}

function updateMapDisplay() {
    $("mapSelect").value = String(draftState.mapNumber);

    $("selectedMapLabel").textContent =
        `MAP ${String(draftState.mapNumber).padStart(2, "0")}`;

    $("mapStatus").textContent = draftState.mapLocked
        ? "Map verrouillée"
        : "Map non verrouillée";

    $("lockMap").textContent = draftState.mapLocked
        ? "DÉVERROUILLER"
        : "VERROUILLER";

    $("mapSelect").disabled = draftState.mapLocked;
    $("randomMap").disabled = draftState.mapLocked;
}

function updateMatchUI() {
    applyingRemoteMatch = true;

    $("caster1").value = matchState.caster1 || "";
    $("caster2").value = matchState.caster2 || "";
    $("eventName").value = matchState.eventName || "";
    $("teamA").value = matchState.teamA || "";
    $("teamB").value = matchState.teamB || "";

    $("scoreA").textContent = Number(matchState.scoreA || 0);
    $("scoreB").textContent = Number(matchState.scoreB || 0);

    applyingRemoteMatch = false;
}

function renderHistory() {
    const history = $("draftHistory");
    history.replaceChildren();

    $("actionCount").textContent =
        `${draftState.actions.length} ACTION${draftState.actions.length > 1 ? "S" : ""}`;

    if (draftState.actions.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-history";
        empty.textContent = "Aucune action pour le moment.";
        history.appendChild(empty);
        return;
    }

    draftState.actions.forEach((action, index) => {
        const entry = document.createElement("div");
        entry.className = "history-entry";

        const number = document.createElement("span");
        number.className = "history-index";
        number.textContent = String(index + 1).padStart(2, "0");

        const details = document.createElement("div");

        const className = document.createElement("strong");
        className.textContent = action.className;

        const description = document.createElement("small");
        description.textContent =
            `${action.team === "A" ? "Équipe A" : "Équipe B"} · ${action.type === "ban" ? "Bannissement" : "Pick"}`;

        details.append(className, description);

        const type = document.createElement("span");
        type.className = `action-type ${action.type}`;
        type.textContent = action.type === "ban" ? "BAN" : "PICK";

        entry.append(number, details, type);
        history.appendChild(entry);
    });
}

async function saveMatch() {
    matchState = {
        ...matchState,
        caster1: $("caster1").value.trim(),
        caster2: $("caster2").value.trim(),
        eventName: $("eventName").value.trim(),
        teamA: $("teamA").value.trim(),
        teamB: $("teamB").value.trim()
    };

    try {
        await setDoc(matchRef, matchState, { merge: true });
        setStatus("Match enregistré dans Firebase.");
    } catch (error) {
        console.error(error);
        setStatus("Erreur lors de l'enregistrement du match.");
        alert("Impossible d'enregistrer le match. Vérifie la connexion Firebase.");
    }
}

async function changeScore(team, difference) {
    const key = team === "A" ? "scoreA" : "scoreB";

    matchState[key] = Math.max(
        0,
        Number(matchState[key] || 0) + difference
    );

    $(key).textContent = matchState[key];

    try {
        await setDoc(matchRef, {
            [key]: matchState[key]
        }, { merge: true });

        setStatus("Score synchronisé.");
    } catch (error) {
        console.error(error);
        setStatus("Erreur de synchronisation du score.");
    }
}

async function saveDraft() {
    try {
        await setDoc(draftRef, {
            mapNumber: draftState.mapNumber,
            mapLocked: draftState.mapLocked,
            actions: draftState.actions,
            updatedAt: new Date().toISOString()
        });

        setStatus("Pick & Ban synchronisé.");
    } catch (error) {
        console.error(error);
        setStatus("Erreur de synchronisation du Pick & Ban.");
        alert("Impossible d'enregistrer le Pick & Ban dans Firebase.");
    }
}

async function submitAction(team, type) {
    if (type === "ban" && draftState.actions.some(action => action.type === "ban" && action.team === team)) {
        alert(`L'équipe ${team} a déjà effectué un ban.`);
        return;
    }

    if (type === "pick" && draftState.actions.some(action => action.type === "pick" && action.team === team)) {
        alert(`L'équipe ${team} a déjà effectué un pick.`);
        return;
    }

    const selectId = `${type}${team}`;
    const className = normalizeClass($(selectId).value);

    if (!className) {
        alert("Sélectionne une classe avant de valider.");
        return;
    }

    if (usedClasses().has(className)) {
        alert("Cette classe a déjà été pick ou ban.");
        refreshClassOptions();
        return;
    }

    draftState.actions.push({
        team,
        type,
        className,
        timestamp: new Date().toISOString()
    });

    renderHistory();
    refreshClassOptions();

    await saveDraft();
}

async function changeMap(number) {
    if (draftState.mapLocked) {
        alert("Déverrouille la map avant de la modifier.");
        return;
    }

    const parsed = Number(number);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 54) return;

    draftState.mapNumber = parsed;
    updateMapDisplay();
    await saveDraft();
}

async function toggleMapLock() {
    draftState.mapLocked = !draftState.mapLocked;
    updateMapDisplay();
    await saveDraft();
}

async function randomMap() {
    if (draftState.mapLocked) return;

    let number = draftState.mapNumber;

    if (number >= 1 && number <= 54) {
        const candidates = Array.from(
            { length: 54 },
            (_, index) => index + 1
        ).filter(value => value !== number);

        number = candidates[Math.floor(Math.random() * candidates.length)];
    }

    draftState.mapNumber = number;
    updateMapDisplay();
    await saveDraft();
}

async function undoAction() {
    if (!draftState.actions.length) {
        alert("Il n'y a aucune action à annuler.");
        return;
    }

    draftState.actions.pop();
    renderHistory();
    refreshClassOptions();
    await saveDraft();
}

async function resetDraft() {
    const confirmed = confirm(
        "Réinitialiser la map, les picks et les bans ? Cette action ne peut pas être annulée."
    );

    if (!confirmed) return;

    draftState = {
        mapNumber: 1,
        mapLocked: false,
        actions: []
    };

    fillMapOptions();
    renderHistory();
    refreshClassOptions();
    await saveDraft();
}

function bindEvents() {
    $("saveMatch").addEventListener("click", saveMatch);

    $("plusA").addEventListener("click", () => changeScore("A", 1));
    $("minusA").addEventListener("click", () => changeScore("A", -1));
    $("plusB").addEventListener("click", () => changeScore("B", 1));
    $("minusB").addEventListener("click", () => changeScore("B", -1));

    $("mapSelect").addEventListener("change", event => {
        changeMap(event.target.value);
    });

    $("randomMap").addEventListener("click", randomMap);
    $("lockMap").addEventListener("click", toggleMapLock);

    $("submitBanA").addEventListener("click", () => submitAction("A", "ban"));
    $("submitPickA").addEventListener("click", () => submitAction("A", "pick"));
    $("submitBanB").addEventListener("click", () => submitAction("B", "ban"));
    $("submitPickB").addEventListener("click", () => submitAction("B", "pick"));

    $("undoAction").addEventListener("click", undoAction);
    $("resetDraft").addEventListener("click", resetDraft);
}

function listenToFirebase() {
    onSnapshot(matchRef, snapshot => {
        if (!snapshot.exists()) return;

        matchState = {
            ...matchState,
            ...snapshot.data()
        };

        updateMatchUI();
        setStatus("Connecté · Match synchronisé.");
    }, error => {
        console.error(error);
        setStatus("Erreur de connexion au match.");
    });

    onSnapshot(draftRef, snapshot => {
        if (!snapshot.exists()) return;

        applyingRemoteDraft = true;

        const data = snapshot.data();

        draftState = {
            mapNumber: Number(data.mapNumber || 1),
            mapLocked: Boolean(data.mapLocked),
            actions: Array.isArray(data.actions) ? data.actions : []
        };

        fillMapOptions();
        updateMapDisplay();
        renderHistory();
        refreshClassOptions();

        applyingRemoteDraft = false;
    }, error => {
        console.error(error);
        setStatus("Erreur de connexion au Pick & Ban.");
    });
}

function initialize() {
    ["banA", "pickA", "banB", "pickB"].forEach(id => {
        fillClassSelect($(id));
    });

    fillMapOptions();
    renderHistory();
    refreshClassOptions();
    bindEvents();
    listenToFirebase();
}

initialize();
