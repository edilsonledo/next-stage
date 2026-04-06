// ── Utilitários compartilhados ──

/**
 * Gera cards skeleton enquanto carrega
 */
export function skeletonCards(n = 8) {
  return Array.from({ length: n }, () => `
    <div class="skeleton-card">
      <div class="skeleton__img"></div>
      <div class="skeleton__line"></div>
      <div class="skeleton__line skeleton__line--short"></div>
    </div>
  `).join("");
}

/**
 * Gera uma tag <img> com lazy-load e fallback
 */
export function imgTag(src, alt) {
  return `<img
    class="card__img loading"
    src="${src}"
    alt="${alt}"
    loading="lazy"
    onload="this.classList.remove('loading')"
    onerror="this.src='https://placehold.co/460x215/2a475e/66c0f4?text=No+Image'"
  >`;
}

/**
 * Abre a página do jogo na Steam
 */
export function abrirSteam(appid) {
  window.open(`https://store.steampowered.com/app/${appid}`, "_blank", "noopener,noreferrer");
}

/**
 * Busca dados da API SteamSpy via proxy
 */
export async function fetchSteamSpy(request) {
  const url = "https://api.allorigins.win/raw?url=" +
    encodeURIComponent(`https://steamspy.com/api.php?request=${request}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha na API");
  return res.json();
}

/**
 * Marca o link ativo no menu com base na URL atual
 */
export function marcarNavAtivo() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__link").forEach(link => {
    const href = link.getAttribute("href").split("/").pop();
    link.classList.toggle("active", href === path);
  });
}

/**
 * Inicializa o menu hamburger para mobile
 */
export function initHamburger() {
  const btn  = document.getElementById("hamburger");
  const menu = document.getElementById("mainNav");
  if (!btn || !menu) return;
  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
}
