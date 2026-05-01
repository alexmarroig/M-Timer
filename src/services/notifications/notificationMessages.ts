export type EngagementState = 'active' | 'at_risk' | 'sleeping' | 'lost';

export interface NotificationContext {
  daysSince: number;
  currentStreak: number;
  bestStreak: number;
  totalMinutes: number;
  xpToNextLevel: number;
  nextLevelLabel: string | null;
}

interface NotificationMessage {
  title: string;
  body: string;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getSmartMessage(
  state: EngagementState,
  ctx: NotificationContext
): NotificationMessage {
  const { daysSince, currentStreak, bestStreak, totalMinutes, xpToNextLevel, nextLevelLabel } = ctx;

  if (state === 'at_risk') {
    const messages: NotificationMessage[] = [
      {
        title: 'Hoje ainda conta',
        body: currentStreak > 1
          ? `Você foi consistente por ${currentStreak} dias. Não deixa o ritmo quebrar.`
          : 'Uma sessão hoje já mantém o hábito vivo.',
      },
      {
        title: 'Ainda dá tempo',
        body: 'Faltam algumas horas para o dia fechar. Uma sessão rápida resolve.',
      },
      ...(nextLevelLabel && xpToNextLevel > 0
        ? [{
            title: `${xpToNextLevel} XP para ${nextLevelLabel}`,
            body: 'Uma sessão agora e você chega lá.',
          }]
        : []),
    ];
    return pick(messages);
  }

  if (state === 'sleeping') {
    const messages: NotificationMessage[] = [
      {
        title: `${daysSince} dias sem praticar`,
        body: 'Uma sessão de 5 minutos já reconecta o ritmo.',
      },
      {
        title: 'Seu progresso está esperando',
        body: bestStreak > 0
          ? `Sua melhor sequência foi ${bestStreak} dias. Você chegou lá antes.`
          : `Você acumulou ${totalMinutes} min de prática. Não precisa começar do zero.`,
      },
      {
        title: 'Sem pressão',
        body: 'Qualquer sessão hoje já quebra o ciclo. Até a mais curta.',
      },
    ];
    return pick(messages);
  }

  if (state === 'lost') {
    const messages: NotificationMessage[] = [
      {
        title: `Faz ${daysSince} dias`,
        body: totalMinutes > 0
          ? `Você acumulou ${totalMinutes} minutos de prática. Esse histórico não some.`
          : 'Retomar é mais fácil do que começar do zero.',
      },
      {
        title: 'Seu melhor foi real',
        body: bestStreak > 0
          ? `${bestStreak} dias seguidos — você já provou que consegue manter o ritmo.`
          : 'Cada sessão que você fez antes foi real. É só retomar.',
      },
      {
        title: 'Bônus de retorno ativo',
        body: 'Volte agora e ganhe +20 XP extra pela retomada.',
      },
    ];
    return pick(messages);
  }

  // fallback
  return { title: 'M-Timer', body: 'Sua próxima sessão espera por você.' };
}

export function getEngagementState(hoursSinceLastSession: number): EngagementState {
  if (hoursSinceLastSession < 24) return 'active';
  if (hoursSinceLastSession < 48) return 'at_risk';
  if (hoursSinceLastSession < 120) return 'sleeping';
  return 'lost';
}

export function getNotificationCount(state: EngagementState): number {
  if (state === 'active') return 0;
  if (state === 'at_risk') return 1;
  if (state === 'sleeping') return 2;
  return 3;
}

// Spread notifications through the day
export function getNotificationHours(count: number): number[] {
  if (count === 1) return [18];
  if (count === 2) return [9, 19];
  return [8, 14, 20];
}
