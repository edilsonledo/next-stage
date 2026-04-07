// Vercel Serverless Function — Next Stage
// Faz o proxy seguro para a Steam Web API
// A STEAM_API_KEY fica em variável de ambiente na Vercel (nunca exposta ao browser)

export default async function handler(req, res) {
  // Permite CORS do GitHub Pages e localhost
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
        return res.status(404).json({ error: "Perfil não encontrado." });
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
          error: "Biblioteca privada ou vazia. Configure seu perfil Steam como público.",
        });
      }
      if (!games) {
        return res.status(502).json({ error: "Resposta inválida da Steam API." });
      }

      // Ordena por horas jogadas e retorna
      const sorted = games.sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0));
      return res.status(200).json({ games: sorted, total: sorted.length });
    }

    return res.status(400).json({ error: "Parâmetro 'action' inválido. Use: resolve-vanity | library" });

  } catch (e) {
    console.error("[steam api error]", e);
    return res.status(500).json({ error: "Erro interno ao consultar a Steam API." });
  }
}
