# M-Timer

## Guideline de navegação (Back)

- **Padrão único de retorno:** sempre priorizar o botão nativo de back no header para telas em stack. O texto do botão deve ser **"Voltar"** quando suportado (iOS).
- **Onboarding (`Welcome`, `Experience`, `Schedule`):** header habilitado em todas as etapas, com retorno visual consistente e previsível entre passos.
- **Player (`Sair/Fechar`):** ao tentar sair com sessão ativa, exibir confirmação antes de abandonar a prática. Se a sessão já estiver concluída, fechar diretamente.
- **Botão físico Android:** toda ação de voltar durante sessão ativa no Player deve passar pela mesma confirmação de saída.
- **Gesto iOS (swipe back/dismiss):** manter gesto habilitado e aplicar a mesma regra de confirmação do botão físico para evitar perda acidental da sessão.

## Android: fluxo de testes recomendado

1. Instalar dependências:
   - `npm install`
   - `npm install @react-native-community/slider`

2. Validação local:
   - `npm run test` (unittest)
   - `npx tsc --noEmit` (opcional para tipos)

3. Rodar em dispositivo físico:
   - habilitar USB debugging no Android
   - conectar dispositivo
   - `npx expo run:android`

4. Verificações de QA:
   - Login com `demo@mtimer.app` / `Respira123`.
   - Botão `Entrar como convidado`.
   - Onboarding completa (Welcome->Experience->Schedule).
   - Iniciar sessão, pausar, retomar, concluir.
   - Companion animado na Home e Player e textoferiado no Player.
   - Áudio ambiente com controle:
     - `Configuracoes` > `Som ambiente` ON/OFF.
     - `Silenciar ambiente` ON/OFF.
     - Slider de volume 0-100%.
   - Histórico atualizado com conclusão de sessão.
   - Logout volta para tela de login.

5. Build para distribuição de testes:
   - `eas build --platform android --profile preview`
   - instalar APK gerado em dispositivo.

6. Verificar persistência de preferências:
   - sair do app e reabrir após alterações de ``ambientMuted``+``ambientVolume``.
   - o estado deve ser mantido (via ``useRememberAudioStatus``/AsyncStorage).

