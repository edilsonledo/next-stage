import { onUsuarioMudou, loginGoogle, logout, getPerfil, removerJogo, salvarSteamId } from "./auth.js";
import { imgTag, abrirSteam, initHamburger, marcarNavAtivo } from "./utils.js";
import { initAuthHeader } from "./authHeader.js";

window.abrirSteam = abrirSteam;

// URL base do backend Vercel (mesmo repo, deploy separado)
const API_BASE = "https://next-stage-api.vercel.app/api/steam";

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

  // Se já tiver Steam ID salvo, preenche os campos automaticamente
  if (perfil?.steamId) {
    document.getElementById("steam-id-input").value = perfil.steamId;
  }
  if (perfil?.steamApiKey) {
    const keyEl = document.getElementById("steam-api-key-input");
    if (keyEl) keyEl.value = perfil.steamApiKey;
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
// BIBLIOTECA STEAM — via backend Vercel
// ════════════════════════════════════════

const PER_PAGE      = 24;
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

// ── Extrai Steam ID64 ou vanity de qualquer input ──
function parseSteamInput(valor) {
  valor = valor.trim();
  const vanityMatch = valor.match(/steamcommunity\.com\/id\/([^/?#]+)/);
  if (vanityMatch) return { tipo: "vanity", valor: vanityMatch[1] };
  const idMatch = valor.match(/steamcommunity\.com\/profiles\/(\d{15,})/);
  if (idMatch) return { tipo: "id64", valor: idMatch[1] };
  if (/^\d{15,}$/.test(valor)) return { tipo: "id64", valor };
  if (/^[a-zA-Z0-9_-]{3,}$/.test(valor)) return { tipo: "vanity", valor };
  return null;
}

// ── Chama o backend Vercel ──
async function chamarApi(params) {
  const query = new URLSearchParams(params).toString();
  const resp  = await fetch(`${API_BASE}?${query}`);
  const data  = await resp.json();
  if (!resp.ok) throw new Error(data.error || `Erro ${resp.status}`);
  return data;
}

async function buscarBibliotecaSteam() {
  const input  = document.getElementById("steam-id-input");
  const btn    = document.getElementById("btn-buscar-steam");

  document.getElementById("steam-form-erro").classList.add("hidden");

  const parsed = parseSteamInput(input.value);
  if (!parsed) {
    mostrarErroSteam("⚠️ Informe a URL do perfil Steam ou seu Steam ID numérico.");
    return;
  }

  btn.disabled    = true;
  btn.textContent = "Buscando...";

  try {
    let steamId64 = parsed.valor;

    // Resolve nome de perfil → ID64 via backend
    if (parsed.tipo === "vanity") {
      btn.textContent = "Resolvendo perfil...";
      const res = await chamarApi({ action: "resolve-vanity", vanity: parsed.valor });
      steamId64 = res.steamid;
    }

    // Busca biblioteca via backend
    btn.textContent = "Carregando biblioteca...";
    const res = await chamarApi({ action: "library", steamid: steamId64 });

    // Salva o Steam ID no Firestore (apenas ID, sem chave)
    if (usuarioAtual) {
      await salvarSteamId(usuarioAtual.uid, steamId64);
    }

    todosJogosSteam = res.games;
    jogosFiltrados  = [...todosJogosSteam];
    paginaAtual     = 0;

    document.getElementById("steam-resultado-nome").textContent = `Steam ID: ${steamId64}`;
    document.getElementById("steam-resultado-qtd").textContent  = `${res.total} jogos`;
    document.getElementById("steam-lib-info").textContent =
      `Exibindo ${Math.min(PER_PAGE, res.total)} de ${res.total} jogos · ordenados por horas jogadas`;

    renderSteamGrid(true);
    document.getElementById("steam-connect").classList.add("hidden");
    document.getElementById("steam-resultado").classList.remove("hidden");

  } catch (e) {
    mostrarErroSteam(`⚠️ ${e.message}`);
  } finally {
    btn.disabled    = false;
    btn.textContent = "Importar biblioteca";
  }
}

function mostrarErroSteam(msg) {
  const el = document.getElementById("steam-form-erro");
  el.textContent = msg;
  el.classList.remove("hidden");
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
      ? `${Math.round(jogo.playtime_forever / 60)}h jogadas`
      : "Nunca iniciado";

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card__img-wrapper">
        <img
          class="card__img"
          src="https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/header.jpg"
          alt="${jogo.name}"
          loading="lazy"
          onerror="this.src='https://placehold.co/460x215/1b2838/66c0f4?text=${encodeURIComponent(jogo.name.slice(0, 20))}'"
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
  infoEl.textContent = `Exibindo ${exibidos} de ${total} jogos · ordenados por horas jogadas`;
  maisDiv.classList.toggle("hidden", exibidos >= total);
}
