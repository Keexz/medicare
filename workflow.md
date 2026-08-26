# workflow.md — MediCare Clinic App

Complete documentation of tools, execution steps, architecture, code explanation, and
the confirmed constraint interview for the MediCare Clinic demo app.

**Status: implementation complete — TypeScript and ESLint pass clean (2026‑08‑23).**

---

## 1. Tools Downloaded / Installed

| Tool | Version | Purpose | Exact command |
|------|---------|---------|---------------|
| Node.js | v24.15.0 | JS runtime (pre-existing) | — |
| npm | 11.12.1 | Package manager (pre-existing) | — |
| Expo SDK 57 template | RN 0.86.2 / React 19.2.3 | Project scaffold (pre-existing; retained per constraint #1) | created before session |
| TypeScript | ~6.0.3 | Language + typecheck (pre-configured in scaffold) | `npx tsc --noEmit` to verify |
| @react-native-async-storage/async-storage | SDK-57 compatible | Appointment persistence across restarts | `npx expo install @react-native-async-storage/async-storage` |
| @expo/vector-icons (Ionicons) | SDK-57 compatible | All icons (tabs, buttons, empty states) | `npx expo install @expo/vector-icons` |
| eslint + eslint-config-expo | 9.39.5 / ~57.0.1 | Linting (auto-configured by Expo CLI) | `npx expo lint` (first run installs & configures) |

No global tool installations were performed; everything is project-local.

## 2. Execution Process

1. **Workspace audit** — inspected `package.json` and the `src/` tree; found a clean
   Expo SDK 57 + TS + Expo Router template containing only boilerplate.
2. **Deterministic Constraint interview** — three structured question rounds
   (full Q&A in section 4). Zero open decision points before coding began.
3. **AGENTS.md refinement** — speculative Tech Stack section replaced with the
   confirmed stack; signed-off constraint table added; screenshots deliverable
   redefined as "agent documents shot list, user captures".
4. **Incremental implementation** (each increment explicitly approved):
   - Increment 1: documentation + AGENTS.md update ✅
   - Increment 2: async-storage install → theme tokens → types → clinic.json → dates utils → AppointmentsContext ✅
   - Increment 3: delete boilerplate → root layout → tabs → Welcome → Home (+ Fab, CallButton) ✅
   - Increment 4: DoctorAvatar → Doctors tab list → doctor detail `[id]` route ✅
   - Increment 5: StepDots → booking modal (3 steps) → success screen ✅
   - Increment 6: My Appointments (cancel flow) → Contact/Emergency ✅
   - Increment 7: this document + shot list ✅
5. **Verification gates run after every increment:** `npx tsc --noEmit`.
   Final gate: `npx tsc --noEmit && npx eslint src` → both clean.
6. **Typed-routes regeneration:** `.expo/types/router.d.ts` is written by Metro at
   dev-server startup; a brief `npx expo start` refreshed it after routes changed,
   which cleared all remaining "not assignable to RelativePathString…" errors.

## 3. Code Explanation & Architecture Decisions

### 3.1 Directory map

```
src/
├── app/
│   ├── _layout.tsx            # Root Stack + AppointmentsProvider (whole tree)
│   ├── index.tsx              # /          Welcome ("Get Started" → replace '/home')
│   ├── booking.tsx            # /booking   3-step modal flow
│   ├── booking-success.tsx    # /booking-success  confirmation summary
│   ├── doctors/[id].tsx       # /doctors/:id  profile detail
│   └── (tabs)/
│       ├── _layout.tsx        # Bottom tabs: Home · Doctors · Appointments · Contact
│       ├── home.tsx           # Next-appointment card, emergency card, services, FAB
│       ├── doctors.tsx        # Doctor cards → detail
│       ├── appointments.tsx   # Grouped list + cancel
│       └── contact.tsx        # Clinic info + emergency call
├── components/
│   ├── call-button.tsx        # Reusable tel: dialer button (solid / danger variants)
│   ├── doctor-avatar.tsx      # Teal initials circle (constraint #13)
│   ├── fab.tsx                # Extended FAB → /booking
│   └── step-dots.tsx          # Booking progress indicator
├── constants/theme.ts         # Design tokens: Colors/Spacing/Radius/FontSize/shadows
├── context/AppointmentsContext.tsx
│                              # Single store: state + AsyncStorage sync + data exports
├── data/clinic.json           # Single source of truth (clinic, 4 doctors, 6 services,
│                              #   2 sample appointments with inDays offsets)
├── types.ts                   # Shared domain models
└── utils/dates.ts             # Slot/window generation + locale-stable formatters
```

### 3.2 Key architecture decisions and why

| Decision | Rationale |
|----------|-----------|
| **Expo Router kept as entry** (`package.json` main field) | Pre-installed by scaffold; file-based routing gives typed `router.push()` links and nested `(tabs)` groups for free |
| **Route groups**: welcome outside tabs, features inside `(tabs)` | Welcome shows once without a tab bar; `/home` `/doctors` `/appointments` `/contact` live inside the tab navigator. No path conflict because `(tabs)` adds no URL segment |
| **Booking + success as stack screens above tabs** | Modal presentation for booking keeps tab context; `router.replace('/booking-success')` prevents Back from re-entering the form; success replaces again on exit so history stays clean |
| **React Context over Zustand** | One domain collection (appointments); provider mounted once in root `_layout`, zero extra dependencies |
| **AsyncStorage two-phase hydration** | `hydratedRef` guards the persist effect so an empty pre-hydration array can never wipe stored data; `cancelled` flag protects against setState-after-unmount |
| **Sample appointments use `inDays` offsets** | JSON stays static but materialised dates are always near "today"; `toNextWeekday` bumps weekend landings to Monday so samples respect clinic days (constraint #9) |
| **Locale-independent date strings** (`yyyy-mm-dd`, manual weekday/month tables) | Avoids device-language drift in the demo; formatters in one place (`utils/dates.ts`) |
| **Slot rules centralised** (`BOOKING_TIMES`, `BOOKING_WINDOW_DAYS`, `isSlotPast`) | Mon–Fri × hourly 09:00–16:00 × 14 days enforced exactly once; today's already-passed hours are disabled dynamically |
| **Initials avatars** | No binary assets to license or load; crisp at any size; `getDoctorInitials("Dr. Sarah Chen") → "SC"` |
| **Real dialer via `Linking.openURL('tel:…')`** | More convincing client demo than a mock Alert; failure swallowed silently where no dialer exists (web preview) |

### 3.3 Data flow

```
clinic.json ──import──▶ AppointmentsContext ──▶ screens (read)
                          │  ▲
              addAppointment() cancelAppointment()
                          │  │
AsyncStorage ◀──serialize──┘  └──hydrate on first mount──▶ (seeds samples if empty)
```

- `addAppointment` stamps `id = apt-${Date.now()}` and `status: 'Confirmed'`.
- `cancelAppointment(id)` flips status only — records are never deleted, so the
  Cancelled group remains visible.
- Home's "next appointment" = first `Confirmed && isUpcoming` item.

### 3.4 Notable per-file behaviour

- **`app/(tabs)/home.tsx`** — negative margin pulls the next-appointment card over
  the teal header band; FAB bottom padding accounts for tab-bar height.
- **`app/doctors/[id].tsx`** — unknown id renders a graceful "Doctor not found"
  fallback with a back link instead of crashing.
- **`app/booking.tsx`** — accepts optional `doctorId` param (deep-linked from a
  doctor profile); picking a new date clears a selected time if that slot has
  passed; Continue disabled until each step's requirement is met.
- **`app/(tabs)/appointments.tsx`** — three derived groups via one sort helper;
  Cancel uses `Alert.alert` destructive confirm; cancelled rows dimmed at 65% opacity.
- **`theme.ts`** — every screen imports tokens only; no hardcoded hex outside theme.

## 4. Confirmed Constraints (Interview Q&A)

**Environment discovered during audit:** Windows PC, Node v24.15.0, npm 11.12.1,
existing Expo SDK 57 + TS + Expo Router scaffold (boilerplate only).

### Round 1 — Structural
| Question | Answer |
|----------|--------|
| Existing scaffold: build on it or recreate? | **Build on existing** (keep SDK 57 + TS + Router, delete boilerplate only) |
| Navigation library? | **Keep Expo Router** (already entry point) |
| State management? | **React Context** |
| Styling? | **Built-in StyleSheet** |
| Do appointments survive restart? | **Yes — AsyncStorage persistence** |

### Round 2 — Behaviour & Design
| Question | Answer |
|----------|--------|
| Colour palette? | **Teal `#0D9488`**, light background, dark text |
| Welcome screen form? | **"Get Started" button only — no login** |
| Booking slot constraints? | **Mon–Fri, hourly 09:00–16:00, next 14 days** |
| Patient name input? | **Prefilled "Demo Patient", editable** |
| Cancel appointments? | **Yes — confirmation dialog, status becomes "Cancelled"** |

### Round 3 — Final Details
| Question | Answer |
|----------|--------|
| Test target? | **Physical phone via Expo Go QR code** |
| Doctor photos? | **Initials avatars on teal circles (no image assets)** |
| Emergency/call buttons? | **Real dialer via `tel:` links (expo-linking)** |
| Mock data volume? | **4 doctors / 6 services / 2 sample appointments** |
| Screenshots deliverable? | **User captures on device; agent documents shot list** |

Sign-off obtained: 2026‑08‑23.

## 5. Documentation Sources Consulted

- `npx expo --help` (local CLI help) — confirmed no standalone typegen command;
  typed-route definitions regenerate at Metro startup.
- `expo/bundledNativeModules.json` (local) — used by `npx expo install` for
  SDK-compatible versions while network access was unavailable.
- No external websites were fetched; internal knowledge sufficed for React Context,
  AsyncStorage, and Expo Router APIs. If issues arise when you run the app, consult:
  - https://docs.expo.dev/router/introduction/
  - https://docs.expo.dev/versions/latest/sdk/async-storage/

## 6. Running the App on Your Phone (Expo Go)

1. Install **Expo Go** from the Play Store (Android) or App Store (iOS).
2. Connect phone and PC to the same Wi-Fi network.
3. In this folder run:
   ```
   npm run start
   ```
4. Scan the QR code:
   - Android → scan from inside Expo Go.
   - iOS → scan with the Camera app; it opens Expo Go automatically.
5. First launch lands on **Welcome → Get Started**.
6. Same-network issues? Use tunnel mode instead: `npx expo start --tunnel`.

**Reset demo data:** close the app in Expo Go, then long-press the project entry →
clear app data (or reinstall Expo Go). Storage key: `medicare.appointments.v1`.

**Verification commands** (already passing):
```
npx tsc --noEmit     # typecheck
npm run lint         # eslint
```

## 7. Screenshot Shot List (you capture these)

Recommended: capture portrait on your phone; repeat key shots on a second device /
small-screen setting if available (iPhone SE-class vs Pixel-class).

| # | Shot | Screen / State |
|---|------|----------------|
| 1 | Welcome | Initial launch — logo, tagline, Get Started |
| 2 | Home top | Header + NEXT APPOINTMENT card overlapping header |
| 3 | Home scrolled | Emergency card + Our Services list + FAB visible |
| 4 | Doctors tab | All 4 doctor cards with initials avatars |
| 5 | Doctor detail | Hero avatar + stats row + bio + Book CTA |
| 6 | Booking step 1 | Doctor radio list, one selected (teal border) |
| 7 | Booking step 2a | Date chips strip — note weekend chips greyed "Closed" |
| 8 | Booking step 2b | Time grid open slots; today's past hours disabled |
| 9 | Booking step 3 | Name input prefilled "Demo Patient" + review card |
| 10 | Success | Check circle + appointment summary card |
| 11 | My Appointments | Upcoming section with Cancel button visible |
| 12 | Cancel dialog | System alert "Cancel appointment" with destructive action |
| 13 | After cancel | List showing item under "Cancelled" group, dimmed |
| 14 | Empty state | Only achievable after clearing storage — no appointments yet |
| 15 | Contact tab | Clinic card + Call button + Emergency card |
| 16 | Dialer intent | OS phone app opened with +1 (555) 123-4567 prefilled |

Tip: shots 11→12→13 make a great story sequence for the demo walkthrough.
