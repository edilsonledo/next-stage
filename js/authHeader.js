import { loginGoogle, logout, onUsuarioMudou } from "./auth.js";

// ── Atualiza o header com foto/nome do usuário logado ──
export function initAuthHeader() {
  const area = document.getElementById("auth-area");
  if (!area) return;

  onUsuarioMudou(user => {
    if (user) {
      area.innerHTML = `
        <a href="/pages/perfil.html" class="auth-user" id="auth-user-btn" title="Ver perfil">
          <img src="${user.photoURL}" alt="${user.displayName}" class="auth-avatar">
          <span class="auth-nome">${user.displayName.split(" ")[0]}</span>
        </a>
        <button class="auth-btn auth-btn--out" id="btn-logout" title="Sair">↩</button>
      `;

      // Ajusta href relativo dependendo da profundidade da página
      const isSubpage = window.location.pathname.includes("/pages/");
      const perfilHref = isSubpage ? "perfil.html" : "pages/perfil.html";
      area.querySelector("#auth-user-btn").setAttribute("href", perfilHref);

      document.getElementById("btn-logout").addEventListener("click", async () => {
        await logout();
      });
    } else {
      area.innerHTML = `
        <button class="auth-btn" id="btn-login">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18">
          Entrar com Google
        </button>
      `;
      document.getElementById("btn-login").addEventListener("click", loginGoogle);
    }
  });
}

// ── Retorna o usuário atual (Promise) ──
export function getUsuarioAtual() {
  return import("./auth.js").then(({ auth }) => {
    return new Promise(resolve => {
      const { onAuthStateChanged } = auth;
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
        .then(({ onAuthStateChanged }) => onAuthStateChanged(auth, resolve));
    });
  });
}

// Re-exporta para conveniência
export { loginGoogle, logout, onUsuarioMudou };
