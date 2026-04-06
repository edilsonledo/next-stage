import { imgTag, abrirSteam, initHamburger, marcarNavAtivo } from "./utils.js";
import { initAuthHeader } from "./authHeader.js";
window.abrirSteam = abrirSteam;

// ── Banco de dados de ressacas famosas ──
const RESSACAS = [
  {
    nome: "Hades",            appid: 1145360,
    motivo: "Acabou rapido? Nao acabou. Tente escapar mais 50 vezes.",
    proximos: [4000, 1145360, 367520, 814380]
  },
  {
    nome: "The Witcher 3",    appid: 292030,
    motivo: "A ressaca mais comum do mundo dos games.",
    proximos: [1091500, 1172380, 1174180, 374320]
  },
  {
    nome: "Hollow Knight",    appid: 367520,
    motivo: "Vazio existencial garantido ao ver os creditos.",
    proximos: [814380, 1145360, 1158310, 230190]
  },
  {
    nome: "Cyberpunk 2077",   appid: 1091500,
    motivo: "Voce vai querer mais mundo aberto e historia.",
    proximos: [292030, 1174180, 976730, 534380]
  },
  {
    nome: "Stardew Valley",   appid: 413150,
    motivo: "Impossivel parar. Mas quando parar, esta aqui.",
    proximos: [413150, 1062090, 252490, 526870]
  },
  {
    nome: "Elden Ring",       appid: 1245620,
    motivo: "Agora voce quer mais sofrimento. Nos entendemos.",
    proximos: [1245620, 814380, 570940, 374320]
  },
];

// ── Banco de humores com recomendacoes ──
const MOODS = {
  vazio: {
    titulo: "Voce precisa de uma historia que te absorva",
    jogos: [
      { nome: "The Witcher 3",      appid: 292030,   tag: "RPG narrativo"      },
      { nome: "Disco Elysium",      appid: 632470,   tag: "RPG / Investigacao" },
      { nome: "Cyberpunk 2077",     appid: 1091500,  tag: "RPG / Sci-fi"       },
      { nome: "Planescape Torment", appid: 466300,   tag: "RPG classico"       },
    ]
  },
  adrenalina: {
    titulo: "Voce quer acao sem parar",
    jogos: [
      { nome: "Doom Eternal",       appid: 782330,  tag: "FPS frenético"      },
      { nome: "Hades",              appid: 1145360, tag: "Roguelike / Acao"   },
      { nome: "Devil May Cry 5",    appid: 601150,  tag: "Hack and slash"     },
      { nome: "Deep Rock Galactic", appid: 548430,  tag: "Co-op / Shooter"   },
    ]
  },
  relaxar: {
    titulo: "Hora de respirar e explorar sem pressa",
    jogos: [
      { nome: "Stardew Valley",     appid: 413150,  tag: "Fazenda / Sim"      },
      { nome: "No Mans Sky",        appid: 496920,  tag: "Exploracao espacial" },
      { nome: "Journey",            appid: 638230,  tag: "Experiencia / Arte"  },
      { nome: "Abzu",               appid: 384190,  tag: "Exploracao / Calmo"  },
    ]
  },
  desafio: {
    titulo: "Voce quer sofrer — e vai adorar",
    jogos: [
      { nome: "Elden Ring",         appid: 1245620, tag: "Souls-like"          },
      { nome: "Hollow Knight",      appid: 367520,  tag: "Metroidvania dificil" },
      { nome: "Celeste",            appid: 504230,  tag: "Plataforma preciso"   },
      { nome: "Sekiro",             appid: 814380,  tag: "Acao / Katana"        },
    ]
  },
  amigos: {
    titulo: "Melhor com companhia",
    jogos: [
      { nome: "Deep Rock Galactic", appid: 548430,  tag: "Co-op 4 jogadores"   },
      { nome: "It Takes Two",       appid: 1426210, tag: "Co-op 2 jogadores"   },
      { nome: "Phasmophobia",       appid: 739630,  tag: "Terror co-op"        },
      { nome: "Valheim",            appid: 892970,  tag: "Survival co-op"      },
    ]
  },
  surpresa: {
    titulo: "Uma escolha aleatoria para voce",
    jogos: (() => {
      const todos = [
        { nome: "Disco Elysium",    appid: 632470,  tag: "Unico"              },
        { nome: "Outer Wilds",      appid: 753640,  tag: "Exploracao / Misterio" },
        { nome: "Undertale",        appid: 391540,  tag: "Indie clasico"       },
        { nome: "Return of the Obra Dinn", appid: 653530, tag: "Puzzle / Misterio" },
        { nome: "Hades",            appid: 1145360, tag: "Roguelike"           },
        { nome: "Celeste",          appid: 504230,  tag: "Plataforma"          },
        { nome: "Inside",           appid: 304430,  tag: "Atmosferico"         },
        { nome: "Hollow Knight",    appid: 367520,  tag: "Metroidvania"        },
      ];
      return todos.sort(() => Math.random() - 0.5).slice(0, 4);
    })()
  }
};

// ── Renderiza ressacas ──
function renderRessacas() {
  const grid = document.getElementById("ressacas-grid");
  if (!grid) return;

  grid.innerHTML = RESSACAS.map(r => `
    <div class="card" style="cursor:pointer" onclick="window.location='pages/quiz.html'">
      <div class="card__img-wrapper">
        ${imgTag(`https://cdn.cloudflare.steamstatic.com/steam/apps/${r.appid}/header.jpg`, r.nome)}
      </div>
      <div class="card__body">
        <p class="card__title" title="${r.nome}">${r.nome}</p>
        <p class="card__meta">${r.motivo}</p>
        <button class="btn" onclick="event.stopPropagation(); window.location='pages/quiz.html'">
          O que jogar depois? →
        </button>
      </div>
    </div>
  `).join("");
}

// ── Mood buttons ──
function initMood() {
  const btns  = document.querySelectorAll(".mood-btn");
  const resultado = document.getElementById("mood-resultado");
  if (!btns.length || !resultado) return;

  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const mood = MOODS[btn.dataset.mood];
      if (!mood) return;

      resultado.classList.remove("hidden");
      resultado.innerHTML = `
        <h3>${mood.titulo}</h3>
        <div class="grid">
          ${mood.jogos.map(j => `
            <div class="card">
              <div class="card__img-wrapper">
                ${imgTag(`https://cdn.cloudflare.steamstatic.com/steam/apps/${j.appid}/header.jpg`, j.nome)}
              </div>
              <div class="card__body">
                <p class="card__title">${j.nome}</p>
                <span class="card__badge">${j.tag}</span>
                <button class="btn" onclick="abrirSteam(${j.appid})">Ver na Steam</button>
              </div>
            </div>
          `).join("")}
        </div>
      `;

      resultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

initHamburger();
initAuthHeader();
marcarNavAtivo();
renderRessacas();
initMood();
