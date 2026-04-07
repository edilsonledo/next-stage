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
  apiKey:            "AIzaSyBs4fZdhJdyazQs6K4k0JiwQn0feIp5fkU",
  authDomain:        "site-next-stage.firebaseapp.com",
  projectId:         "site-next-stage",
  storageBucket:     "site-next-stage.firebasestorage.app",
  messagingSenderId: "859717494179",
  appId:             "1:859717494179:web:6fbc2ecf087b80ee39e616",
  measurementId:     "G-TK4BFKL0GV"
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

// ── Salvar Steam ID (e opcionalmente API Key) do usuário ──
export async function salvarSteamId(uid, steamId, steamApiKey) {
  const dados = { steamId };
  if (steamApiKey) dados.steamApiKey = steamApiKey;
  await updateDoc(doc(db, "usuarios", uid), dados);
}

// ── Exporta instâncias para uso avançado ──
export { auth, db };
