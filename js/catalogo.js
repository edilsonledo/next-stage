import { imgTag, abrirSteam, initHamburger, marcarNavAtivo } from "./utils.js";
import { initAuthHeader } from "./authHeader.js";
import { onUsuarioMudou, salvarJogo, marcarJogado } from "./auth.js";
window.abrirSteam = abrirSteam;

const CATALOGO = [
  { nome: "Hades",                   appid: 1145360,  genero: "Roguelike",    horas: "40h+",  motivo: "Combate perfeito e narrativa que evolui a cada run."        },
  { nome: "Hollow Knight",           appid: 367520,   genero: "Metroidvania", horas: "40h",   motivo: "Arte handmade, mundo enorme, chefes desafiadores."          },
  { nome: "Celeste",                 appid: 504230,   genero: "Plataforma",   horas: "10h",   motivo: "Plataforma preciso com historia poderosa sobre ansiedade."  },
  { nome: "Outer Wilds",             appid: 753640,   genero: "Exploracao",   horas: "15h",   motivo: "Descoberta pura. Nao leia nada — so jogue."                 },
  { nome: "Disco Elysium",           appid: 632470,   genero: "RPG",          horas: "20h",   motivo: "O RPG mais narrativo que existe. Texto brilhante."          },
  { nome: "Elden Ring",              appid: 1245620,  genero: "Souls-like",   horas: "60h+",  motivo: "Worlds best souls-like. Exploracao recompensadora."         },
  { nome: "Sekiro",                  appid: 814380,   genero: "Souls-like",   horas: "30h",   motivo: "O mais dificil da FromSoftware. E o mais satisfatorio."     },
  { nome: "The Witcher 3",           appid: 292030,   genero: "RPG",          horas: "50h+",  motivo: "Narrativa rica, mundo vivo, quests secundarias incriveis." },
  { nome: "Cyberpunk 2077",          appid: 1091500,  genero: "RPG",          horas: "50h+",  motivo: "Night City e um dos melhores mundos criados nos games."     },
  { nome: "Baldurs Gate 3",          appid: 1086940,  genero: "RPG",          horas: "80h+",  motivo: "Escolhas que importam. RPG de mesa masterizado."            },
  { nome: "God of War",              appid: 1593500,  genero: "Acao",         horas: "25h",   motivo: "Pai e filho. Narrativa e acao no nivel mais alto."          },
  { nome: "Doom Eternal",            appid: 782330,   genero: "Acao",         horas: "15h",   motivo: "FPS mais frenético dos ultimos anos. Adrenalina pura."      },
  { nome: "Devil May Cry 5",         appid: 601150,   genero: "Acao",         horas: "15h",   motivo: "Estilo e combate no nivel mais alto do hack and slash."     },
  { nome: "Nier Automata",           appid: 524220,   genero: "Acao",         horas: "40h",   motivo: "Vai te deixar mais ressacado que qualquer outro jogo."      },
  { nome: "It Takes Two",            appid: 1426210,  genero: "Co-op",        horas: "12h",   motivo: "Melhor co-op de todos os tempos. Obrigatorio a dois."       },
  { nome: "Deep Rock Galactic",      appid: 548430,   genero: "Co-op",        horas: "inf",   motivo: "Rock and Stone! Co-op sem toxicidade, puro divertimento."   },
  { nome: "Phasmophobia",            appid: 739630,   genero: "Co-op",        horas: "inf",   motivo: "Caca-fantasmas que assusta de verdade com amigos."          },
  { nome: "Valheim",                 appid: 892970,   genero: "Co-op",        horas: "inf",   motivo: "Survival viking. Construir e explorar juntos e incrivel."   },
  { nome: "Stardew Valley",          appid: 413150,   genero: "Relaxante",    horas: "inf",   motivo: "O jogo mais aconchegante que existe. Viciante."             },
  { nome: "No Mans Sky",             appid: 496920,   genero: "Relaxante",    horas: "inf",   motivo: "Universo procedural. Exploracao e construcao infinitas."    },
  { nome: "Journey",                 appid: 638230,   genero: "Relaxante",    horas: "2h",    motivo: "Uma jornada, nao um jogo. Emocional e lindo."               },
  { nome: "Abzu",                    appid: 384190,   genero: "Relaxante",    horas: "2h",    motivo: "Mergulho visual. Relaxante e visualmente deslumbrante."     },
  { nome: "Undertale",               appid: 391540,   genero: "Indie",        horas: "6h",    motivo: "Personagens que voce nao vai conseguir machucar."           },
  { nome: "Ori and the Blind Forest",appid: 261570,   genero: "Plataforma",   horas: "10h",   motivo: "Visualmente deslumbrante. Trilha sonora inesquecivel."      },
  { nome: "Return of the Obra Dinn", appid: 653530,   genero: "Puzzle",       horas: "8h",    motivo: "Detetive unico. Resolva um misterio de verdade."            },
  { nome: "Gris",                    appid: 683320,   genero: "Indie",        horas: "3h",    motivo: "Obra de arte jogavel. Mais emocao que muitos filmes."       },
  { nome: "Cuphead",                 appid: 456740,   genero: "Plataforma",   horas: "8h",    motivo: "Arte dos anos 30. Boss rush dificilissimo e viciante."      },
  { nome: "Dark Souls 3",            appid: 374320,   genero: "Souls-like",   horas: "40h",   motivo: "Narrativa tragica contada sem palavras. Classico."          },
];

