(() => {
  const players = window.CHROMA_PLAYERS || {};
  const params = new URLSearchParams(window.location.search);
  const requested = (params.get("player") || "jk").trim().toLowerCase();
  const player = players[requested] || null;

  // Un joueur non encore configuré affiche au minimum le pseudo demandé,
  // sans reprendre par erreur les informations de JK.
  const heroParam = (params.get("heroes") || "").trim();
  const heroFromUrl = heroParam
    ? heroParam.split(/[-_ ]+/).map(part => part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : "").join("")
    : "";

  const fields = {
    playerName: player?.name || requested.toUpperCase(),
    playerTag: player?.tag || "",
    playerRole: player?.role || "",
    playerTeam: player?.team || "",
    playerStatus: player?.status || "",
    playerResponsibility: player?.responsibility || "",
    heroName: heroFromUrl ? heroFromUrl.toUpperCase() : (player?.hero || ""),
    heroNumber: player?.heroNumber || ""
  };

  Object.entries(fields).forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  });

  const heroPortrait = document.getElementById("heroPortrait");
  if (heroPortrait) {
    if (heroFromUrl) {
      // Exemple : ?player=cheo&heroes=reinhardt -> ../heroes/Reinhardt.png
      heroPortrait.src = `../heroes/${encodeURIComponent(heroFromUrl)}.png`;
      heroPortrait.alt = heroFromUrl;
    } else if (player?.heroImage) {
      heroPortrait.src = /^https?:\\/\\//i.test(player.heroImage)
        ? player.heroImage
        : `../heroes/${encodeURIComponent(player.heroImage)}`;
      heroPortrait.alt = player.hero || "Héros Overwatch";
    }
  }

  const stage = document.getElementById("stage");
  requestAnimationFrame(() => stage.classList.add("playing"));

  if (params.get("preview") === "1") stage.classList.remove("playing");
})();