# 🔥 Como configurar o Firebase (Login com Google)

## Passo 1 — Criar projeto no Firebase

1. Acesse: https://console.firebase.google.com
2. Clique em **"Adicionar projeto"**
3. Nome: `next-stage` → Continuar
4. Desative o Google Analytics (opcional) → Criar projeto

---

## Passo 2 — Ativar Autenticação com Google

1. No menu lateral, clique em **Authentication**
2. Clique em **"Começar"**
3. Clique em **Google** na lista de provedores
4. Ative o toggle → Informe seu e-mail de suporte → **Salvar**

---

## Passo 3 — Criar banco de dados Firestore

1. No menu lateral, clique em **Firestore Database**
2. Clique em **"Criar banco de dados"**
3. Escolha **Modo de teste** (para desenvolvimento) → Avançar
4. Selecione a região mais próxima → **Ativar**

---

## Passo 4 — Registrar seu app Web

1. Na página inicial do projeto, clique no ícone **`</>`** (Web)
2. Nome do app: `next-stage-web`
3. **Não** marque Firebase Hosting → **Registrar app**
4. Copie o objeto `firebaseConfig` que aparecer

---

## Passo 5 — Colar as credenciais no projeto

Abra o arquivo `js/auth.js` e substitua a seção:

```js
const firebaseConfig = {
  apiKey:            "COLE_SUA_API_KEY",
  authDomain:        "COLE_SEU_AUTH_DOMAIN",
  projectId:         "COLE_SEU_PROJECT_ID",
  storageBucket:     "COLE_SEU_STORAGE_BUCKET",
  messagingSenderId: "COLE_SEU_MESSAGING_SENDER_ID",
  appId:             "COLE_SEU_APP_ID"
};
```

Com os valores reais do seu projeto.

---

## Passo 6 — Autorizar seu domínio

1. No Firebase → Authentication → **Settings** → Domínios autorizados
2. Clique em **"Adicionar domínio"**
3. Adicione: `edilsonledo.github.io`

---

## Passo 7 — Regras do Firestore (segurança)

No Firestore → **Rules**, substitua pelo seguinte:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Isso garante que cada usuário só acessa seus próprios dados.

---

## ✅ Pronto!

Após configurar, o site terá:
- Login/logout com Google no header
- Perfil com foto e nome do usuário
- Botões "Salvar" e "Jogado" no catálogo
- Página `/pages/perfil.html` com listas salvas
