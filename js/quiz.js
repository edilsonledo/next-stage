import { imgTag, abrirSteam, initHamburger, marcarNavAtivo } from "./utils.js";
window.abrirSteam = abrirSteam;

// ── Base de recomendações por combinação de respostas ──
const RECOMENDACOES = {
  // [curtiu]_[genero]_[tempo]  →  lista de jogos
  // A lógica prioriza genero + curtiu. tempo filtra quando possível.

  historia_rpg:       [
    { nome: "The Witcher 3",       appid: 292030,  tag: "RPG",        horas: "50h+",   motivo: "Narrativa rica, mundo enorme, personagens inesqueciveis."     },
    { nome: "Disco Elysium",       appid: 632470,  tag: "RPG",        horas: "20h",    motivo: "O jogo mais narrativo que existe. Texto brilhante."            },
    { nome: "Baldurs Gate 3",      appid: 1086940, tag: "RPG",        horas: "80h+",   motivo: "Decisoes que importam de verdade. Co-op tambem."               },
    { nome: "Planescape Torment",  appid: 466300,  tag: "RPG",        horas: "40h",    motivo: "Classico absoluto. A pergunta central do jogo te persegue."    },
  ],
  historia_acao:      [
    { nome: "God of War",          appid: 1593500, tag: "Acao/RPG",   horas: "25h",    motivo: "Narrativa de pai e filho que parte o coracao."                 },
    { nome: "Cyberpunk 2077",      appid: 1091500, tag: "RPG/Acao",   horas: "50h+",   motivo: "Historia profunda num mundo implacavel."                       },
    { nome: "Control",             appid: 870780,  tag: "Acao",       horas: "15h",    motivo: "Atmosfera unica, narrativa fragmentada e envolvente."           },
    { nome: "Nier Automata",       appid: 524220,  tag: "Acao/RPG",   horas: "40h",    motivo: "Vai te deixar mais ressacado que o anterior."                  },
  ],
  historia_souls:     [
    { nome: "Elden Ring",          appid: 1245620, tag: "Souls-like",  horas: "60h+",  motivo: "Lore profundo escondido em itens e ambientes."                 },
    { nome: "Dark Souls 3",        appid: 374320,  tag: "Souls-like",  horas: "40h",   motivo: "Narrativa tragica contada sem palavras."                       },
    { nome: "Sekiro",              appid: 814380,  tag: "Acao",        horas: "30h",   motivo: "Historia japonesa belissima. Boss fights memoraveis."           },
  ],
  gameplay_acao:      [
    { nome: "Hades",               appid: 1145360, tag: "Roguelike",   horas: "40h+",  motivo: "Combate mais satisfatorio que existe no genero."               },
    { nome: "Doom Eternal",        appid: 782330,  tag: "FPS",         horas: "15h",   motivo: "Adrenalina pura. Impossivel parar."                            },
    { nome: "Devil May Cry 5",     appid: 601150,  tag: "Hack&Slash",  horas: "15h",   motivo: "Estilo e combate no nivel mais alto."                          },
    { nome: "Sifu",                appid: 2138710, tag: "Acao",        horas: "10h",   motivo: "Dominar o combate e uma das melhores sensacoes dos games."     },
  ],
  gameplay_souls:     [
    { nome: "Hollow Knight",       appid: 367520,  tag: "Metroidvania",horas: "40h",   motivo: "Controles precisos, chefes desafiadores, mundo enorme."        },
    { nome: "Celeste",             appid: 504230,  tag: "Plataforma",  horas: "10h",   motivo: "Dificuldade justa. Cada fase e um puzzle de movimento."        },
    { nome: "Sekiro",              appid: 814380,  tag: "Souls-like",  horas: "30h",   motivo: "O gameplay mais recompensador que voce vai sentir."            },
    { nome: "Elden Ring",          appid: 1245620, tag: "Souls-like",  horas: "60h+",  motivo: "Liberdade total num souls-like. Revolucionario."               },
  ],
  mundo_rpg:          [
    { nome: "Elden Ring",          appid: 1245620, tag: "Souls-like",  horas: "60h+",  motivo: "Mundo aberto que premia a exploracao como nenhum outro."       },
    { nome: "The Witcher 3",       appid: 292030,  tag: "RPG",         horas: "50h+",  motivo: "Cada canto do mapa tem uma historia para contar."              },
    { nome: "No Mans Sky",         appid: 496920,  tag: "Exploracao",  horas: "inf",   motivo: "Universo procedural. Exploracao infinita."                     },
    { nome: "Outer Wilds",         appid: 753640,  tag: "Exploracao",  horas: "15h",   motivo: "Descoberta pura. Um dos melhores de todos os tempos."          },
  ],
  mundo_relaxante:    [
    { nome: "Stardew Valley",      appid: 413150,  tag: "Simulacao",   horas: "inf",   motivo: "O jogo mais aconchegante que existe."                         },
    { nome: "No Mans Sky",         appid: 496920,  tag: "Exploracao",  horas: "inf",   motivo: "Explore planetas infinitos no seu ritmo."                      },
    { nome: "Abzu",                appid: 384190,  tag: "Exploracao",  horas: "2h",    motivo: "Curtinho, lindo e muito relaxante."                            },
    { nome: "Journey",             appid: 638230,  tag: "Indie",       horas: "2h",    motivo: "Uma experiencia unica. Nao um jogo, uma jornada."              },
  ],
  desafio_souls:      [
    { nome: "Elden Ring",          appid: 1245620, tag: "Souls-like",  horas: "60h+",  motivo: "O melhor souls de todos os tempos. Sem discussao."             },
    { nome: "Sekiro",              appid: 814380,  tag: "Souls-like",  horas: "30h",   motivo: "O mais dificil da FromSoftware. E o mais recompensador."       },
    { nome: "Hollow Knight",       appid: 367520,  tag: "Metroidvania",horas: "40h",   motivo: "Chefes que vao te quebrar. Voce vai agradecer depois."         },
    { nome: "Celeste",             appid: 504230,  tag: "Plataforma",  horas: "10h",   motivo: "1000 mortes garantidas. Cada uma te ensina algo."              },
  ],
  arte_plataforma:    [
    { nome: "Hollow Knight",       appid: 367520,  tag: "Metroidvania",horas: "40h",   motivo: "Arte handmade belissima. Cada tela e um quadro."               },
    { nome: "Ori and the Blind Forest", appid: 261570, tag: "Plataforma",horas: "10h", motivo: "Visualmente deslumbrante. Trilha sonora inesquecivel."         },
    { nome: "Cuphead",             appid: 456740,  tag: "Plataforma",  horas: "8h",    motivo: "Arte dos anos 30 em pixel perfect. Incrivel."                  },
    { nome: "Gris",                appid: 683320,  tag: "Indie",       horas: "3h",    motivo: "Uma obra de arte jogavel. Mais emocao que muitos filmes."      },
  ],
  personagens_rpg:    [
    { nome: "Baldurs Gate 3",      appid: 1086940, tag: "RPG",         horas: "80h+",  motivo: "Personagens com a melhor escrita dos ultimos anos."            },
    { nome: "Disco Elysium",       appid: 632470,  tag: "RPG",         horas: "20h",   motivo: "Um detetive quebrado num mundo quebrado. Inesquecivel."        },
    { nome: "Nier Automata",       appid: 524220,  tag: "Acao/RPG",    horas: "40h",   motivo: "2B, 9S e A2 vao ficar na sua cabeca por meses."                },
    { nome: "Undertale",           appid: 391540,  tag: "RPG Indie",   horas: "6h",    motivo: "Personagens que voce vai amar — e nao vai conseguir machucar." },
  ],
  coop_coop:          [
    { nome: "It Takes Two",        appid: 1426210, tag: "Co-op",       horas: "12h",   motivo: "Melhor jogo co-op de todos os tempos. Obrigatorio a dois."     },
    { nome: "Deep Rock Galactic",  appid: 548430,  tag: "Co-op",       horas: "inf",   motivo: "Rock and Stone! 4 jogadores, sem toxicidade, puro divertimento."},
    { nome: "Phasmophobia",        appid: 739630,  tag: "Terror Co-op",horas: "inf",   motivo: "Caca-fantasmas que assusta de verdade. Melhor com amigos."     },
    { nome: "Valheim",             appid: 892970,  tag: "Survival",    horas: "inf",   motivo: "Survival viking com amigos. Construir e explorar juntos."      },
  ],
  surpresa_surpresa:  [
    { nome: "Outer Wilds",         appid: 753640,  tag: "Exploracao",  horas: "15h",   motivo: "Nao leia nada sobre. So jogue. Um dos melhores de todos os tempos." },
    { nome: "Return of the Obra Dinn", appid: 653530, tag: "Puzzle",   horas: "8h",    motivo: "Detetive unico. Voce vai resolver um misterio de verdade."     },
    { nome: "Disco Elysium",       appid: 632470,  tag: "RPG",         horas: "20h",   motivo: "Ao contrario de tudo que voce ja jogou."                       },
    { nome: "Undertale",           appid: 391540,  tag: "RPG Indie",   horas: "6h",    motivo: "Vai te surpreender do inicio ao fim."                          },
  ],
};

