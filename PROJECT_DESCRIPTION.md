# Amiboli — Project Description

*Learn to **speak** English by living inside great stories.*

---

## 1. The one-line pitch

Amiboli is a mobile app that turns stories into voice-acted, interactive scenes. You don't study English — you *step into a story*, speak your character's lines out loud, and get scored on how well you actually talk. It's the feeling of playing a story game crossed with a speaking coach.

---

## 2. The problem we're solving

Most language learners can read and write far better than they can speak. The gap is almost never grammar knowledge — it's **speaking confidence and fluency**:

- Traditional apps (flashcards, fill-in-the-blanks, multiple choice) train *recognition*, not *production*. You can ace every lesson and still freeze in a real conversation.
- Speaking practice is intimidating. People are scared of sounding wrong, so they avoid the one thing that actually builds fluency — talking.
- The practice that does exist is boring. "Repeat after me" drills have no stakes, no story, no reason to come back tomorrow.

**Amiboli's bet:** if speaking feels like *playing through a story you care about*
— with a character to be, a plot pulling you forward, and a charming co-star reacting to you — people will speak far more, far more willingly, and improve the skill that actually matters.

---

## 3. Who it's for

Intermediate learners (roughly B1–B2) who can read English comfortably but lack **spoken fluency and confidence** — students, young professionals, and anyone preparing for interviews, travel, or study abroad. The classic-literature framing also appeals to people who want their practice to feel cultured and worthwhile, not childish.

---

## 4. The core learning model

Every unit of practice is a **scene** — a short, voiced, interactive passage from a story. Within a scene the app alternates between:

1. **Story beats** — narration and the co-star's dialogue (voiced aloud, with typewriter text), so you're pulled through a plot.
2. **Your turn** — the app hands you the conversation: it tells you *what your character wants to say* (the intent). In easy mode you're shown a suggested line to say; in advanced mode you get only the intent and must phrase it in your own words.
3. **Live feedback** — you're scored on four speaking skills and your co-star *reacts* to how you did, in character.

The four skills we score (the heart of the product's value):

| Skill | What it measures |
| --- | --- |
| **Relevance** | Did you say something that fits the moment / answers the prompt? |
| **Smoothness** | Did you speak in a flow, or pause and stumble? |
| **Clarity** | How clearly were the words pronounced and shaped? |
| **Grammar** | Was the sentence well-formed? |

> **Why these four:** together they cover the full picture of *spoken* competence —
> content (relevance), delivery (smoothness, clarity), and form (grammar). A
> single "score" would hide where you're actually weak; four meters turn a vague
> "get better at English" into a concrete, improvable profile.

---

## 5. The app, screen by screen (and why each exists)

### Onboarding flow

- **Splash** — animated "Amiboli" logo, ~2s, sets the playful tone instantly.
- **Onboarding** — Swipeable cards explaining the concept ("Live the story",
  "Speak to move forward", "Get scored & climb"). Skippable.
- **Auth** — email/password + "Continue with Google" (UI only in the prototype).

### Home — the book feed

A vertical, **one-book-per-screen feed** with scroll-snap, so each swipe lands on a new story like flipping to a new world. Each book section is fully themed in that book's colors and shows a clean three-step hierarchy: **title → progress → one big button** ("Continue this story" / "Start this story"). A small row of scene dots previews progress without spoilers.

### The Book screen — a story's own world

Tapping a book opens its **own themed screen**: a recap card ("Previously, in…" for in-progress books, or an intro "You arrive as…" for new ones), then a vertical **scene path**. Completed scenes are sealed with a wax-stamp score; the current
scene glows ("You are here"); future scenes are literally **hidden in fog** so their names don't spoil the plot.

### The Play screen — "The Stage" (the soul of the app)

This is the actual practice experience, built as a **shadow-theatre**: for example of a sherlock holmes' story, near-black silhouette characters (Holmes in his deerstalker, You in a bowler, a Constable) posing inside a hand-drawn, softly-lit SVG set — the moonlit room at Lauriston Gardens with the word *RACHE* scrawled on the wall. It's all drawn in code; there are no image files. Other stories will have their own live set similar to this.

The stage is **directed by the story data** like a tiny film: the camera drifts to whatever matters, characters strike poses (pointing at a clue, leaning in to speak, tilting in confusion), props glow when mentioned, and the lighting shifts mood — *calm* by default, *tense* when you stumble, a warm *revelation* glow at the triumphant moment.

The loop: story beats type out and are voiced → on your turn the stage dims and your character lights up so you *know* it's time to speak → you hold the mic and talk (live waveform) → Holmes visibly reacts ("Holmes laughs — actually laughs") and a score chip floats up → repeat. At the end the scene "seals" with your average score, a breakdown of the four skills, your time, and one coaching tip drawn from your weakest skill.

> **Why a shadow theatre:** it had to feel *alive* and cinematic without the cost, so the svg based theatre set.

### Leaderboard

The user's rank is pinned at the top. Filter chips re-sort the list by Avg Score, Total Score, or any single skill, with medals for the top three.

### Profile

Avatar, join date, a weekly streak calendar, a stats grid (scenes completed, speaking time, average score, rank), per-skill bars, and a coach-style **Strengths / Areas to grow / Suggestions** section ("Your sentence structure is excellent"; "You pause often mid-sentence — try shadowing").

### Plans (Still not Finalized)

A Free plan (energy-based) and a Pro plan (gradient card, "Most Popular"). Free gives **2 energy bolts per 12 hours** (each scene costs energy) and access to up
to **10 books**; Pro unlocks unlimited energy and books.

> **Why this monetization:** energy creates a gentle daily-habit loop and a natural upgrade trigger, while the book cap gives a second, content-based reason to go Pro. Both are framed honestly and visibly.

### Settings & extras

Account, notification/sound toggles, language, legal, log out, app version.

### Notifications

The app will send frequent push notification to the user encouraging to practice.

---

## 6. Design language & principles

- **Playful but classy** — Duolingo's energy (vibrant color, bouncy
  micro-interactions, satisfying "moments") married to a literary, serif-prose feel for the story content. Display font for UI, serif for book text.
- **Diegetic / in-world wording** — scenes "seal" with wax stamps, future scenes hide "in the fog", you "step into a scene". The words *chapter*, *level*, *lesson* appear nowhere — it's stories, scenes, and books, so it never feels like schoolwork.
- **Simplicity is the top priority** — every screen has a clear three-step hierarchy and one obvious action. When in doubt, we cut, not add.
- **Stillness is craft** — on the stage, at most one camera move or one highlight at a time; constant motion is limited to subtle breathing and fog. Calm makes the big moments land.

---

## 7. How it's built (technical summary)

- **All artwork is code** — SVG silhouettes, sets, props, and effects; no image files or external assets. Animations use transforms/opacity only, targeting 60fps on mid-range phones.

---