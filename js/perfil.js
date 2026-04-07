import { onUsuarioMudou, loginGoogle, logout, getPerfil, removerJogo, salvarSteamId } from "./auth.js";
import { imgTag, abrirSteam, initHamburger, marcarNavAtivo } from "./utils.js";
import { initAuthHeader } from "./authHeader.js";

window.abrirSteam = abrirSteam;

const elLoading  = document.getElementById("perfil-loading");
const elNoLogin  = document.getElementById("perfil-nologin");
const elContent  = document.getElementById("perfil-content");

function mostrar(el) {
  [elLoading, elNoLogin, elContent].forEach(e => e.classList.add("hidden"));
  el.classList.remove("hidden");
}

// ── Renderiza lista de jogos ──
function renderLista(containerId, jogos, tipo) {
  const el = document.getElementById(containerId);
  if (!jogos || !jogos.length) {
    el.innerHTML = `
      <div class="perfil-empty">
        <p>${tipo === "salvos"
          ? "Nenhum jogo salvo ainda. Use o Catálogo para salvar jogos! 🔖"
          : "Nenhum jogo marcado como jogado ainda. ✅"
        }</p>
        <a href="catalogo.html" class="btn btn--outline" style="width:auto;margin-top:12px">
          Ir ao Catálogo →
        </a>
      </div>`;
    return;
  }

  el.innerHTML = jogos.map(j => `
    <div class="card">
      <div class="card__img-wrapper">
        ${imgTag(`https://cdn.cloudflare.steamstatic.com/steam/apps/${j.appid}/header.jpg`, j.nome)}
      </div>
      <div class="card__body">
        <p class="card__title">${j.nome}</p>
        <span class="card__badge">${j.genero || j.tag || ""}</span>
        <div style="display:flex;gap:6px;margin-top:auto">
          <button class="btn" onclick="abrirSteam(${j.appid})" style="flex:1">Steam</button>
          ${tipo === "salvos" ? `
            <button class="btn btn--outline" onclick="removerDaLista(${j.appid})" style="flex:1" title="Remover">🗑</button>
          ` : ""}
        </div>
      </div>
    </div>
  `).join("");
}

// ── Tabs ──
function initTabs() {
  document.querySelectorAll(".perfil-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".perfil-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
    });
  });
}

// ── Remover jogo salvo ──
let usuarioAtual = null;

window.removerDaLista = async (appid) => {
  if (!usuarioAtual) return;
  const perfil = await getPerfil(usuarioAtual.uid);
  const jogo   = perfil?.jogosSalvos?.find(j => j.appid === appid);
  if (!jogo) return;
  await removerJogo(usuarioAtual.uid, jogo);
  await carregarPerfil(usuarioAtual);
};

// ── Carrega e renderiza o perfil ──
async function carregarPerfil(user) {
  usuarioAtual = user;
  const perfil = await getPerfil(user.uid);

  // Preenche dados do card
  document.getElementById("perfil-foto").src    = user.photoURL  || "https://placehold.co/80/2a475e/66c0f4?text=👤";
  document.getElementById("perfil-nome").textContent  = user.displayName || "Jogador";
  document.getElementById("perfil-email").textContent = user.email || "";

  const desde = perfil?.criadoEm
    ? new Date(perfil.criadoEm).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : "";
  document.getElementById("perfil-desde").textContent = desde ? `Membro desde ${desde}` : "";

  const salvos  = perfil?.jogosSalvos  || [];
  const jogados = perfil?.jogosJogados || [];

  document.getElementById("stat-salvos").textContent  = salvos.length;
  document.getElementById("stat-jogados").textContent = jogados.length;

  renderLista("lista-salvos",  salvos,  "salvos");
  renderLista("lista-jogados", jogados, "jogados");

  // Se já tiver Steam ID salvo, preenche o campo automaticamente
  if (perfil?.steamId) {
    document.getElementById("steam-id-input").value = perfil.steamId;
  }

  mostrar(elContent);
}

// ── Botão login na página de perfil ──
document.getElementById("btn-login-perfil").addEventListener("click", loginGoogle);

// ── Observer ──
onUsuarioMudou(async user => {
  if (user) {
    await carregarPerfil(user);
  } else {
    mostrar(elNoLogin);
  }
});

initAuthHeader();
initHamburger();
marcarNavAtivo();
initTabs();
initSteam();

// ════════════════════════════════════════
// BIBLIOTECA STEAM
// ════════════════════════════════════════

const PER_PAGE     = 24;
let todosJogosSteam = [];
let jogosFiltrados  = [];
let paginaAtual     = 0;

function initSteam() {
  document.getElementById("btn-buscar-steam").addEventListener("click", buscarBibliotecaSteam);
  document.getElementById("steam-id-input").addEventListener("keydown", e => {
    if (e.key === "Enter") buscarBibliotecaSteam();
  });
  document.getElementById("btn-trocar-steam").addEventListener("click", () => {
    document.getElementById("steam-resultado").classList.add("hidden");
    document.getElementById("steam-connect").classList.remove("hidden");
    document.getElementById("steam-id-input").value = "";
    document.getElementById("steam-form-erro").classList.add("hidden");
  });
  document.getElementById("steam-search").addEventListener("input", e => {
    const q = e.target.value.toLowerCase().trim();
    jogosFiltrados = q
      ? todosJogosSteam.filter(j => j.name.toLowerCase().includes(q))
      : [...todosJogosSteam];
    paginaAtual = 0;
    renderSteamGrid(true);
  });
  document.getElementById("btn-mais-steam").addEventListener("click", () => {
    paginaAtual++;
    renderSteamGrid(false);
  });
}

// Extrai Steam ID de URL ou número bruto
function parseSteamInput(valor) {
  valor = valor.trim();
  // URL com /id/vanity
  const vanityMatch = valor.match(/steamcommunity\.com\/id\/([^/]+)/);
  if (vanityMatch) return { tipo: "vanity", valor: vanityMatch[1] };
  // URL com /profiles/steamid64
  const idMatch = valor.match(/steamcommunity\.com\/profiles\/(\d{17})/);
  if (idMatch) return { tipo: "id64", valor: idMatch[1] };
  // Número de 17 dígitos
  if (/^\d{17}$/.test(valor)) return { tipo: "id64", valor };
  // Texto curto — trata como vanity
  if (/^[a-zA-Z0-9_-]+$/.test(valor) && valor.length > 2) return { tipo: "vanity", valor };
  return null;
}

// Proxy CORS
function proxy(url) {
  return `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
}

async function buscarBibliotecaSteam() {
  const input = document.getElementById("steam-id-input");
  const erroEl = document.getElementById("steam-form-erro");
  const btn = document.getElementById("btn-buscar-steam");

  erroEl.classList.add("hidden");
  const parsed = parseSteamInput(input.value);
  if (!parsed) {
    erroEl.textContent = "⚠️ Informe uma URL do perfil Steam válida ou um Steam ID de 17 dígitos.";
    erroEl.classList.remove("hidden");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Buscando...";

  try {
    let steamId64 = parsed.valor;

    // Resolve vanity → Steam ID 64
    if (parsed.tipo === "vanity") {
      steamId64 = await resolverVanityUrl(parsed.valor);
      if (!steamId64) throw new Error("Perfil não encontrado. Verifique o nome ou use a URL completa.");
    }

    // Busca jogos
    const jogos = await buscarJogos(steamId64);
    if (!jogos || jogos.length === 0) {
      throw new Error("Biblioteca vazia ou perfil privado. Certifique-se que seu perfil Steam está público.");
    }

    // Salva Steam ID no Firestore
    if (usuarioAtual) {
      await salvarSteamId(usuarioAtual.uid, steamId64);
    }

    // Ordena por horas jogadas (decrescente)
    todosJogosSteam = jogos.sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0));
    jogosFiltrados  = [...todosJogosSteam];
    paginaAtual     = 0;

    document.getElementById("steam-resultado-nome").textContent = `Steam ID: ${steamId64}`;
    document.getElementById("steam-resultado-qtd").textContent  = `${jogos.length} jogos`;
    document.getElementById("steam-lib-info").textContent =
      `Mostrando ${Math.min(PER_PAGE, jogos.length)} de ${jogos.length} jogos, ordenados por horas jogadas`;

    renderSteamGrid(true);
    document.getElementById("steam-connect").classList.add("hidden");
    document.getElementById("steam-resultado").classList.remove("hidden");

  } catch (e) {
    erroEl.textContent = `⚠️ ${e.message}`;
    erroEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.textContent = "Importar biblioteca";
  }
}

