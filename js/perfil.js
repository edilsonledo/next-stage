import { onUsuarioMudou, loginGoogle, logout, getPerfil, removerJogo } from "./auth.js";
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
