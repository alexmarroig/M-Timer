# Mapeamento de Funcionalidades - MTimer

Este documento detalha todas as telas, funcionalidades e regras de negócio do MTimer para fins de verificação e preparação para produção.

---

## 1. Fluxo de Autenticação e Onboarding

### 1.1. Tela de Login (`LoginScreen.tsx`)
- **Visual:** Fundo escuro, logo centralizada, campo de email e senha.
- **Funcionalidades:**
  - Login com Email/Senha (Simulado/Demo).
  - Botão "Continuar como Convidado".
- **ASCII Art:**
  ```
  [       LOGO       ]
  [  Email: ________ ]
  [  Senha: ________ ]
  [      ENTRAR      ]
  [ Entrar como Convidado ]
  ```

### 1.2. Onboarding: Boas-vindas (`WelcomeScreen.tsx`)
- **Texto:** "Bem-vindo ao M-Timer. Seu companheiro silencioso para a prática da Meditação Transcendental."
- **Botão:** "Começar Jornada".

### 1.3. Onboarding: Experiência (`ExperienceScreen.tsx`)
- **Pergunta:** "Qual seu nível de experiência com MT?"
- **Opções:** Iniciante, Regular, Experiente.
- **Impacto:** Personaliza as recomendações na Home.

### 1.4. Onboarding: Horários (`ScheduleScreen.tsx`)
- **Pergunta:** "Quando você costuma meditar?"
- **Funcionalidade:** Define horários preferenciais para lembretes (Manhã e Tarde).
- **Ação Final:** Salva preferências e marca onboarding como concluído.

---

## 2. Telas Principais (Tabs)

### 2.1. Home - Sessão (`HomeScreen.tsx`)
- **Visual:** Greeting personalizado ("Bom dia, [Nome]"), Companion animado no centro, cards de presets de tempo abaixo.
- **Componentes:**
  - **Companion:** Mostra nível, nome do tier (ex: "Beginner") e barra de progresso de XP.
  - **Presets:** 5 min (Rápida), 10 min (Foco), 20 min (Padrão MT).
- **Lógica:** O Companion reflete o "humor" baseado no streak (sequência) e sessões do dia.

### 2.2. Player - Meditação (`PlayerScreen.tsx`)
- **Fases da Sessão:**
  1. **Entrada (Ramp Up):** 2 min. Preparação.
  2. **Meditação (Core):** Tempo selecionado (ex: 20 min). Prática principal.
  3. **Saída (Cooldown):** 3 min. Retorno gradual.
- **Funcionalidades:**
  - Timer regressivo (opcional).
  - Companion centralizado com animações que seguem as fases.
  - Sons de transição (Sino, Vibrar).
  - Som ambiente (Chuva, Vento, Ambiente).
  - Botão de Pausa/Resumo.
  - Botão "Finalizar agora" (pula para o cooldown).

### 2.3. Histórico (`HistoryScreen.tsx`)
- **Visual:** Calendário de frequência, cards de estatísticas (Streak, Total de minutos, Sessões completas).
- **Lista:** Histórico detalhado de cada sessão realizada.

### 2.4. Configurações (`SettingsScreen.tsx`)
- **Sessão:** Mostrar tempo, som de transição, nível de experiência.
- **Áudio:** Habilitar som ambiente, escolher trilha, volume e mute.
- **Lembretes:** Configuração de notificações para manhã e tarde.
- **Conta:** Logout e informações da conta.

---

## 3. Regras de Negócio e Gamificação

### 3.1. Cálculo de XP (`gamificationEngine.ts`)
- **Base:** 10 XP por sessão completada.
- **Multiplicador de Streak:** Aumenta conforme a sequência de dias (max 1.5x).
- **Bônus:** +5 XP se for a segunda sessão do mesmo dia.
- **Tiers de Evolução:**
  1. **Beginner:** 0 XP
  2. **Stabilizing:** 50 XP
  3. **Deepening:** 125 XP
  4. **Consistent:** 250 XP
  5. **Integrated:** 400 XP

### 3.2. Evolução Visual do Companion
- **Nível 4 (Consistent):** Ganha uma borda dourada (`goldenRim`).
- **Nível 5 (Integrated):** Ganha uma auréola (`halo`).
- **Animações (useCompanionAnimations.ts):**
  - **RampUp:** Flutuação média, brilho médio.
  - **Core:** Flutuação lenta, brilho sutil (foco).
  - **Cooldown:** Flutuação rápida, brilho intenso.
  - **Finished:** Pulo de celebração (Bounce).
  - **Paused:** Inclinação (Tilt) e brilho reduzido.

---

## 4. Estado da Produção (Checklist)
- [x] Login Funcional (Demo).
- [x] Onboarding Completo.
- [x] Presets de Sessão.
- [x] Player com 3 fases.
- [x] Som Ambiente e Transição.
- [x] Estatísticas e Calendário.
- [x] Configurações de Notificação.
- [ ] Melhorias visuais para tiers intermediários (2, 3).
- [ ] Verificação de botões e links externos.

