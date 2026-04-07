# MTimer - Companion System V2 (Behavioral & Emotional)

## 1. Overview
The **Companion V2** moves from a purely visual evolution system to a **dynamic, behavioral relationship**. The Companion is no longer just a "pet," but an emotional mirror of the user's consistency in Transcendental Meditation.

---

## 2. Inactivity Triggers (The "Sad" State)

Based on industry standards for gamified habit formation (e.g., Duolingo, Tamagotchi):

### 2.1. The 48-Hour Threshold
- **48h Inactivity:** The Companion transitions from "Happy" to "Sleepy" or "Looking for attention."
- **72h Inactivity:** The Companion enters the **"Sad" State**.
  - **Visual Change:** Desaturated colors, lowered posture, "tearful" or "droopy" eyes.
  - **Ambient:** Brighter glows are dimmed.

### 2.2. Progressive Decay (Loss of Progress)
To maintain motivation, inactvity should have a cost:
- **Daily Decay (after 72h):** Lose **-5 XP per day**.
- **Level Drop:** If XP drops below the current level's threshold, the Companion **de-evolves** (e.g., loses the "Halo" or "Golden Rim").
- **Streak Break:** Missing a single day resets the streak (already in V1).

---

## 3. Intervention Notifications

The Companion will "ask for attention" via push notifications when its state degrades:

1. **At 48h:** "Estou começando a sentir sono... Vamos meditar um pouco?" (Gentle Nudge).
2. **At 72h:** "Me sinto um pouco triste hoje. Sinto falta da nossa prática." (Emotional Appeal).
3. **At 5 days:** "Onde você está? Minha luz está enfraquecendo..." (Urgency).

---

## 4. The "Recovery" Loop (Dopamine Trigger)

When a user meditates after a "Sad" state:
- **Burst of XP:** First session after inactivity gives **+20 XP** (instead of 10) to jumpstart recovery.
- **Visual Burst:** A "Celebration" animation (Bounce + Sparkles) occurs immediately upon finishing.
- **Mood Reset:** Instant return to "Happy" or "Content" state.

---

## 5. Technical Implementation (Logic)

### 5.1. The `companionStore` Extension:
```typescript
interface CompanionStateV2 {
  lastMeditationTimestamp: string; // ISO String
  mood: 'happy' | 'sleepy' | 'sad' | 'neglected';
  xp: number;
  level: number;
}
```

### 5.2. The Decay Service (`companionEngine.ts`):
- Runs on app boot and once per day.
- Calculates `hoursSinceLastMeditation`.
- Updates the store with the new mood and decayed XP.

---

## 6. Future Interaction (Intervention)
- **Touch Reactivity:** Tapping the Companion when sad might trigger a specific dialogue or a "sigh" animation to reinforce the emotional connection.
- **Custom Names:** Allow users to name their Companion to increase personal attachment.
