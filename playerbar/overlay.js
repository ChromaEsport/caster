import { db, doc, onSnapshot } from "../firebase.js";

const params = new URLSearchParams(location.search);
const playerId = (params.get("id") || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 24);

const banner = document.getElementById("banner");
const playersEl = document.getElementById("players");
const roles = { TANK: "TANK", DPS: "DPS", SOUTIEN: "SOUTIEN" };

// Chaque navigateur OBS écoute un seul document : celui du joueur indiqué dans ?id=.
function hideBanner() {
  banner.classList.remove("visible");
  banner.setAttribute("aria-hidden", "true");
  playersEl.replaceChildren();
}

if (!playerId) {
  hideBanner();
  console.error("Chroma playerbar : identifiant manquant. Utilise overlay.html?id=jk, par exemple.");
} else {
  const playerRef = doc(db, "playerbar", playerId);

  onSnapshot(playerRef, snapshot => {
    if (!snapshot.exists()) {
      hideBanner();
      return;
    }

    const player = snapshot.data();
    const pseudo = String(player.pseudo || "").trim();

    if (!player.visible || !pseudo) {
      hideBanner();
      return;
    }

    playersEl.replaceChildren();

    const card = document.createElement("article");
    card.className = "player-card";

    const name = document.createElement("strong");
    name.className = "player-name";
    name.textContent = pseudo.toUpperCase();

    const role = document.createElement("span");
    role.className = "player-role";
    role.textContent = roles[player.role] || "JOUEUR";

    const mark = document.createElement("i");
    mark.className = "role-mark";

    card.append(mark, name, role);
    playersEl.append(card);

    banner.classList.add("visible");
    banner.setAttribute("aria-hidden", "false");
  }, error => {
    hideBanner();
    console.error("Chroma playerbar :", error);
  });
}
