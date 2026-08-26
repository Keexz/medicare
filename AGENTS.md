# AGENTS.md — Project: MediCare Clinic (Demo 2)

## Mission
Build a **cross‑platform mobile app** for a fictional small clinic called **MediCare Clinic**. This demo will showcase your ability to create a clean, user‑friendly mobile experience that solves a real business problem: booking appointments from a phone. The app must feel authentic and ready for a client to download and test.

## Core Objectives
- Deliver a working mobile app for iOS and Android using React Native (Expo recommended for easy demo).
- Include a simple, intuitive appointment booking flow that works end‑to‑end (user selects doctor, date/time, confirms; appointment appears in “My Appointments”).
- Use a **JSON file** as the single source of truth for mock data (doctors, appointments, services). No external database or backend required.
- Provide a polished UI that works perfectly on both small and large phone screens.
- Include a floating “Call Clinic” button or similar quick‑contact action on key screens.

## Tech Stack (CONFIRMED — interview sign-off 2026‑08‑23)
- **Framework:** React Native 0.86 + Expo SDK 57 (managed workflow) — existing scaffold retained.
- **Language:** TypeScript (~6.0.3, already configured).
- **Navigation:** Expo Router (file-based; pre-installed as app entry point).
- **State management:** React Context (`AppointmentsProvider`).
- **Styling:** Built-in `StyleSheet`; design tokens centralized in `src/constants/theme.ts`.
- **Data storage:** `src/data/clinic.json` as single source of truth for mock data; booked appointments persisted via `@react-native-async-storage/async-storage`.
- **No backend:** everything runs locally on the device.
- **Deployment:** Not required; run via Expo Go on a physical Android/iOS phone.

## Confirmed Constraints (Deterministic Constraint Gathering — signed off 2026‑08‑23)
| # | Decision | Confirmed Value |
|---|----------|-----------------|
| 1 | Scaffold | Build on existing Expo SDK 57 template; delete boilerplate only |
| 2 | Language | TypeScript (RN 0.86, React 19) |
| 3 | Navigation | Expo Router (file-based) |
| 4 | State | React Context (`AppointmentsProvider`) |
| 5 | Styling | Built-in `StyleSheet` |
| 6 | Persistence | `@react-native-async-storage/async-storage` |
| 7 | Palette | Teal primary `#0D9488`, light background, dark text |
| 8 | Welcome | "Get Started" only — no login/auth screens |
| 9 | Booking slots | Mon–Fri only, hourly 09:00–16:00, selectable within next 14 days |
| 10 | Patient name | Input prefilled "Demo Patient", editable per booking |
| 11 | Cancellation | Cancel button on upcoming appointments → status becomes "Cancelled" |
| 12 | Test target | Physical phone via Expo Go QR code |
| 13 | Doctor photos | Initials avatars on teal circles (no image assets) |
| 14 | Call buttons | Real dialer via `tel:` links (expo-linking) |
| 15 | Mock data | 4 doctors / 6 services / 2 sample appointments in `clinic.json` |
| 16 | Screenshots | User captures on device; agent documents the shot list |

## Required Screens & Features
1. **Onboarding / Welcome** – Simple login or “Get Started” screen with clinic name and tagline.
2. **Home** – Overview of services, quick appointment button, emergency contact card.
3. **Doctors List** – Cards showing doctor name, specialty, photo placeholder. Tap to view details.
4. **Appointment Booking** – Multi‑step flow: select doctor → pick date and time → enter patient name (or use demo name) → confirm. After confirmation, save appointment locally and show success screen.
5. **My Appointments** – List of booked appointments (pulled from local state/JSON) with date, doctor, and status.
6. **Contact / Emergency** – Clinic phone number, address, and an emergency call button (mock).

**Common Features:**
- Bottom tab navigation (Home, Appointments, Contact) or a simple stack with a drawer if preferred.
- Mobile‑first design; test on iPhone SE and Pixel 5 sizes.
- Accessibility basics: touchable areas, readable fonts, proper contrast.
- Floating action button (FAB) for “Book Appointment” on the Home screen.

## Design Guidelines
- The overall feel should be **clean, calming, and professional** – appropriate for healthcare.
- Use a light background with a trustworthy accent colour (e.g., teal `#0D9488`, soft blue `#3B82F6`, or medical green `#10B981`). Confirm palette with user.
- Typography: use a modern sans‑serif system font (e.g., default iOS/Android font or Inter if custom). Avoid heavy decorative fonts.
- Ensure all touch targets are at least 44×44px.
- Use soft shadows and rounded corners for cards (minimal elevation).

## Important Instructions for the Agent (Must Follow SKILL.md)
1. **Begin with the Interview Phase**:
   - Use **Deterministic Constraint Gathering** to confirm every critical decision before writing any code.
   - Ask the user to explicitly confirm: Expo vs bare React Native, JavaScript vs TypeScript, navigation library, state management approach, styling method, colour palette, and exact appointment flow details (e.g., does user need to login? Is date/time selection constrained to clinic hours?).
   - Do not assume; if the user is unsure, present options with trade‑offs and wait for selection.
   - Record all confirmed decisions in this `AGENTS.md` (or a separate `constraints.md`) and obtain user sign‑off.

2. **After Approval, Proceed with Implementation**:
   - Follow pair‑programming guidelines: explain each step, show code snippets, and wait for explicit approval before running commands or modifying files.
   - Work in small, reviewable increments.

3. **Mandatory Documentation**:
   - Create a `workflow.md` file in the project root.
   - It must contain:
     - Tools installed (with exact commands, e.g., `npx create-expo-app`, `npm install`).
     - Step‑by‑step execution process.
     - Detailed code explanation and architecture decisions.
     - The full list of confirmed constraints (interview Q&A).
     - Any official documentation consulted (Expo, React Navigation, etc.).

4. **Self‑Optimisation**:
   - If any instruction in this `AGENTS.md` is ambiguous or could cause issues, pause and ask the user for clarification before continuing.
   - Update this file as decisions are made, so it remains a flawless blueprint.

## Deliverables
- Complete React Native project source code.
- `workflow.md` documentation file.
- Instructions for running the app locally via Expo Go (or a link to a hosted demo if available).
- Screenshot **shot list** documented by agent; user captures the actual shots on their phone.

## Note
- This is a demo, but treat it as a real client project: clean code, good practices, and a polished UI.
- The appointment booking feature is the core selling point; ensure it works flawlessly and feels intuitive.