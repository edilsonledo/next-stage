// Vercel Serverless Function — Next Stage
// Proxy seguro para a Steam Web API
// A STEAM_API_KEY fica em variável de ambiente na Vercel (nunca exposta ao browser)

module.exports = async function handler(req, res) {
  // CORS — permite acesso do GitHub Pages e localhost
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Servidor não configurado: STEAM_API_KEY ausente." });
  }

  const { action, steamid, vanity } = req.query;

  try {
    // ── Resolver vanity URL → Steam ID64 ──
    if (action === "resolve-vanity") {
      if (!vanity) return res.status(400).json({ error: "Parâmetro 'vanity' obrigatório." });

      const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${encodeURIComponent(vanity)}`;
      const resp = await fetch(url);
      const data = await resp.json();

      if (data?.response?.success !== 1) {
        return res.status(404).json({ error: "Perfil não encontrado. Verifique o nome ou use a URL completa." });
      }
      return res.status(200).json({ steamid: data.response.steamid });
    }

    // ── Buscar biblioteca de jogos ──
    if (action === "library") {
      if (!steamid) return res.status(400).json({ error: "Parâmetro 'steamid' obrigatório." });

      const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamid}&include_appinfo=1&include_played_free_games=1&format=json`;
      const resp = await fetch(url);
      const data = await resp.json();

      const games = data?.response?.games;

      if (data?.response?.game_count === 0 || (data?.response && !games)) {
        return res.status(403).json({
          error: "Biblioteca privada ou vazia. Vá em Steam → Configurações → Privacidade → Perfil do jogo = Público.",
        });
      }
      if (!games) {
        return res.status(502).json({ error: "Resposta inválida da Steam API. Tente novamente." });
      }

      const sorted = games.sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0));
      return res.status(200).json({ games: sorted, total: sorted.length });
    }

    // ── Rota de health check ──
    if (action === "ping") {
      return res.status(200).json({ ok: true, message: "Bonfire.gg API funcionando!" });
    }

    // ── Buscar preços via SteamSpy (lote de appids) ──
    if (action === "prices") {
      const { appids } = req.query;
      if (!appids) return res.status(400).json({ error: "Parâmetro 'appids' obrigatório (separados por vírgula)." });

      const ids = appids.split(",").slice(0, 100); // máx 100 por vez

      // SteamSpy: busca em paralelo (máx 5 simultâneos para não throttle)
      const results = {};
      const batchSize = 5;
      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);
        await Promise.all(batch.map(async (id) => {
          try {
            const r = await fetch(`https://steamspy.com/api.php?request=appdetails&appid=${id}`);
            const d = await r.json();
            // price em centavos USD
            if (d && d.price !== undefined) {
              results[id] = { price: d.price, initialprice: d.initialprice, name: d.name };
            }
          } catch { /* ignora erros individuais */ }
        }));
      }
      return res.status(200).json(results);
    }

    return res.status(400).json({ error: "Parâmetro 'action' inválido. Use: resolve-vanity | library | ping" });

  } catch (e) {
    console.error("[steam api error]", e);
    return res.status(500).json({ error: "Erro interno ao consultar a Steam API." });
  }
};
