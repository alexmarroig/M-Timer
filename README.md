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

# 🧪 ANDROID TEST FLOW

## Setup

```bash
npm install
npm run test
npx expo run:android