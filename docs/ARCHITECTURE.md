# MTimer - Enterprise Architecture Document

## 1. Vision & Core Principles
MTimer is built as a high-performance, modular React Native application using Expo. The architecture prioritizes **predictability**, **maintainability**, and **precision**, essential for a meditation app where timing and user experience are paramount.

### Core Principles:
- **Modular Monolith:** Logic is grouped by feature (modules) to facilitate scaling and isolation.
- **Unidirectional Data Flow:** Using Zustand for predictable state management.
- **Precision Timing:** Deterministic timer engine based on system timestamps rather than simple intervals.
- **Offline-First:** All core features (meditation, local history) work without an active internet connection.

---

## 2. Directory Structure
The project follows a modular structure located in `src/`:

- **`src/modules/`**: Feature-based modules (Auth, Session, Companion, History, Settings). Each contains its own screens and components.
- **`src/core/`**: App-wide configurations (Theme, Navigation, Global Utils).
- **`src/services/`**: Business logic engines (Audio, Timer, Gamification, Storage, Notifications).
- **`src/store/`**: Centralized Zustand stores.
- **`src/types/`**: Global TypeScript definitions.

---

## 3. State Management (Zustand)
We use Zustand for its simplicity and performance. Stores are persisted using `AsyncStorage`.

- **`authStore`**: Handles session tokens and user authentication state.
- **`userStore`**: Manages user profile, onboarding status, and preferences.
- **`sessionStore`**: Stores meditation templates (presets) and current session configuration.
- **`companionStore`**: Tracks XP, levels, and companion mood/evolution state.
- **`historyStore`**: Manages the local database of completed meditation sessions.

---

## 4. Timer Engine & Precision
The `timerEngine` (`src/services/timerEngine`) is the heart of the app.

### Precision Mechanism:
To avoid drift caused by JavaScript's single-threaded nature or background throttling:
1. **Timestamp-based Calculation:** We store the `startTimestamp` when a phase begins.
2. **Dynamic Elapsed Time:** The UI calculates `Date.now() - startTimestamp` on every tick (or frame) to ensure accuracy even if the app was suspended.
3. **Background Persistence:** If the app goes to background, the elapsed time is recalculated upon resume. For long sessions, local notifications are scheduled to trigger the end of phases.

### Phase Logic:
The MT flow is strictly divided into:
- **Ramp Up (2 min):** Preparation phase.
- **Core (Variable):** The main meditation period.
- **Cooldown (3 min):** Integration phase.

---

## 5. Offline-First & Sync Strategy
### Current State:
- Data is persisted locally via `AsyncStorage`.
- All meditation logic is local.

### Planned Enterprise Sync:
1. **Local-First Writes:** Always write to the local store first.
2. **Background Sync:** A sync service will detect internet availability and push local changes (History, XP) to the backend.
3. **Conflict Resolution:** Last-write-wins based on timestamps for simple settings; additive for history logs.

---

## 6. Security
- **Sensitive Data:** Authentication tokens are (or should be) stored in `Expo SecureStore`.
- **API Communication:** All external calls (planned for Admin Panel/Sync) use HTTPS with JWT Bearer tokens.
- **Data Privacy:** User meditation logs are private and encrypted at rest on the server.

---

## 7. Integration with Admin Panel
The Admin Panel (Spec in `ADMIN_PANEL_SPEC.md`) interacts with this architecture via:
- **Configuration API:** Overrides default timer settings (`rampUp`, `cooldown`) which the app fetches on boot.
- **Engagement API:** Triggers push notifications for "Interventions" when the Companion is neglected.
- **Support API:** Allows admins to manually adjust user XP or unlock skins in the `companionStore`.

---

## 8. Tech Stack Summary
- **Framework:** Expo (React Native)
- **Language:** TypeScript
- **State:** Zustand + Persistence
- **Navigation:** React Navigation (Native Stacks + Tabs)
- **Styling:** Object-based theme system (`src/core/theme`)
- **Animations:** React Native Reanimated (for the Companion)
