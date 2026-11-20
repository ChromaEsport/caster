import { db, doc, onSnapshot } from "../firebase.js";

const params = new URLSearchParams(location.search);
const playerId = (params.get("id") || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 24);

const banner = document.getElementById("banner");
const playersEl = document.getElementById("players");

const roles = {
  TANK: { label: "TANK", icon: "../roles/tank.png", alt: "Icône Tank" },
  DPS: { label: "DÉGÂTS", icon: "../roles/damage.png", alt: "Icône Dégâts" },
  SOUTIEN: { label: "SOUTIEN", icon: "../roles/support.png", alt: "Icône Soutien" }
};

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
    const roleData = roles[player.role] || roles.DPS;

    if (!player.visible || !pseudo) {
      hideBanner();
      return;
    }

    const card = document.createElement("article");
    card.className = "player-card";

    const roleGroup = document.createElement("div");
    roleGroup.className = "player-role-group";

    const roleIcon = document.createElement("img");
    roleIcon.className = "role-icon";
    roleIcon.src = roleData.icon;
    roleIcon.alt = roleData.alt;

    const roleLabel = document.createElement("span");
    roleLabel.className = "player-role";
    roleLabel.textContent = roleData.label;

    const name = document.createElement("strong");
    name.className = "player-name";
    name.textContent = pseudo.toUpperCase();

    roleGroup.append(roleIcon, roleLabel);
    card.append(roleGroup, name);

    playersEl.replaceChildren(card);
    banner.classList.add("visible");
    banner.setAttribute("aria-hidden", "false");
  }, error => {
    hideBanner();
    console.error("Chroma playerbar :", error);
  });
}
