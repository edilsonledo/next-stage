import { marcarNavAtivo, initHamburger, imgTag, abrirSteam } from "./utils.js";

window.abrirSteam = abrirSteam;

const JOGOS = [
  { nome: "Hades",                 appid: 1145360,  tag: "Roguelike",           motivo: "Combate frenético com ótima narrativa."        },
  { nome: "Cyberpunk 2077",        appid: 1091500,  tag: "RPG",                 motivo: "Mundo aberto imersivo com história profunda."  },
  { nome: "Hollow Knight",         appid: 367520,   tag: "Metroidvania",        motivo: "Desafiador, com arte única e mundo enorme."    },
  { nome: "Deep Rock Galactic",    appid: 548430,   tag: "Co-op / Shooter",     motivo: "Melhor jogo co-op dos últimos anos."           },
  { nome: "Stardew Valley",        appid: 413150,   tag: "Simulação",           motivo: "Relaxante, viciante e cheio de charme."        },
  { nome: "Red Dead Redemption 2", appid: 1174180,  tag: "Ação / Mundo aberto", motivo: "Narrativa cinematográfica incomparável."       },
  { nome: "Elden Ring",            appid: 1245620,  tag: "Souls-like",          motivo: "Open world desafiador e recompensador."        },
  { nome: "Terraria",              appid: 105600,   tag: "Sandbox",             motivo: "Infinitas horas de exploração e criação."      },
];

const GENEROS = ["Todos", "Roguelike", "RPG", "Metroidvania", "Co-op / Shooter", "Simulação", "Ação / Mundo aberto", "Souls-like", "Sandbox"];

let generoAtivo = "Todos";

function renderCards(lista) {
  const grid = document.getElementById("rec-grid");
  if (!lista.length) {
    grid.innerHTML = `<p class="error-msg">Nenhum jogo encontrado para este gênero.</p>`;
    return;
  }
  grid.innerHTML = lista.map(jogo => `
    <div class="card">
      <div class="card__img-wrapper">
        ${imgTag(`https://cdn.cloudflare.steamstatic.com/steam/apps/${jogo.appid}/header.jpg`, jogo.nome)}
      </div>
      <div class="card__body">
        <p class="card__title" title="${jogo.nome}">${jogo.nome}</p>
        <span class="card__badge">🎯 ${jogo.tag}</span>
        <p class="card__meta">${jogo.motivo}</p>
        <button class="btn" onclick="abrirSteam(${jogo.appid})">Jogar na Steam</button>
      </div>
    </div>
  `).join("");
}

function renderFiltros() {
  const container = document.getElementById("rec-filtros");
  container.innerHTML = GENEROS.map(g => `
    <button class="filter-tab ${g === generoAtivo ? "active" : ""}" data-gen="${g}">${g}</button>
  `).join("");

  container.querySelectorAll(".filter-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      generoAtivo = btn.dataset.gen;
      container.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filtrados = generoAtivo === "Todos"
        ? JOGOS
        : JOGOS.filter(j => j.tag === generoAtivo);
      renderCards(filtrados);
    });
  });
}

initHamburger();
marcarNavAtivo();
renderFiltros();
renderCards(JOGOS);
