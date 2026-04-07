// =============================================
// js/jogo.js — Game Hub Page Logic
// =============================================
import { onUsuarioMudou } from "./auth.js";
import { renderAuthArea } from "./authHeader.js";
import { initHamburger } from "./utils.js";

initHamburger();
onUsuarioMudou(user => renderAuthArea(user, document.getElementById("auth-area")));

// --- URL Params ---
const params = new URLSearchParams(location.search);
const APPID = params.get("appid") || "";
const NOME  = params.get("name")  || "Jogo Desconhecido";

// =============================================
// Base de Recursos por Jogo (appid → dados)
// =============================================
const DB = {

  // ─── ELDEN RING ────────────────────────────
  "1245620": {
    nome: "Elden Ring",
    curiosidades: [
      "Elden Ring foi desenvolvido por Hidetaka Miyazaki (FromSoftware) em parceria com George R.R. Martin, que criou a mitologia do mundo.",
      "O mundo aberto foi a primeira vez que a FromSoftware criou um mapa completamente explorável em um Soulslike.",
      "O jogo foi anunciado em 2019, mas só foi lançado em fevereiro de 2022 — 3 anos de silêncio absoluto.",
      "O Erdtree (Árvore Dourada) é baseado visualmente no conceito de Yggdrasil da mitologia nórdica.",
      "Existem mais de 100 chefes no jogo, sendo Malenia, Blade of Miquella considerada a mais difícil por muitos jogadores.",
      "Malenia nunca foi derrotada em lore — ela foi criada com a Podridão Escarlate e nunca sofreu uma derrota.",
      "O jogo vendeu mais de 20 milhões de cópias em menos de 1 ano, tornando-se o Soulslike mais vendido de todos os tempos.",
      "O 'Let Me Solo Her' — um jogador nu com um capacete de panela — se tornou uma lenda ajudando milhares de jogadores a derrotar Malenia.",
      "A expansão Shadow of the Erdtree foi lançada em junho de 2024 e é considerada um dos melhores DLCs da história.",
      "Ranni, a bruxa que inicia uma das maiores questlines do jogo, escondeu o próprio destino por toda a história."
    ],
    recursos: [
      {
        categoria: "🗺️ Mapas Interativos",
        links: [
          { label: "Elden Ring Map (MapGenie)", url: "https://mapgenie.io/elden-ring/maps/the-lands-between", desc: "Mapa completo com todos os itens, chefes, graças e segredos" },
          { label: "Fextralife Map", url: "https://eldenring.wiki.fextralife.com/Interactive+Map", desc: "Mapa interativo da Fextralife com filtros detalhados" },
        ]
      },
      {
        categoria: "⚔️ Builds & Guias",
        links: [
          { label: "Fextralife — Builds", url: "https://eldenring.wiki.fextralife.com/Builds", desc: "Centenas de builds para todos os estilos de jogo" },
          { label: "Elden Ring Build Planner", url: "https://eldenring.wiki.fextralife.com/Character+Planner", desc: "Planeje sua build com o planner oficial da Fextralife" },
          { label: "r/EldenRingBuilds", url: "https://www.reddit.com/r/EldenRingBuilds/", desc: "Subreddit dedicado exclusivamente a builds" },
        ]
      },
      {
        categoria: "📖 Wiki & Lore",
        links: [
          { label: "Fextralife Wiki", url: "https://eldenring.wiki.fextralife.com/", desc: "Wiki mais completa — itens, chefes, lore, localizações" },
          { label: "Elden Ring Wiki (Fandom)", url: "https://eldenring.fandom.com/wiki/Elden_Ring_Wiki", desc: "Wiki da comunidade com lore profundo" },
          { label: "Elden Ring Lore (Vaati Vidya)", url: "https://www.youtube.com/@VaatiVidya", desc: "Canal do YouTube com o melhor conteúdo de lore de Soulsborne" },
        ]
      },
      {
        categoria: "🤝 Comunidade",
        links: [
          { label: "r/Eldenring", url: "https://www.reddit.com/r/Eldenring/", desc: "Subreddit principal — dicas, memes, discussões" },
          { label: "Discord Oficial", url: "https://discord.com/invite/eldenring", desc: "Servidor oficial de Elden Ring no Discord" },
        ]
      },
      {
        categoria: "🛠️ Ferramentas",
        links: [
          { label: "SteamDB — Elden Ring", url: "https://www.steamdb.info/app/1245620/", desc: "Estatísticas, DLCs e histórico de preços na Steam" },
          { label: "PCGamingWiki", url: "https://www.pcgamingwiki.com/wiki/Elden_Ring", desc: "Configurações, fixes, mods e otimizações para PC" },
          { label: "Nexus Mods", url: "https://www.nexusmods.com/eldenring", desc: "Mods para Elden Ring" },
        ]
      },
    ]
  },

  // ─── DARK SOULS III ────────────────────────
  "374320": {
    nome: "Dark Souls III",
    curiosidades: [
      "Dark Souls III é o último jogo da trilogia e marca o fim do 'Ciclo da Chama' iniciado no primeiro jogo.",
      "Miyazaki retornou como diretor após Dark Souls II ter sido desenvolvido por outra equipe.",
      "A DLC 'The Ringed City' fecha a história de todo o universo Dark Souls com um final apocalíptico.",
      "O sistema de combate foi acelerado em relação aos jogos anteriores, inspirado por Bloodborne.",
      "Muitos chefes fazem referência a personagens e locais dos jogos anteriores da série.",
      "O chefe Nameless King é considerado um dos mais difíceis de toda a série Soulsborne."
    ],
    recursos: [
      {
        categoria: "🗺️ Mapas",
        links: [
          { label: "MapGenie — DS3", url: "https://mapgenie.io/dark-souls-3/maps/lothric", desc: "Mapa interativo completo de Dark Souls III" },
        ]
      },
      {
        categoria: "⚔️ Builds & Guias",
        links: [
          { label: "Fextralife — Builds DS3", url: "https://darksouls3.wiki.fextralife.com/Builds", desc: "Guias e builds para Dark Souls III" },
          { label: "Fextralife Wiki DS3", url: "https://darksouls3.wiki.fextralife.com/", desc: "Wiki completa com itens, chefes e lore" },
        ]
      },
      {
        categoria: "🤝 Comunidade",
        links: [
          { label: "r/darksouls3", url: "https://www.reddit.com/r/darksouls3/", desc: "Subreddit de Dark Souls III" },
        ]
      },
    ]
  },

  // ─── CYBERPUNK 2077 ────────────────────────
  "1091500": {
    nome: "Cyberpunk 2077",
    curiosidades: [
      "Cyberpunk 2077 foi lançado em 2020 em estado caótico com dezenas de bugs — virou meme mundial.",
      "Após a patch 2.0 e a DLC Phantom Liberty (2023), o jogo se tornou uma experiência completamente diferente.",
      "Night City é baseada em Los Angeles e Las Vegas, e o design foi inspirado no RPG de mesa Cyberpunk 2020.",
      "Keanu Reeves interpreta Johnny Silverhand, uma presença onipresente que vive na cabeça do protagonista V.",
      "O jogo tem 5 finais diferentes, todos influenciados por suas escolhas durante a campanha.",
      "A CDProjekt RED usou captura de movimento para todas as cutscenes, incluindo cenas de nudez.",
      "Johnny Silverhand é baseado no músico punk-rock Samurai — sua banda no jogo tem músicas reais compostas para o universo.",
    ],
    recursos: [
      {
        categoria: "🗺️ Mapas",
        links: [
          { label: "MapGenie — Cyberpunk", url: "https://mapgenie.io/cyberpunk-2077/maps/night-city", desc: "Mapa completo de Night City com todos os pontos de interesse" },
        ]
      },
      {
        categoria: "⚔️ Builds & Guias",
        links: [
          { label: "Cyberpunk 2077 Wiki (Fandom)", url: "https://cyberpunk.fandom.com/wiki/Cyberpunk_Wiki", desc: "Wiki completa com perks, builds e lore" },
          { label: "r/LowSodiumCyberpunk", url: "https://www.reddit.com/r/LowSodiumCyberpunk/", desc: "Subreddit positivo com dicas e builds" },
          { label: "Cyberpunk 2.0 Build Planner", url: "https://wiki.shiekirinah.com/cyberpunk-build-planner", desc: "Planeje sua build com o sistema 2.0" },
        ]
      },
      {
        categoria: "📖 Lore",
        links: [
          { label: "Cyberpunk Lore no YouTube", url: "https://www.youtube.com/results?search_query=cyberpunk+2077+lore+explained", desc: "Vídeos explicando o lore profundo de Night City" },
        ]
      },
      {
        categoria: "🛠️ Ferramentas & Mods",
        links: [
          { label: "Nexus Mods — Cyberpunk", url: "https://www.nexusmods.com/cyberpunk2077", desc: "Mods da comunidade" },
          { label: "PCGamingWiki", url: "https://www.pcgamingwiki.com/wiki/Cyberpunk_2077", desc: "Fixes e otimizações para PC" },
        ]
      },
    ]
  },

  // ─── THE WITCHER 3 ─────────────────────────
  "292030": {
    nome: "The Witcher 3: Wild Hunt",
    curiosidades: [
      "The Witcher 3 ganhou mais de 800 prêmios e é considerado um dos maiores jogos da história.",
      "O jogo tem 36 finais diferentes dependendo das escolhas feitas ao longo da história.",
      "A expansão Blood and Wine adiciona um mapa maior do que todo o mundo de The Witcher 1 e 2.",
      "CD Projekt RED lançou o jogo completo com todas as DLCs de graça para quem já o possuía na 'Next-Gen Update'.",
      "Geralt foi dublado em polonês por Jacek Rozenek, mas a voz mais famosa é a inglesa de Doug Cockle.",
      "A série Netflix aumentou drasticamente as vendas do jogo, anos após seu lançamento.",
    ],
    recursos: [
      {
        categoria: "🗺️ Mapas",
        links: [
          { label: "MapGenie — Witcher 3", url: "https://mapgenie.io/witcher-3/maps/velen-novigrad", desc: "Mapa interativo de Velen, Novigrad, Skellige e mais" },
        ]
      },
      {
        categoria: "⚔️ Guias & Builds",
        links: [
          { label: "Witcher 3 Wiki (Fandom)", url: "https://witcher.fandom.com/wiki/The_Witcher_3:_Wild_Hunt", desc: "Wiki completa com missões, builds e lore" },
          { label: "r/witcher", url: "https://www.reddit.com/r/witcher/", desc: "Subreddit da comunidade Witcher" },
        ]
      },
      {
        categoria: "🛠️ Mods",
        links: [
          { label: "Nexus Mods — Witcher 3", url: "https://www.nexusmods.com/witcher3", desc: "Mods da comunidade para Witcher 3" },
        ]
      },
    ]
  },

  // ─── HOLLOW KNIGHT ─────────────────────────
  "367520": {
    nome: "Hollow Knight",
    curiosidades: [
      "Hollow Knight foi desenvolvido por apenas 3 pessoas (Team Cherry) com um orçamento inicial de Kickstarter de ~57 mil dólares.",
      "O jogo tem mais de 40 horas de conteúdo principal e pode chegar a 60+ horas com todos os segredos.",
      "A trilha sonora foi composta por Christopher Larkin e é amplamente considerada uma das melhores de um indie.",
      "O lore do jogo é quase completamente contado de forma ambiental — sem tutoriais ou texto explicativo direto.",
      "O chefe Pantheon of the Sage (final do Godmaster DLC) é considerado um dos desafios mais difíceis de plataformas 2D.",
      "Hollow Knight: Silksong foi anunciado em 2019 como expansão, mas cresceu tanto que se tornou um jogo completo separado.",
    ],
    recursos: [
      {
        categoria: "🗺️ Mapas",
        links: [
          { label: "Hollow Knight Map (Fandom)", url: "https://hollowknight.fandom.com/wiki/Hallownest_(map)", desc: "Mapa completo de Hallownest com todas as áreas" },
          { label: "Interactive Map", url: "https://www.hollowknight.com/", desc: "Site oficial com recursos" },
        ]
      },
      {
        categoria: "📖 Wiki & Lore",
        links: [
          { label: "Hollow Knight Wiki", url: "https://hollowknight.fandom.com/wiki/Hollow_Knight_Wiki", desc: "Wiki completa da comunidade" },
          { label: "Lore no YouTube", url: "https://www.youtube.com/results?search_query=hollow+knight+lore+explained", desc: "Vídeos de lore profundo" },
        ]
      },
      {
        categoria: "🤝 Comunidade",
        links: [
          { label: "r/HollowKnight", url: "https://www.reddit.com/r/HollowKnight/", desc: "Subreddit com dicas, fan art e discussões" },
        ]
      },
    ]
  },

  // ─── SEKIRO ────────────────────────────────
  "814380": {
    nome: "Sekiro: Shadows Die Twice",
    curiosidades: [
      "Sekiro ganhou o GOTY (Jogo do Ano) da The Game Awards em 2019.",
      "É o único Soulslike da FromSoftware com um protagonista fixo com história própria — Wolf, o shinobi.",
      "O sistema de postura foi revolucionário: você não pode simplesmente esquivar, precisa defletir os ataques.",
      "O chefe Genichiro Ashina funciona como um 'tutor' disfarçado — a maioria dos jogadores morre muitas vezes antes de aprender a mecânica central.",
      "O jogo tem 4 finais diferentes, todos relacionados ao conceito de imortalidade e sacrifício.",
      "A luta contra Isshin, the Sword Saint, é amplamente considerada a melhor luta de chefe da história dos games.",
    ],
    recursos: [
      {
        categoria: "📖 Wiki & Guias",
        links: [
          { label: "Sekiro Wiki (Fextralife)", url: "https://sekirotheshadowsdietwice.wiki.fextralife.com/", desc: "Wiki completa com habilidades, itens e chefes" },
          { label: "r/Sekiro", url: "https://www.reddit.com/r/Sekiro/", desc: "Subreddit com dicas e discussões" },
        ]
      },
      {
        categoria: "🛠️ Ferramentas",
        links: [
          { label: "PCGamingWiki — Sekiro", url: "https://www.pcgamingwiki.com/wiki/Sekiro:_Shadows_Die_Twice", desc: "Fixes, mods e configurações para PC" },
          { label: "Nexus Mods — Sekiro", url: "https://www.nexusmods.com/sekiro", desc: "Mods da comunidade" },
        ]
      },
    ]
  },

  // ─── RED DEAD REDEMPTION 2 ─────────────────
  "1174180": {
    nome: "Red Dead Redemption 2",
    curiosidades: [
      "RDR2 levou 8 anos e mais de 2.000 desenvolvedores para ser criado, com orçamento estimado de 540 milhões de dólares.",
      "O jogo tem mais de 200 espécies de animais com comportamentos únicos e realistas.",
      "Arthur Morgan escreve um diário com entradas únicas para quase todos os eventos do jogo.",
      "O cavalo de Arthur tem um sistema de vínculo — quanto mais você cuida dele, melhor ele fica.",
      "Existem missões secretas que só aparecem depois de horas de jogo livre, sem qualquer indicação no mapa.",
      "A trilha sonora foi gravada especialmente para o jogo com instrumentos da época do Velho Oeste.",
      "RDR2 é na verdade uma prequel de Red Dead Redemption 1 — conta o que levou ao fim do gang de Dutch Van Der Linde.",
    ],
    recursos: [
      {
        categoria: "🗺️ Mapas",
        links: [
          { label: "MapGenie — RDR2", url: "https://mapgenie.io/red-dead-redemption-2/maps/world", desc: "Mapa interativo com todos os coletáveis e segredos" },
        ]
      },
      {
        categoria: "📖 Wiki & Guias",
        links: [
          { label: "RDR2 Wiki (Fandom)", url: "https://reddead.fandom.com/wiki/Red_Dead_Redemption_2", desc: "Wiki completa com personagens, missões e lore" },
          { label: "r/reddeadredemption", url: "https://www.reddit.com/r/reddeadredemption/", desc: "Subreddit principal da comunidade" },
        ]
      },
    ]
  },

  // ─── BALDUR'S GATE 3 ───────────────────────
  "1086940": {
    nome: "Baldur's Gate 3",
    curiosidades: [
      "BG3 levou mais de 6 anos para ser desenvolvido pela Larian Studios (criadores da série Divinity).",
      "O jogo tem mais de 17.000 variações de finais dependendo de todas as suas escolhas.",
      "Existem mais de 200 horas de conteúdo e diálogo gravados no jogo.",
      "Você pode literalmente trair e matar qualquer NPC do jogo — inclusive seus próprios companheiros.",
      "A vaca que vira uma deusa (Mol e o Lathander questline) é um dos lores mais surpreendentes do jogo.",
      "BG3 ganhou o GOTY 2023 em quase todas as cerimônias e é considerado o melhor RPG da geração.",
      "O jogo é baseado nas regras de D&D 5ª edição — cada dado virtual rola mecanicamente igual ao real.",
    ],
    recursos: [
      {
        categoria: "⚔️ Builds & Guias",
        links: [
          { label: "BG3 Wiki (Fextralife)", url: "https://baldursgate3.wiki.fextralife.com/Baldur's+Gate+3+Wiki", desc: "Wiki completa com classes, builds e feitiços" },
          { label: "r/BaldursGate3", url: "https://www.reddit.com/r/BaldursGate3/", desc: "Subreddit principal — dicas, builds, segredos" },
          { label: "BG3 Build Planner (Codex)", url: "https://bg3.codexes.com/", desc: "Planejador de builds online" },
        ]
      },
      {
        categoria: "📖 Lore",
        links: [
          { label: "Forgotten Realms Wiki", url: "https://forgottenrealms.fandom.com/wiki/Main_Page", desc: "Lore do universo D&D onde BG3 se passa" },
        ]
      },
    ]
  },

  // ─── MINECRAFT ─────────────────────────────
  "359550": {
    nome: "Minecraft (Bedrock/Windows)",
    curiosidades: [
      "Minecraft é o jogo mais vendido de todos os tempos — mais de 238 milhões de cópias.",
      "Notch (Markus Persson) criou o protótipo original em apenas 6 dias em 2009.",
      "O Enderman foi criado baseado no Slender Man, personagem de terror da internet.",
      "Cada mundo de Minecraft é maior do que a superfície da Terra.",
      "O Herobrine — um Steve sem olhos — nunca existiu no jogo, mas a lenda foi tão forte que a Mojang inclui piadas sobre 'remover Herobrine' nos changelogs.",
    ],
    recursos: [
      {
        categoria: "📖 Wiki",
        links: [
          { label: "Minecraft Wiki", url: "https://minecraft.wiki/", desc: "Wiki oficial e mais completa de Minecraft" },
          { label: "r/Minecraft", url: "https://www.reddit.com/r/Minecraft/", desc: "Subreddit principal com dicas e criações" },
        ]
      },
      {
        categoria: "🛠️ Ferramentas",
        links: [
          { label: "Chunker — Conversor de Mundos", url: "https://chunker.app/", desc: "Converter mundos entre versões e edições" },
          { label: "MCStacker — Gerador de Comandos", url: "https://mcstacker.net/", desc: "Gerador de comandos NBT para Minecraft" },
        ]
      },
    ]
  },

};

