(() => {
  const players = window.CHROMA_PLAYERS || {};
  const params = new URLSearchParams(window.location.search);
  const requested = (params.get("player") || "jk").trim().toLowerCase();
  const player = players[requested] || null;

  // Un joueur non encore configuré affiche au minimum le pseudo demandé,
  // sans reprendre par erreur les informations de JK.
  const roleParam = (params.get("role") || "").trim().toLowerCase();
  const allowedRoles = { tank: "TANK", dps: "DPS", support: "SUPPORT" };
  const roleFromUrl = allowedRoles[roleParam] || "";

  const heroParam = (params.get("heroes") || "").trim();
  const heroFromUrl = heroParam
    ? heroParam.split(/[-_ ]+/).map(part => part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : "").join("")
    : "";

  const numberFromUrl = (params.get("number") || "").trim();
  const designationFromUrl = (params.get("status") || "").trim();

  const fields = {
    playerName: player?.name || requested.toUpperCase(),
    playerTag: "CHROMA OVERWATCH",
    playerRole: roleFromUrl || player?.role || "",
    playerDesignation: designationFromUrl || player?.status || "",
    playerTeam: "CHROMA OVERWATCH",
    heroName: heroFromUrl ? heroFromUrl.toUpperCase() : (player?.hero || ""),
    heroNumber: numberFromUrl || player?.heroNumber || ""
  };

  Object.entries(fields).forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  });

  const roleIcon = document.getElementById("roleIcon");
  if (roleIcon) {
    const roleKey = roleParam || (player?.role || "").toLowerCase().split(/\\s+/)[0];
    const roleFiles = { tank: "tank", dps: "damage", support: "support" };
    if (roleFiles[roleKey]) {
      roleIcon.src = `../roles/${roleFiles[roleKey]}.png`;
      roleIcon.alt = `Rôle ${roleKey}`;
    }
  }

  const heroPortrait = document.getElementById("heroPortrait");
  if (heroPortrait) {
    if (heroFromUrl) {
      // Exemple : ?heroes=reinhardt -> perso/reinhardt.jpg
      const heroFile = heroParam.toLowerCase().replace(/[^a-z0-9_-]/g, "");
      heroPortrait.src = `perso/${encodeURIComponent(heroFile)}.png`;
      heroPortrait.alt = heroFromUrl;
    } else if (player?.heroImage) {
      heroPortrait.src = (player.heroImage.startsWith("http://") || player.heroImage.startsWith("https://"))
        ? player.heroImage
        : `../heroes/${encodeURIComponent(player.heroImage)}`;
      heroPortrait.alt = player.hero || "Héros Overwatch";
    }
  }

  const stage = document.getElementById("stage");
  requestAnimationFrame(() => stage.classList.add("playing"));

  const previewMode = params.get("preview") === "1";
  if (previewMode) {
    stage.classList.remove("playing");
  } else {
    // Durée d'affichage en secondes : 8 par défaut, réglable avec ?duration=10
    const requestedDuration = Number(params.get("duration") || 8);
    const durationSeconds = Number.isFinite(requestedDuration)
      ? Math.min(60, Math.max(1, requestedDuration))
      : 8;
    window.setTimeout(() => stage.classList.add("disappearing"), durationSeconds * 1000);
  }
})();
