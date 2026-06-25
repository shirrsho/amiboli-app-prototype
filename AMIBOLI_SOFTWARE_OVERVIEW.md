# Amiboli — Software Overview

A plain-language description of the whole software, for engineers to turn into a
feature document. Amiboli teaches spoken English by letting users act through
stories and speak their lines out loud.

---

## 1. Roles & access
1. There are two roles: **Admin** and **User**.
2. Users access everything through the **mobile app**.
3. Admins manage everything through a **web dashboard**.
4. There is an authentication system: sign up and log in with email/password or Google. Each account has one role.

## 2. Packages & subscriptions
1. The Admin can create **packages** (for example Free and Pro) — each with a price, a duration, and what it unlocks (energy limits, how many books, ads or no ads, etc.).
2. A User can **subscribe** to a package from inside the app.
3. The Admin can also **manually subscribe** a user to a package (for promos, refunds, or support).
4. The **Free** package has limits (limited energy, a capped number of books, ads). The **Pro** package removes those limits.
5. Each user always has one active package. Start date, expiry, and renewal are tracked.

## 3. Books
1. The Admin can **create books** from the dashboard (title, author-style subtitle, a one-line pitch, a visual theme/world, and a cover/character).
2. Each book is made of a series of **scenes**.
3. Some books are **free**; some are **premium** (sold individually in the store).
4. Books are shown to the user as a feed; tapping a book opens it.

## 4. Scenes (the core experience)
1. A **scene** is one playable episode of a book — the user acts inside a short part of the story.
2. The Admin **creates scenes from the dashboard** by **pasting the scene's content (a JSON)** into an editor; it is checked and **saved in the backend**, and the app **loads scenes from the backend**. (A friendlier visual scene editor can replace the paste step later.)
3. A scene plays as a sequence of moments: **narration**, a **character speaking**, and the **user's turn to speak**.
4. The app reads lines aloud and shows the text; the user taps to move forward through the story.
5. On the user's turn, the app shows **what to say** (a goal plus a suggested line); the user **speaks it out loud**.
6. Inside a book, scenes appear on a path: finished scenes show their score, the current scene is highlighted, and upcoming scenes are hidden to avoid spoilers.
7. Playing a scene **costs energy**.

## 5. Speaking & scoring
1. The user **speaks into the microphone** during their turns.
2. Each spoken line is scored on **four skills**: Relevance, Smoothness, Clarity, Grammar (0–100 each).
3. The story character **reacts** to how well the user spoke — encouraging, never shaming.
4. **For now the scoring is simulated** (placeholder values). Later, the user's actual speech will be evaluated to produce real scores.
5. **Every performance is recorded** — each spoken line's scores and each completed scene's result are saved for the user.

## 6. Progress, energy, streaks, points
1. **Energy:** users have a limited number of energy bolts; each scene costs one. Energy refills over time. A Free user can **watch an ad to gain energy — at most 2 ads per day**. Pro users get unlimited energy (and no ads).
2. **Streak:** completing a scene each day keeps a daily streak alive.
3. **Points (XP):** each completed scene earns points based on the score; points add up to a running total.
4. After a scene, the user sees a **results screen**: their score, points earned, streak increase, a skill breakdown, their best line, and a coaching tip.
5. All progress (scenes completed, scores, time spent, streak, points, rank) is saved per user.

## 7. Leaderboard
1. Users are **ranked** against each other.
2. The leaderboard can be **sorted** by overall average, total points, or any single skill.
3. The user's own rank is pinned and highlighted.

## 8. Store & purchases
1. Premium books appear in an in-app **store** with a price.
2. A user **buys** a book to add it to their library; it then shows up on their home.
3. The Admin decides which books are premium and sets their prices.
4. **For now purchasing is a placeholder.** Later it uses real payments.

## 9. Ads
1. Ads appear in **one place only**: a Free user can **watch an ad to gain energy**, up to **2 ads per day**.
2. There are **no ads anywhere else** — none after finishing a scene, leaving a scene, or on any other screen.
3. Pro users see no ads at all.

## 10. Profile, notifications & settings
1. The user's **profile** shows their stats: scenes completed, speaking time, average score, rank, skill levels, strengths/weaknesses, and coaching suggestions.
2. The app sends **notifications** (daily nudges, streak reminders, leaderboard updates).
3. **Settings** include account, notification and sound toggles, language, and log out.

## 11. Admin dashboard (web)
1. **Manage users** — view, search, see their progress and performance, and assign packages.
2. **Manage packages** — create/edit subscription plans and pricing; manually subscribe users.
3. **Manage books** — create/edit books, mark them free or premium, and set prices.
4. **Manage scenes** — the Admin writes a scene by **pasting its content (JSON)** into the dashboard. It is **validated and saved in the backend**, and the app uses it immediately — **no app update needed** to add or change a scene. (A visual editor can replace the paste step later.)
5. **View analytics** — performance and usage across users and books (scores, completions, engagement).
6. **Manage notifications/announcements** — *(optional/later)*.

## 12. What gets recorded (saved in the system)
1. User accounts, roles, and their active package (with dates).
2. The **content** created by the Admin — packages, books, and **scenes** (the pasted JSON).
3. Every scene attempt — the four skill scores, the line spoken, time taken, and whether it was completed.
4. Each user's progress per book and scene, plus energy, streak, total points, and rank.
5. Purchases and subscription history.

## 13. Now vs. later (phasing)
- **Now:** Admins author scenes by **pasting JSON** into the dashboard (saved in the backend; the app fetches them); scoring is simulated; payments and ads are placeholders.
- **Later:** a friendly **visual scene editor** replaces the paste step; the user's real speech is scored; real payments and real ads.

---

*Companion documents: `AMIBOLI_DEV_HANDOFF.md` / `.pdf` describe the app in build-level
detail. Live prototype: amiboli-app-prototype.vercel.app*