// =============================================
// Recursos Genéricos (para jogos não mapeados)
// =============================================
function getRecursosGenericos(nome, appid) {
  const q = encodeURIComponent(nome);
  return [
    {
      categoria: "🔍 Pesquisa rápida",
      links: [
        { label: "Google — Builds & Guias", url: `https://www.google.com/search?q=${q}+builds+guia`, desc: "Pesquise builds e guias no Google" },
        { label: "Google — Mapa Interativo", url: `https://www.google.com/search?q=${q}+interactive+map`, desc: "Procure um mapa interativo" },
        { label: "YouTube — Gameplay & Lore", url: `https://www.youtube.com/results?search_query=${q}+lore+explicado`, desc: "Vídeos de gameplay e lore no YouTube" },
      ]
    },
    {
      categoria: "🛠️ Ferramentas",
      links: [
        { label: "SteamDB", url: `https://www.steamdb.info/app/${appid}/`, desc: "Histórico de preços, DLCs e estatísticas" },
        { label: "PCGamingWiki", url: `https://www.pcgamingwiki.com/w/index.php?search=${q}`, desc: "Fixes, mods e otimizações para PC" },
        { label: "Nexus Mods", url: `https://www.nexusmods.com/search/?gsearch=${q}`, desc: "Mods da comunidade no Nexus" },
        { label: "ProtonDB", url: `https://www.protondb.com/search#${q}`, desc: "Compatibilidade com Linux/Steam Deck" },
      ]
    },
    {
      categoria: "🤝 Comunidade",
      links: [
        { label: `Reddit — r/${nome.replace(/\s/g,'')}`, url: `https://www.reddit.com/search/?q=${q}&type=sr`, desc: "Procure o subreddit do jogo" },
        { label: "Fextralife Wiki Search", url: `https://fextralife.com/?s=${q}`, desc: "Pesquise na rede de wikis Fextralife" },
        { label: "Fandom Wiki Search", url: `https://www.fandom.com/explore?q=${q}`, desc: "Wikis da comunidade Fandom" },
      ]
    },
  ];
}

