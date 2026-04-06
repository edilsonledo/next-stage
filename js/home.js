import { skeletonCards, imgTag, abrirSteam, fetchSteamSpy, marcarNavAtivo, initHamburger } from "./utils.js";

// Torna abrirSteam global para os onclick inline dos cards
window.abrirSteam = abrirSteam;

// ── Recomendados fixos ──
const recomendados = [
  { nome: "Hades",                 appid: 1145360,  tag: "Roguelike"          },
  { nome: "Cyberpunk 2077",        appid: 1091500,  tag: "RPG / Mundo aberto" },
  { nome: "Hollow Knight",         appid: 367520,   tag: "Metroidvania"       },
  { nome: "Deep Rock Galactic",    appid: 548430,   tag: "Co-op / Shooter"    },
  { nome: "Stardew Valley",        appid: 413150,   tag: "Simulação"          },
  { nome: "Red Dead Redemption 2", appid: 1174180,  tag: "Ação / Mundo aberto"},
];

// ── Trending ──
async function carregarTrending() {
  const el = document.getElementById("trending");
  if (!el) return;

  el.innerHTML = skeletonCards(8);

  try {
    const data  = await fetchSteamSpy("top100in2weeks");
    const jogos = Object.values(data).slice(0, 8);

    el.innerHTML = jogos.map(jogo => `
      <div class="card">
        <div class="card__img-wrapper">
          ${imgTag(`https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/header.jpg`, jogo.name)}
        </div>
        <div class="card__body">
          <p class="card__title" title="${jogo.name}">${jogo.name}</p>
          <span class="card__badge">🔥 Popular agora</span>
          <p class="card__price">Ver na Steam →</p>
          <button class="btn" onclick="abrirSteam(${jogo.appid})">Abrir na Steam</button>
        </div>
      </div>
    `).join("");

  } catch (e) {
    el.innerHTML = `<div class="error-msg">⚠️ Não foi possível carregar. Tente mais tarde.</div>`;
    console.error(e);
  }
}

// ── Recomendados ──
function renderRecomendados() {
  const el = document.getElementById("recommended");
  if (!el) return;

  el.innerHTML = recomendados.map(jogo => `
    <div class="card">
      <div class="card__img-wrapper">
        ${imgTag(`https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/header.jpg`, jogo.nome)}
      </div>
      <div class="card__body">
        <p class="card__title" title="${jogo.nome}">${jogo.nome}</p>
        <span class="card__badge">🎯 ${jogo.tag}</span>
        <button class="btn" onclick="abrirSteam(${jogo.appid})">Jogar na Steam</button>
      </div>
    </div>
  `).join("");
}

// ── Init ──
initHamburger();
marcarNavAtivo();
carregarTrending();
renderRecomendados();