const GENEROS = ["Todos", ...new Set(CATALOGO.map(j => j.genero))];
let generoAtivo = "Todos";
let termoBusca = "";

function renderCatalogo() {
  const grid = document.getElementById("catalogo-grid");
  const titulo = document.getElementById("cat-titulo");

  let lista = generoAtivo === "Todos" ? CATALOGO : CATALOGO.filter(j => j.genero === generoAtivo);
  if (termoBusca) lista = lista.filter(j => j.nome.toLowerCase().includes(termoBusca));

  titulo.textContent = generoAtivo === "Todos" ? `Todos os jogos (${lista.length})` : `${generoAtivo} (${lista.length})`;

  if (!lista.length) {
    grid.innerHTML = `<p class="error-msg">Nenhum jogo encontrado.</p>`;
    return;
  }

  grid.innerHTML = lista.map(j => `
    <div class="card">
      <div class="card__img-wrapper">
        ${imgTag(`https://cdn.cloudflare.steamstatic.com/steam/apps/${j.appid}/header.jpg`, j.nome)}
      </div>
      <div class="card__body">
        <p class="card__title" title="${j.nome}">${j.nome}</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="card__badge">${j.genero}</span>
          <span class="card__badge">⏱ ${j.horas}</span>
        </div>
        <p class="card__meta">${j.motivo}</p>
        <button class="btn" onclick="abrirSteam(${j.appid})">Ver na Steam</button>
        <div class="card-actions" style="display:flex;gap:6px;margin-top:6px">
          <button class="btn btn--outline btn--icon" title="Salvar jogo"
            onclick='salvarJogoHandler(${JSON.stringify(j)})'>🔖 Salvar</button>
          <button class="btn btn--outline btn--icon" title="Marcar como jogado"
            onclick='jogadoHandler(${JSON.stringify(j)})'>✅ Jogado</button>
        </div>
      </div>
    </div>
  `).join("");
}

function renderFiltros() {
  const container = document.getElementById("genero-tabs");
  container.innerHTML = GENEROS.map(g => `
    <button class="filter-tab ${g === generoAtivo ? "active" : ""}" data-gen="${g}">${g}</button>
  `).join("");

  container.querySelectorAll(".filter-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      generoAtivo = btn.dataset.gen;
      container.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCatalogo();
    });
  });
}

// Busca
document.getElementById("search-btn").addEventListener("click", () => {
  termoBusca = document.getElementById("search-input").value.toLowerCase().trim();
  renderCatalogo();
});
document.getElementById("search-input").addEventListener("keyup", e => {
  if (e.key === "Enter") document.getElementById("search-btn").click();
  if (e.key === "Escape") {
    termoBusca = "";
    document.getElementById("search-input").value = "";
    renderCatalogo();
  }
});

// ── Auth handlers para os cards ──
let usuarioLogado = null;
onUsuarioMudou(u => { usuarioLogado = u; });

function precisaLogin(acao) {
  if (!usuarioLogado) {
    if (confirm("Voce precisa estar logado para " + acao + ".\nEntrar agora?")) {
      window.location.href = "perfil.html";
    }
    return true;
  }
  return false;
}

window.salvarJogoHandler = async (jogo) => {
  if (precisaLogin("salvar jogos")) return;
  await salvarJogo(usuarioLogado.uid, jogo);
  mostrarToast("🔖 " + jogo.nome + " salvo no seu perfil!");
};

window.jogadoHandler = async (jogo) => {
  if (precisaLogin("marcar jogos")) return;
  await marcarJogado(usuarioLogado.uid, jogo);
  mostrarToast("✅ " + jogo.nome + " marcado como jogado!");
};

function mostrarToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

initHamburger();
initAuthHeader();
marcarNavAtivo();
renderFiltros();
renderCatalogo();