// =============================================
// Render
// =============================================
function renderHub() {
  const dados = DB[APPID];
  const nome  = dados?.nome || NOME;

  // Título da aba
  document.title = `${nome} — Next Stage`;
  document.getElementById("page-title").textContent = `${nome} — Next Stage`;

  // Hero
  const imgUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${APPID}/header.jpg`;
  const bgUrl  = `https://cdn.cloudflare.steamstatic.com/steam/apps/${APPID}/library_hero.jpg`;

  document.getElementById("jogo-capa").src = imgUrl;
  document.getElementById("jogo-capa").alt = nome;
  document.getElementById("jogo-nome").textContent = nome;
  document.getElementById("jogo-steam-link").href = `https://store.steampowered.com/app/${APPID}/`;

  // BG parallax (usa library_hero ou header como fallback)
  const heroBg = document.getElementById("jogo-hero-bg");
  heroBg.style.backgroundImage = `url('${bgUrl}')`;

  const recursos = dados?.recursos || getRecursosGenericos(nome, APPID);
  renderRecursos(recursos, "recursos-grid");

  // Curiosidades
  if (dados?.curiosidades?.length) {
    document.getElementById("section-curiosidades").classList.remove("hidden");
    renderCuriosidades(dados.curiosidades);
  }
}

function renderRecursos(recursos, containerId) {
  const grid = document.getElementById(containerId);
  grid.innerHTML = recursos.map(cat => `
    <div class="recurso-categoria">
      <h3 class="recurso-cat-title">${cat.categoria}</h3>
      <div class="recurso-links">
        ${cat.links.map(link => `
          <a href="${link.url}" target="_blank" rel="noopener" class="recurso-card">
            <span class="recurso-label">${link.label}</span>
            <span class="recurso-desc">${link.desc}</span>
            <span class="recurso-arrow">→</span>
          </a>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function renderCuriosidades(lista) {
  const container = document.getElementById("curiosidades-list");
  container.innerHTML = lista.map((c, i) => `
    <div class="curiosidade-item">
      <span class="curiosidade-num">${String(i + 1).padStart(2, "0")}</span>
      <p class="curiosidade-texto">${c}</p>
    </div>
  `).join("");
}

// Iniciar
renderHub();
