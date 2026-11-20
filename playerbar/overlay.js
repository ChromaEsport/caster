import { db, doc, onSnapshot } from "../firebase.js";

const params = new URLSearchParams(location.search);
const playerId = (params.get("id") || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 24);

const banner = document.getElementById("banner");
const nameEl = document.getElementById("playerName");
const roleIcon = document.getElementById("roleIcon");
const roleLabel = document.getElementById("roleLabel");

const roles = {
  TANK: { label: "TANK", icon: "../roles/tank.png", alt: "Icône Tank" },
  DPS: { label: "DÉGÂTS", icon: "../roles/damage.png", alt: "Icône Dégâts" },
  SOUTIEN: { label: "SOUTIEN", icon: "../roles/support.png", alt: "Icône Soutien" }
};

function hideBanner() {
  banner.classList.remove("visible");
  banner.setAttribute("aria-hidden", "true");
  nameEl.textContent = "";
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
    const role = roles[player.role] || roles.DPS;
    if (!player.visible || !pseudo) {
      hideBanner();
      return;
    }
    nameEl.textContent = pseudo.toUpperCase();
    roleIcon.src = role.icon;
    roleIcon.alt = role.alt;
    roleLabel.textContent = role.label;
    banner.classList.add("visible");
    banner.setAttribute("aria-hidden", "false");
  }, error => {
    hideBanner();
    console.error("Chroma playerbar :", error);
  });
}
