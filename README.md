# Amiboli — Story-Based English Speaking App (Prototype)

A **mobile-first, visual-only** React prototype of **Amiboli**, a story-based English
speaking learning app with a playful, game-like (Duolingo-energy) feel.

> ⚠️ **This is a prototype.** No backend, no persistence, no real auth, no speech
> features. Everything is powered by hardcoded dummy data for one pre-logged-in
> user (Aarav). All state lives in memory and resets on refresh.

---

## ✨ What's inside

- **React 18 + Vite + Tailwind CSS**
- **Framer Motion** for animations (bouncy nodes, screen transitions, sheets, toasts)
- **React Router** (HashRouter — works inside a packaged APK)
- **PWA-ready** — manifest, icons, mobile viewport meta, theme color
- **Capacitor**-configured so you can package an Android APK later
- Locked to **360–430px** mobile width; on desktop it floats in a phone-sized frame

---

## 🚀 Quick start

```bash
npm install
npm run dev
```

Open the printed URL (e.g. `http://localhost:5173`). The dev server also binds to
your LAN (`Network: http://192.168.x.x:5173`) so you can open it on a **real phone**
on the same Wi-Fi.

### Build (PWA-ready static site)

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

### Regenerate app icons (optional)

PNG icons are pre-generated in `public/icons/`. To rebuild them from the script:

```bash
npm run icons
```

---

## 🌐 Live demo (Vercel)

Deployed at **https://amiboli-app-prototype.vercel.app** — open it in Chrome on a
phone and **⋮ → Install app** for a true standalone PWA (full-screen, no address bar).

Redeploy after changes:

```bash
vercel deploy --prod   # from the project root (Vercel CLI, framework auto-detected)
```

> Why a real host matters for mobile install: Android builds a **WebAPK** by
> having Google's servers fetch your manifest + icons. That works over a clean
> HTTPS origin (Vercel), but **not** through `localhost`/LAN-IP `http://` or an
> ngrok-free tunnel (its interstitial warning page blocks that server-side
> fetch, so you only get a browser shortcut *with* an address bar). Desktop
> install works from `localhost` because it doesn't use WebAPK minting.

---

## ⬇️ "Download" button — install as a PWA

There's a **Download** button in two places:

- a floating pill on **Home** (bottom-right), and
- a **Download app** row at the top of **Settings**.

Tapping it installs Amiboli as a **PWA** (Add to Home Screen) so it runs
full-screen like a native app:

- **Chrome / Edge / Android** — fires the browser's one-tap install prompt
  (captured via `beforeinstallprompt`).
- **iOS Safari / desktop / not-yet-eligible** — opens a short sheet with the
  manual "Add to Home Screen" steps.
- **Already installed** — shows an "App already installed" toast.

