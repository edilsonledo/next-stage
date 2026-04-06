// ── Firebase Auth — Next Stage ──
// Usa Firebase SDK via CDN (sem build tool necessário)
// Configuração: https://console.firebase.google.com

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ──────────────────────────────────────────────
// 🔴 SUBSTITUA com suas credenciais do Firebase
//    https://console.firebase.google.com
// ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "COLE_SUA_API_KEY",
  authDomain:        "COLE_SEU_AUTH_DOMAIN",
  projectId:         "COLE_SEU_PROJECT_ID",
  storageBucket:     "COLE_SEU_STORAGE_BUCKET",
  messagingSenderId: "COLE_SEU_MESSAGING_SENDER_ID",
  appId:             "COLE_SEU_APP_ID"
};
// ──────────────────────────────────────────────

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const db       = getFirestore(app);
const provider = new GoogleAuthProvider();

// ── Login com Google ──
export async function loginGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    await criarPerfilSeNaoExistir(result.user);
    return result.user;
  } catch (e) {
    if (e.code !== "auth/popup-closed-by-user") {
      console.error("Erro no login:", e);
      alert("Erro ao entrar com Google. Tente novamente.");
    }
    return null;
  }
}

// ── Logout ──
export async function logout() {
  await signOut(auth);
}

// ── Observador de estado de autenticação ──
export function onUsuarioMudou(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Cria perfil no Firestore na primeira vez ──
async function criarPerfilSeNaoExistir(user) {
  const ref  = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      nome:        user.displayName,
      email:       user.email,
      foto:        user.photoURL,
      criadoEm:   new Date().toISOString(),
      jogosSalvos: [],
      jogosJogados: [],
    });
  }
}

// ── Busca perfil do usuário ──
export async function getPerfil(uid) {
  const snap = await getDoc(doc(db, "usuarios", uid));
  return snap.exists() ? snap.data() : null;
}

// ── Salvar jogo na lista ──
export async function salvarJogo(uid, jogo) {
  await updateDoc(doc(db, "usuarios", uid), {
    jogosSalvos: arrayUnion(jogo)
  });
}

// ── Remover jogo da lista ──
export async function removerJogo(uid, jogo) {
  // Firestore não suporta arrayRemove por objeto complexo facilmente,
  // então lemos, filtramos e reescrevemos
  const perfil = await getPerfil(uid);
  const novos  = (perfil?.jogosSalvos || []).filter(j => j.appid !== jogo.appid);
  await updateDoc(doc(db, "usuarios", uid), { jogosSalvos: novos });
}

// ── Marcar jogo como jogado ──
export async function marcarJogado(uid, jogo) {
  await updateDoc(doc(db, "usuarios", uid), {
    jogosJogados: arrayUnion(jogo)
  });
}

// ── Exporta instâncias para uso avançado ──
export { auth, db };