// Fallback generico
const FALLBACK = [
  { nome: "Hades",           appid: 1145360, tag: "Roguelike",   horas: "40h+",  motivo: "Impossivel errar. Um dos melhores jogos dos ultimos anos."    },
  { nome: "Hollow Knight",   appid: 367520,  tag: "Metroidvania",horas: "40h",   motivo: "Obra-prima indie. Arte, gameplay e historia perfeitos."        },
  { nome: "Outer Wilds",     appid: 753640,  tag: "Exploracao",  horas: "15h",   motivo: "Uma experiencia unica que voce nunca vai esquecer."            },
  { nome: "Celeste",         appid: 504230,  tag: "Plataforma",  horas: "10h",   motivo: "Desafio, emocao e uma historia sobre saude mental."            },
];

// ── Estado do quiz ──
let state = { ultimoJogo: "", curtiu: "", genero: "", tempo: "" };
let currentStep = 1;
const TOTAL_STEPS = 4;

// ── Utilitarios ──
function goStep(n) {
  document.querySelectorAll(".quiz-step").forEach(s => s.classList.remove("active"));
  document.getElementById(`step-${n === "resultado" ? "resultado" : n}`)?.classList.add("active");
  currentStep = n;
  renderProgress();
}

function renderProgress() {
  const el = document.getElementById("quiz-progress");
  if (!el) return;
  el.innerHTML = Array.from({ length: TOTAL_STEPS }, (_, i) => {
    const num = i + 1;
    const cls = num < currentStep ? "done" : num === currentStep ? "active" : "";
    return `<div class="quiz-dot ${cls}"></div>`;
  }).join("");
}

