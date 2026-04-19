# M-Timer

M-Timer é um companion mobile-first para praticantes de Meditação Transcendental (MT), focado em constância, ritual e acompanhamento de prática — não ensino.

O app estrutura sessões em 3 fases, reforça o hábito com gamificação leve e mantém continuidade entre dispositivos via sync local-first.

---

# 🧠 PRODUCT OVERVIEW

## O que é
Um app de suporte à prática de meditação (não guiada), com foco em:

- iniciar rapidamente sessões
- manter consistência (streak)
- reforço emocional (companion)
- acompanhamento de progresso

## Problema que resolve

Praticantes de MT frequentemente:

- perdem consistência
- não têm estrutura clara para prática
- não acompanham evolução
- não têm ritual digital consistente

O M-Timer resolve isso com:

- timer estruturado
- lembretes
- histórico
- reforço leve (gamificação + companion)

---

# 👥 TARGET USERS

- praticantes de Meditação Transcendental já iniciados
- usuários que querem manter hábito diário (manhã/tarde)
- usuários mobile-first (principalmente Brasil / PT-BR)

---

# 🏗️ ARQUITETURA

## Stack

- React Native (Expo)
- TypeScript
- Zustand (state)
- AsyncStorage (persistência local)
- SecureStore (tokens)
- Supabase (auth + DB + sync)
- Expo APIs (audio, notifications, haptics)

---

## Estrutura de Pastas
src/
core/ → navegação, tema, utilitários base
modules/ → features por domínio (auth, session, etc)
services/ → engines e integrações
store/ → estado global (Zustand)
components/ → componentes reutilizáveis
types/ → contratos de domínio


---

## Módulos principais

- `auth` → login, signup, reset
- `onboarding` → setup inicial
- `session` → timer + player
- `history` → histórico e stats
- `settings` → preferências
- `companion` → camada emocional/visual

---

# ⚙️ SISTEMAS PRINCIPAIS

## 1. Timer Engine

- máquina de estados (rampUp → core → cooldown)
- pausa / resume
- persistência local

## 2. Gamification Engine

- XP por sessão
- streak
- níveis
- progressão

## 3. Companion System

- estado emocional (mood)
- animações (glow, pulse, aura)
- evolução visual

⚠️ atualmente coexistem múltiplas versões (ver seção de gaps)

## 4. Sync Engine (CRÍTICO)

- modelo local-first
- snapshot por escopo:
  - guest
  - user:{id}
- merge local/remoto

---

# 🔄 FLUXOS PRINCIPAIS

## 1. First Use (Guest)

Auth → Guest → Onboarding → Home

## 2. Sessão

Home → Player → Timer → Conclusão → Histórico

## 3. Sync

Login → Merge local + remoto → Persistência

---

# 📱 UX GUIDELINES

## Navegação

- botão "Voltar" padrão (iOS)
- confirmação ao sair do Player ativo
- gesto iOS mantém comportamento seguro
- botão físico Android respeita confirmação

---

# 🧪 TEST & BUILD FLOW

## 1. Local Development (Expo Go)
A maneira mais rápida de testar as mudanças de UI e lógica básica.

```bash
# Instalar dependências
npm install

# Iniciar o servidor Expo
npx expo start
```
*Aponte a câmera do seu celular para o QR Code (requer app **Expo Go** instalado).*

---

## 2. Testing on Physical Devices (EAS Preview)
Para testar áudio em background, vibrações e comportamento real do sistema.

### Android (Gerar APK)
```bash
# Gerar um link para download do APK
eas build --profile preview --platform android
```

### iOS (Simulador)
```bash
# Para rodar no simulador local
npx expo run:ios
```

---

## 3. Production Build
Quando o app estiver pronto para as lojas.

```bash
# Para Android (Play Store)
eas build --profile production --platform android

# Para iOS (App Store)
eas build --profile production --platform ios
```

---

## 4. Troubleshooting
- **Audio no iOS**: Se o áudio parar ao bloquear a tela, verifique se o switch de "Silencioso" do iPhone não está ativado.
- **Sync**: Se os dados não aparecerem, verifique sua conexão com o Supabase nas configurações.

---

# 🛠️ COMING SOON
- [ ] Widgets de Home Screen para acesso rápido à meditação.
- [ ] Integração com Apple Health / Google Fit.
- [ ] Temas dinâmicos baseados no horário do dia.