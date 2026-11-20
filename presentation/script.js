(() => {
  const players = window.CHROMA_PLAYERS || {};
  const params = new URLSearchParams(window.location.search);
  const requested = (params.get("player") || "jk").toLowerCase();
  const player = players[requested] || players.jk || Object.values(players)[0];
  if (!player) return;

  const fields = {
    playerName: player.name,
    playerTag: player.tag,
    playerRole: player.role,
    playerTeam: player.team,
    playerStatus: player.status,
    playerResponsibility: player.responsibility,
    heroName: player.hero,
    heroNumber: player.heroNumber
  };
  Object.entries(fields).forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node && value) node.textContent = value;
  });

  const heroPortrait = document.getElementById("heroPortrait");
  if (heroPortrait && player.heroImage) {
    heroPortrait.src = /^https?:\/\//i.test(player.heroImage) ? player.heroImage : `../heroes/${encodeURIComponent(player.heroImage)}`;
    heroPortrait.alt = player.hero || "Héros Overwatch";
  }

  const stage = document.getElementById("stage");
  // Rejoue l'animation à chaque rechargement de la source navigateur OBS.
  requestAnimationFrame(() => stage.classList.add("playing"));

  // ?preview=1 permet de tester sans animation.
  if (params.get("preview") === "1") stage.classList.remove("playing");
})();