function getOpcaoSelecionada(containerId) {
  return document.querySelector(`#${containerId} .quiz-option.selected`)?.dataset.val || "";
}

function selecionarOpcao(containerId) {
  document.querySelectorAll(`#${containerId} .quiz-option`).forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(`#${containerId} .quiz-option`).forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
}

// ── Gera resultado ──
function gerarResultado() {
  const chave = `${state.curtiu}_${state.genero}`;
  const lista = RECOMENDACOES[chave] || FALLBACK;

  // Filtra por tempo quando possivel
  let filtrados = lista;
  if (state.tempo === "curto")  filtrados = lista.filter(j => parseInt(j.horas) <= 20) || lista;
  if (state.tempo === "longo")  filtrados = lista.filter(j => parseInt(j.horas) >= 40) || lista;
  if (!filtrados.length) filtrados = lista;

  const destaque = filtrados[0];
  const outros   = filtrados.slice(1);

  const el = document.getElementById("step-resultado");
  el.innerHTML = `
    <div class="resultado-header">
      <h2>Seu proximo jogo e...</h2>
      <p>Baseado no que voce jogou (${state.ultimoJogo || "seu ultimo jogo"}) e no que voce gosta.</p>
    </div>

    <!-- Destaque -->
    <div class="resultado-destaque">
      <img
        src="https://cdn.cloudflare.steamstatic.com/steam/apps/${destaque.appid}/header.jpg"
        alt="${destaque.nome}"
        onerror="this.src='https://placehold.co/460x215/2a475e/66c0f4?text=No+Image'"
      >
      <div class="resultado-destaque__info">
        <h3>${destaque.nome}</h3>
        <div class="tag-list">
          <span class="tag">${destaque.tag}</span>
          <span class="tag">⏱ ${destaque.horas}</span>
        </div>
        <p>${destaque.motivo}</p>
        <button class="btn" onclick="abrirSteam(${destaque.appid})">Ver na Steam →</button>
      </div>
    </div>

    <!-- Outras opcoes -->
    ${outros.length ? `
      <h3 class="section-title" style="margin-top:0">Outras opcoes para voce</h3>
      <div class="grid">
        ${outros.map(j => `
          <div class="card">
            <div class="card__img-wrapper">
              ${imgTag(`https://cdn.cloudflare.steamstatic.com/steam/apps/${j.appid}/header.jpg`, j.nome)}
            </div>
            <div class="card__body">
              <p class="card__title">${j.nome}</p>
              <span class="card__badge">${j.tag} · ${j.horas}</span>
              <p class="card__meta">${j.motivo}</p>
              <button class="btn" onclick="abrirSteam(${j.appid})">Ver na Steam</button>
            </div>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <div style="text-align:center; margin-top:32px;">
      <button class="btn btn--outline" onclick="reiniciarQuiz()">Tentar de novo →</button>
    </div>
  `;
}

window.reiniciarQuiz = function() {
  state = { ultimoJogo: "", curtiu: "", genero: "", tempo: "" };
  document.getElementById("input-ultimo-jogo").value = "";
  document.querySelectorAll(".quiz-option").forEach(b => b.classList.remove("selected"));
  goStep(1);
};

// ── Navegacao ──
document.getElementById("btn-step1-next").addEventListener("click", () => {
  const val = document.getElementById("input-ultimo-jogo").value.trim();
  state.ultimoJogo = val;
  goStep(2);
});

document.getElementById("btn-step2-next").addEventListener("click", () => {
  state.curtiu = getOpcaoSelecionada("opts-curtiu");
  if (!state.curtiu) { alert("Escolha uma opcao!"); return; }
  goStep(3);
});
document.getElementById("btn-step2-back").addEventListener("click", () => goStep(1));

document.getElementById("btn-step3-next").addEventListener("click", () => {
  state.genero = getOpcaoSelecionada("opts-genero");
  if (!state.genero) { alert("Escolha uma opcao!"); return; }
  goStep(4);
});
document.getElementById("btn-step3-back").addEventListener("click", () => goStep(2));

document.getElementById("btn-step4-next").addEventListener("click", () => {
  state.tempo = getOpcaoSelecionada("opts-tempo");
  if (!state.tempo) { alert("Escolha uma opcao!"); return; }
  gerarResultado();
  goStep("resultado");
});
document.getElementById("btn-step4-back").addEventListener("click", () => goStep(3));

// Permitir Enter no campo de texto
document.getElementById("input-ultimo-jogo").addEventListener("keyup", e => {
  if (e.key === "Enter") document.getElementById("btn-step1-next").click();
});

// ── Init ──
selecionarOpcao("opts-curtiu");
selecionarOpcao("opts-genero");
selecionarOpcao("opts-tempo");
initHamburger();
marcarNavAtivo();
renderProgress();