This is powered by a small service worker ([`public/sw.js`](public/sw.js)) +
the web manifest. The service worker **only registers in production builds**
(it would interfere with Vite's dev HMR), so to see the real install prompt
locally, run the production build:

```bash
npm run build
npm run preview      # then open the printed localhost URL in Chrome
```

> The service worker caches the static app shell for offline launch only — it
> does **not** persist any user/dummy data (app state still resets on refresh).
>
> Note: the **Download button installs the PWA; it does not download an `.apk`
> file.** Producing an installable `.apk` requires the Android toolchain — see
> the Capacitor APK steps below.

---

## 📱 App flow

```
Splash (auto-advances ~2s)
  → Home (the dummy user is treated as already logged in)

Onboarding (3 swipeable slides) and Auth (UI only) are reachable but skippable:
  Onboarding  →  #/onboarding
  Auth        →  #/auth      (any "Continue" tap → Home, no validation)
```

The main app is a **5-tab bottom bar**: **Home · Leaderboard · Profile · Plans · Settings**.

### Screens

| Screen          | Highlights                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------- |
| **Home**        | Winding, path-based story map grouped by Books; current chapter glows with a "Continue" pill; locked books collapse. Top bar has streak/energy/bell/avatar. Bell opens a notifications sheet. |
| **Leaderboard** | Pinned "my rank" card, filter chips (Avg/Total/Clarity/Grammar/Smoothness/Relevance) that re-sort the list, top-3 medals, user row highlighted. |
| **Profile**     | Avatar, streak + weekly calendar, stats grid, skill bars, **Strengths / Areas to grow / coach-style suggestions**. |
| **Plans**       | Free (energy-based) current plan, attractive gradient Pro card ("MOST POPULAR"), Free-vs-Pro comparison table. |
| **Settings**    | Account, notification & sound toggles (UI only), language, legal rows, log out → Auth, app version. |

> **Chapters are not playable.** Tapping any chapter only bounces + shows a toast
> ("Story mode coming soon"). All real actions (Upgrade, Logout, Google auth,
> Edit info) are non-functional or show toasts.

---

## 🎭 Authoring a scene (the beat player + shadow-theatre stage)

One scene is fully playable: **A Study in Scarlet, Scene 5** (`/play/scarlet/sc5`).
The Play screen is a **generic beat player** with a **shadow-theatre stage** —
silhouette characters posing inside an illustrated SVG set, directed entirely
by the beat data in [`src/data/scenes.js`](src/data/scenes.js). No code changes
are needed to author new scenes.

### Beat format

```js
{
  id: 'sc5', bookId: 'scarlet', sceneNumber: 5, title: 'The Cabman’s Tale',
  setId: 'lauriston-room',          // which stage set to build (see Stage.jsx)
  npc: { name: 'Holmes' },          // the main other character
  beats: [
    { type: 'narration', text: '…', stage: {…} },
    { type: 'npc_line', speaker: 'Holmes', text: '…', stage: {…} },
    { type: 'user_turn',
      intent: 'Tell Holmes what you noticed',           // the prompt
      suggestedLine: 'The window was forced…',          // ghost line
      simulated: {
        transcript: '…',                                // "what you said"
        scores: { relevance, smoothness, clarity, grammar },  // 0–100
        npcReaction: 'Holmes nods slowly.',             // shown on stage
        mood: 'impressed' | 'neutral' | 'puzzled',      // drives the NPC's pose
        isBigMoment: true,                              // → revelation lighting + chime
      },
      stage: {…} },
  ],
}
```

### Stage directions (`stage`, optional on any beat)

Applied at the start of the beat. All fields optional — omitted fields keep the
current state; unknown names no-op gracefully (write cues for effects that
don't exist yet).

| Field | Values |
| --- | --- |
| `camera` | `wide` (default) · `holmes` · `you` · `constable` · `window` · `wallWriting` · `lamp` · `door` — one slow film-drift per beat |
| `highlight` | `window` · `wallWriting` · `lamp` · `door` — a ~2s brighten/pulse on the prop |
| `lighting` | `calm` (default) · `tense` (dim, cool) · `revelation` (bright, warm) — crossfades |
| `poses` | `{ holmes: 'speaking', you: { pose: 'pointing', target: 'right' } }` |
| `enter` / `exit` | character id walks on / off stage (e.g. `'constable'`) |

**Poses:** `idle` · `speaking` · `pointing` (with `target: 'left' | 'right' | 'up'`)
· `impressed` · `puzzled`. Pointing left/right turns the whole figure.

**Auto-direction** (no data needed): the speaker of an `npc_line` poses
`speaking`; on a `user_turn` the camera drifts to `you` and they get the lit
rim; after the turn the NPC re-poses from `simulated.mood`; big moments switch
lighting to `revelation`. Idle life (breathing, occasional head turns,
talk-bob synced to the typewriter) is always on.

### Adding a new set / character (same style, other books)

- **Characters** live in [`Character.jsx`](src/components/play/Character.jsx):
  add an entry to `CHARACTERS` with four shape groups (`body`, `head`,
  `frontArm`, `backArm`) drawn in a 120×230 box, feet on the baseline, facing
  right. Use flat `SILHOUETTE` fills only — identity comes from hat/coat/prop
  shapes, never faces. Poses, breathing, glow and walk-in come for free.
- **Sets** live in [`Stage.jsx`](src/components/play/Stage.jsx): draw a new set
  component (flat fills, 3–4 tones of the book's palette, fake glows from
  stacked semi-transparent circles — **no SVG filters, no images**), then
  register its camera targets in `CAMERAS`, prop zones in `PROPS`, and slots in
  `SLOTS` under a new `setId`.
- Guardrails: at most one camera move or highlight per beat; fog (or the book's
  one ambient effect) is the only constant motion; animate transforms/opacity
  only.

Pacing that feels right: ~12–16 beats with 3–5 user turns, scores telling an
arc. Scoring is **simulated**; the mic is real (live waveform), with an
automatic Hold-to-speak fallback when no mic is available.

---

## 📂 Folder structure

```
amiboli-app-prototype/
├── index.html                 # mobile viewport meta, fonts, manifest link
├── capacitor.config.json      # Capacitor app config (appId, webDir = dist)
├── vite.config.js
├── tailwind.config.js         # warm palette + display/body fonts
├── scripts/
│   └── generate-icons.mjs      # zero-dep PNG icon generator
├── public/
│   ├── manifest.webmanifest    # PWA manifest
│   ├── icon.svg                # source vector icon
│   └── icons/                  # generated PNG icons (192 / 512 / maskable)
└── src/
    ├── main.jsx                # entry — wraps app in HashRouter
    ├── App.jsx                 # routes + PhoneFrame + ToastProvider + tab layout
    ├── index.css               # Tailwind layers + base styles
    ├── data/
    │   └── dummyData.js        # ⭐ ALL dummy data lives here (see below)
    ├── components/
    │   ├── PhoneFrame.jsx       # locks app to mobile width / desktop phone frame
    │   ├── BottomTabBar.jsx     # 5-tab navigation
    │   ├── HomeTopBar.jsx       # streak / energy / bell / avatar
    │   ├── BookSection.jsx      # decorative book header + winding path
    │   ├── ChapterNode.jsx      # a single path node (completed/current/locked)
    │   ├── NotificationsSheet.jsx
    │   ├── ProgressRing.jsx
    │   ├── Avatar.jsx
    │   ├── Screen.jsx           # standard screen wrapper w/ transition
    │   └── ToastProvider.jsx    # in-memory toast system
    └── screens/
        ├── Splash.jsx
        ├── Onboarding.jsx
        ├── Auth.jsx
        ├── Home.jsx
        ├── Leaderboard.jsx
        ├── Profile.jsx
        ├── Plans.jsx
        └── Settings.jsx
```

### 🎯 Where the dummy data lives

**Everything is in [`src/data/dummyData.js`](src/data/dummyData.js).** Tweak names,
scores, books, chapters, leaderboard, plans, and notifications there — no other
file needs to change. Key exports:

- `user` — the active (pre-logged-in) user: Aarav, energy, streak, scores, rank
- `books` — the story map (Books → Chapters, with `status` + `score`)
- `leaderboardUsers` / `leaderboardFilters` — precomputed per-filter scores
- `strengths` / `weaknesses` / `suggestions` — Profile coaching content
- `plans` — Free vs Pro details + comparison table
- `notifications` — bell-sheet items
- `skills`, `appVersion`

Data is kept **internally consistent**: Book 1 (3 completed) + Book 2 chapters 1–4
(4 completed) = **7 chapters completed**, matching the profile/stats. Aarav's
skill scores (82/64/78/88) average to **78** and place him at **rank #14**.

---

## 🤖 Building the Android APK (Capacitor)

Capacitor is already configured (`capacitor.config.json`, `appId: com.amiboli.app`,
`webDir: dist`). Follow these exact steps:

### Prerequisites

- **Android Studio** installed (with Android SDK + a configured emulator or device)
- **JDK 17** (bundled with recent Android Studio)

### Steps

```bash
# 1. Install deps (if you haven't already)
npm install

# 2. Build the web app — Capacitor copies from dist/
npm run build

# 3. Add the native Android project (creates ./android, one-time)
npx cap add android

# 4. Sync the built web assets + config into the native project
npx cap sync

# 5. Open the project in Android Studio
npx cap open android
```

Then **in Android Studio**:

1. Let Gradle finish syncing.
2. **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
3. When the build finishes, click **locate** in the notification — the debug APK is at:
   `android/app/build/outputs/apk/debug/app-debug.apk`
4. Install on a device: enable USB debugging, then either drag the APK onto an
   emulator, or run `adb install android/app/build/outputs/apk/debug/app-debug.apk`.

> 🔁 **After any web change**, re-run `npm run build && npx cap sync` before
> rebuilding in Android Studio so the native project picks up the new `dist/`.

### Release APK (optional)

For a signed release build, in Android Studio use **Build → Generate Signed
Bundle / APK**, create/select a keystore, and choose **release**. Output lands in
`android/app/build/outputs/apk/release/`.

---

## 🎨 Design language

- Warm, energetic palette (orange-led) defined in `tailwind.config.js`
- One **display** font (Baloo 2) + one **body** font (Nunito), loaded in `index.html`
- Rounded shapes, soft shadows, press/scale feedback on every tappable element
- Smooth screen transitions, glowing/pulsing current chapter, animated progress bars

---

## 🧱 Hard constraints (by design)

- ❌ No `localStorage`, no backend, no API calls — all state in memory, resets on refresh
- ❌ Chapters are not playable (tap = bounce + toast only)
- ❌ Upgrade / Logout / Google auth / Edit info are non-functional (toasts or route only)
- ✅ All tweakable data centralized in `src/data/dummyData.js`

---

_Amiboli v0.1 — Prototype_
