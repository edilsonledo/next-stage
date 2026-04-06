import { skeletonCards, imgTag, abrirSteam, fetchSteamSpy, marcarNavAtivo, initHamburger } from "./utils.js";

window.abrirSteam = abrirSteam;

const CATEGORIAS = {
  top100in2weeks: "🔥 Mais jogados (2 semanas)",
  top100forever:  "🏆 Mais jogados de todos os tempos",
  top100owned:    "📦 Mais possuídos",
};

let categoriaAtual = "top100in2weeks";

async function carregarLoja(request) {
  const grid = document.getElementById("loja-grid");
  const titulo = document.getElementById("loja-titulo");

  grid.innerHTML   = skeletonCards(12);
  titulo.textContent = CATEGORIAS[request];

  try {
    const data  = await fetchSteamSpy(request);
    const jogos = Object.values(data).slice(0, 12);

    grid.innerHTML = jogos.map(jogo => {
      const preco = jogo.price > 0
        ? `R$ ${(jogo.price / 100).toFixed(2).replace(".", ",")}`
        : "Gratuito";

      return `
        <div class="card">
          <div class="card__img-wrapper">
            ${imgTag(`https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/header.jpg`, jogo.name)}
          </div>
          <div class="card__body">
            <p class="card__title" title="${jogo.name}">${jogo.name}</p>
            <span class="card__meta">👥 ${Number(jogo.owners?.split(" .. ")[0] || 0).toLocaleString()} donos</span>
            <p class="card__price">${preco}</p>
            <button class="btn" onclick="abrirSteam(${jogo.appid})">Ver na Steam</button>
          </div>
        </div>
      `;
    }).join("");

  } catch (e) {
    grid.innerHTML = `<div class="error-msg">⚠️ Erro ao carregar jogos. Tente mais tarde.</div>`;
    console.error(e);
  }
}

// ── Filtros ──
document.querySelectorAll(".filter-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    categoriaAtual = tab.dataset.cat;
    carregarLoja(categoriaAtual);
  });
});

// ── Search ──
const searchInput = document.getElementById("search-input");
const searchBtn   = document.getElementById("search-btn");

function filtrarPorNome() {
  const termo = searchInput.value.toLowerCase().trim();
  document.querySelectorAll("#loja-grid .card").forEach(card => {
    const titulo = card.querySelector(".card__title").textContent.toLowerCase();
    card.style.display = titulo.includes(termo) ? "" : "none";
  });
}

searchBtn.addEventListener("click", filtrarPorNome);
searchInput.addEventListener("keyup", e => {
  if (e.key === "Enter") filtrarPorNome();
});

// ── Init ──
initHamburger();
marcarNavAtivo();
carregarLoja(categoriaAtual);
