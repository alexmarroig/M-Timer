# MTimer - Admin Panel Specification

## 1. Overview
The **MTimer Admin Panel** is a web-based tool for the internal team to manage, monitor, and scale the application. It acts as the "Brain" of the ecosystem, allowing real-time adjustments without requiring new app builds.

---

## 2. Core Functional Requirements

### 2.1. User Management (Support)
- **Search & Filter:** Find users by Email, ID, or Date Joined.
- **Profile View:** See user level, current XP, streak, and recent meditation logs.
- **Manual Overrides:**
  - **Edit XP/Level:** Manually add/remove XP to resolve issues.
  - **Grant Skins/Sounds:** Give access to premium items as rewards or compensation.
  - **Password Reset:** Trigger password recovery emails manually.

### 2.2. Engagement & Growth (Marketing)
- **Push Notification Engine:**
  - **Broadcast:** Send an announcement to all users.
  - **Segmented:** Send to specific user groups (e.g., "Inactive for 3 days").
  - **Manual Interventions:** Send a personalized "Companion is Sad" message to a single user.
- **Campaign Management:** Tracking new user acquisitions and conversion rates.

### 2.3. Global Configuration (App Settings)
- **Timer Overrides:**
  - Ability to change default durations (e.g., set `rampUp` to 3min globally).
- **Sound Library Management:**
  - Upload new audio files to the CDN.
  - Update the "Featured" or "New" sounds in the app.

### 2.4. Monetization & Analytics
- **Subscription Monitor:** See active monthly/annual subscribers.
- **Churn Tracking:** Monitor users who cancel or stop meditating.
- **Financial Dashboard:** Revenue reporting (once IAP/SaaS is active).

---

## 3. Recommended Tech Stack
For speed, scalability, and ease of use:

- **Frontend:** **Next.js** (App Router) + **Tailwind CSS**.
- **UI Components:** **shadcn/ui** for a clean, professional dashboard.
- **Backend/Auth:** **Supabase** or **Firebase**.
  - Provides a ready-made Auth system, Database, and Storage (for sounds/skins).
  - Built-in "Edge Functions" for push notifications and email triggers.
- **Charts:** **Recharts** or **Tremor** for data visualization.

---

## 4. UI/UX Structure (Wireframe Concept)

### 4.1. Dashboard (Home)
- Real-time stats: Active sessions, Total users, New signups (24h).
- Recent activity feed.

### 4.2. Users Table
- Table with sortable columns: `User`, `Level`, `Streak`, `Status`, `Actions`.

### 4.3. Config Page
- Simple form to update global constants stored in the database.

---

## 5. Security & Access
- **Admin Roles:** Different permissions (e.g., "Support" can edit users, "Admin" can edit global configs).
- **Audit Logs:** Track who changed what (e.g., "Admin X added 50 XP to User Y").
- **Auth:** Mandatory Multi-Factor Authentication (MFA) for all admin accounts.