async function resolverVanityUrl(vanity) {
  // A Steam API de vanity URL precisa de chave — vamos tentar direto pelo perfil público
  // Usa a URL de perfil público com ?xml=1
  const url = `https://steamcommunity.com/id/${vanity}/?xml=1`;
  const resp = await fetch(proxy(url));
  const data = await resp.json();
  const xml  = new DOMParser().parseFromString(data.contents, "text/xml");
  const idEl = xml.querySelector("steamID64");
  return idEl ? idEl.textContent.trim() : null;
}

async function buscarJogos(steamId64) {
  // API pública sem chave: GetOwnedGames com include_appinfo=1
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?steamid=${steamId64}&include_appinfo=1&include_played_free_games=1&format=json`;
  const resp = await fetch(proxy(url));
  const data = await resp.json();
  const json = JSON.parse(data.contents);
  return json?.response?.games || null;
}

function renderSteamGrid(reset) {
  const grid    = document.getElementById("steam-grid");
  const infoEl  = document.getElementById("steam-lib-info");
  const maisDiv = document.getElementById("steam-load-mais");

  const inicio = paginaAtual * PER_PAGE;
  const fatia  = jogosFiltrados.slice(inicio, inicio + PER_PAGE);
  const total  = jogosFiltrados.length;

  if (reset) grid.innerHTML = "";

  if (!fatia.length && reset) {
    grid.innerHTML = `<p class="perfil-empty">Nenhum jogo encontrado para essa busca.</p>`;
    maisDiv.classList.add("hidden");
    return;
  }

  fatia.forEach(jogo => {
    const horas = jogo.playtime_forever
      ? `${Math.round(jogo.playtime_forever / 60)}h`
      : "Nunca jogado";
    const imgSrc = jogo.img_logo_url
      ? `https://media.steampowered.com/steamcommunity/public/images/apps/${jogo.appid}/${jogo.img_logo_url}.jpg`
      : `https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/header.jpg`;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card__img-wrapper">
        <img
          class="card__img"
          src="https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/header.jpg"
          alt="${jogo.name}"
          loading="lazy"
          onerror="this.src='https://placehold.co/460x215/1b2838/66c0f4?text=${encodeURIComponent(jogo.name)}'"
        >
      </div>
      <div class="card__body">
        <p class="card__title">${jogo.name}</p>
        <span class="card__badge steam-horas">⏱ ${horas}</span>
        <button class="btn" onclick="abrirSteam(${jogo.appid})" style="margin-top:auto">
          Ver na Steam
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  const exibidos = Math.min(inicio + PER_PAGE, total);
  infoEl.textContent = `Exibindo ${exibidos} de ${total} jogos`;

  if (exibidos < total) {
    maisDiv.classList.remove("hidden");
  } else {
    maisDiv.classList.add("hidden");
  }
}