---

## 5. Análises de Animação e Companion

O app utiliza dois sistemas complementares para o Companion:

### 5.1. Companion Character (Vetor/Expressivo)
- **Onde é usado:** Topo da Home e centro do Player.
- **Componentes:** `CompanionCharacter.tsx`, `CompanionFace.tsx`.
- **Animações (Lógica em `useCompanionAnimations.ts`):**
  - **Float (Flutuação):** Movimento vertical contínuo.
  - **Breathe (Respiração):** Pulsação de escala.
  - **Glow (Brilho):** Variação de opacidade da camada de luz.
  - **Bounce (Pulo):** Gatilho de celebração ao finalizar sessão ou ao tocar no personagem.
  - **Tilt (Inclinação):** Aplicado quando a sessão está pausada.
- **Expressões Faciais:**
  - **RampUp:** Olhos semicerrados, boca ondulada (~).
  - **Core:** Olhos fechados, boca sorridente (‿).
  - **Cooldown:** Olho semicerrado e ponto, boca (◡).
  - **Finished:** Olhos de estrela, boca aberta (▽).
  - **Moods (Idle):** Sleepy, Content, Happy, Ecstatic (variam olhos e boca).

### 5.2. Companion Orb (Visual/Atmosférico)
- **Onde é usado:** Card na Home e centro do Player (sobreposto).
- **Componentes:** `Companion.tsx`, `companionEngine.ts`.
- **Diferencial:** Pode renderizar imagem estática ou vídeo (`companion.mp4`).
- **Animações:**
  - **Glow Color:** Muda de cor conforme a fase (RampUp: Verde/Amarelo, Core: Dourado, Cooldown: Azul/Roxo).
  - **Sparkles:** Partículas que orbitam o Companion.
  - **Ground Shadow:** Sombra que acompanha a flutuação.
  - **Evolução:** Tiers maiores aumentam o brilho, tamanho e a duração dos ciclos de animação.

### 5.3. Triggers de Gamificação
- **Streak:** Afeta o "Humor" (Mood) do Companion.
- **XP/Nível:**
  - **Nível 4 (Luz):** Borda dourada no corpo do personagem.
  - **Nível 5 (Transcendência):** Auréola (Halo) acima da cabeça.

---

## 6. Melhorias Implementadas nas Camadas de Evolução

As seguintes melhorias visuais foram aplicadas ao `CompanionCharacter.tsx` para tornar a progressão mais gratificante:

- **Nível 2 (Broto):**
  - O corpo do Companion recebe uma tonalidade levemente mais brilhante (`#FFF9ED`).
  - Adição de uma borda interna suave (`innerGlow`) e um contorno sutil de 1px.
- **Nível 3 (Flor):**
  - Adição de partículas luminosas (`particles`) que orbitam o corpo do Companion.
  - Aumento da intensidade do brilho externo (`glow layer`) em 20%.
- **Nível 4 (Luz):**
  - Borda dourada (`goldenRim`) mais espessa e com opacidade ajustada para melhor destaque.
- **Nível 5 (Transcendência):**
  - A auréola (`halo`) agora possui um preenchimento interno suave e borda definida, criando um efeito de profundidade.
- **UI de Nível:**
  - O nome do nível agora é exibido em caixa alta com peso de fonte maior.
  - A barra de progresso de XP foi levemente aumentada para melhor visibilidade.

---

## 7. Status de Prontidão para Produção (Revisão Final)

Após a revisão técnica do código, o estado atual das telas é:

- **Autenticação:** Sistema de login demo e convidado 100% funcional. Credenciais claras na tela para facilitar o teste do usuário.
- **Onboarding:** Fluxo de 3 etapas (Welcome -> Experience -> Schedule) integrado. Configura lembretes reais via `notificationService` e ajusta os presets de tempo com base no nível de experiência escolhido.
- **Home:** Exibe greeting dinâmico, progresso do Companion em dois formatos (Vetor e Orb) e presets de sessão.
- **Player:** Motor de cronômetro (`timerEngine`) robusto com suporte a pausa, resumo e finalização antecipada. Feedback visual por fase e integração com áudio ambiente e de transição.
- **Histórico:** Calendário de frequência e lista de sessões funcional, persistido via `AsyncStorage`.
- **Configurações:** Controle total sobre áudio, visual (mostrar timer) e lembretes.
- **Navegação:** Proteção contra fechamento acidental durante a sessão (Alerta de confirmação).

### Itens Confirmados:
- [x] Sem textos de placeholder "Lorem Ipsum".
- [x] Sem botões mortos (todos os TouchableOpacity possuem handlers).
- [x] Sem `console.log` ou logs de debug no código de produção.
- [x] Temas e cores consistentes usando a paleta definida em `src/core/theme`.
