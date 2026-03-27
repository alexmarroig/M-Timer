# M-Timer

## Guideline de navegação (Back)

- **Padrão único de retorno:** sempre priorizar o botão nativo de back no header para telas em stack. O texto do botão deve ser **"Voltar"** quando suportado (iOS).
- **Onboarding (`Welcome`, `Experience`, `Schedule`):** header habilitado em todas as etapas, com retorno visual consistente e previsível entre passos.
- **Player (`Sair/Fechar`):** ao tentar sair com sessão ativa, exibir confirmação antes de abandonar a prática. Se a sessão já estiver concluída, fechar diretamente.
- **Botão físico Android:** toda ação de voltar durante sessão ativa no Player deve passar pela mesma confirmação de saída.
- **Gesto iOS (swipe back/dismiss):** manter gesto habilitado e aplicar a mesma regra de confirmação do botão físico para evitar perda acidental da sessão.
