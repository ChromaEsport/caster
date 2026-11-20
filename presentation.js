const players = {
  jk: {
    number: "PLAYER 01",
    name: "JK",
    role: "TANK MAIN",
    team: "CHROMA OVERWATCH",
    status: "CAPITAINE",
    responsibility: "MANAGER DES ÉQUIPES OVERWATCH",
    footer: "JK // TANK"
  }
};

const params = new URLSearchParams(window.location.search);
const playerId = (params.get("player") || "jk").toLowerCase();
const player = players[playerId];

const intro = document.getElementById("intro");

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function playIntro() {
  if (!player) {
    console.error("Joueur inconnu :", playerId);
    return;
  }

  setText("player-number", player.number);
  setText("player-name", player.name);
  setText("player-role", player.role);
  setText("player-team", player.team);
  setText("player-status", player.status);
  setText("player-responsibility", player.responsibility);
  setText("player-footer", player.footer);

  intro.classList.remove("closing", "playing");

  // Redémarre les animations CSS
  void intro.offsetWidth;

  intro.classList.add("playing");

  // Disparition automatique après 10 secondes
  window.clearTimeout(window.introTimer);

  window.introTimer = window.setTimeout(() => {
    intro.classList.remove("playing");
    intro.classList.add("closing");
  }, 10000);
}

// Lancement automatique pour OBS et Stream Deck
if (params.get("autoplay") !== "0") {
  playIntro();
}

// Espace ou Entrée : rejouer la présentation
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "Enter") {
    playIntro();
  }
});
