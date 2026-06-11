// ────────────────────────────────────────────────────────────────────────────
// Amiboli — ALL dummy data lives here. Tweak names / scores freely.
// Everything is hardcoded for one pre-logged-in user. No persistence.
// ────────────────────────────────────────────────────────────────────────────

// The active (already logged-in) user — mid-journey.
// Scenes completed: 4 (Scarlet) + 1 (Girl on the Train) = 5.
export const user = {
  name: 'Shirsho',
  initials: 'AA',
  avatarColor: '#FF8A1F',
  joinedDaysAgo: 24,
  joinedText: '24 days ago',
  plan: 'Free',
  energy: { current: 1, max: 2, resetsIn: '6h 24m' },
  streak: 2,
  scenesCompleted: 5,
  totalSpeakingTime: '2h 40m',
  rank: 14,
  scores: {
    relevance: 82,
    smoothness: 64,
    clarity: 78,
    grammar: 88,
  },
  avgScore: 78, // (82 + 64 + 78 + 88) / 4
  totalScore: 3920, // keeps rank #14 (between Yuki 4,360 and Tomas 3,890)
  // Which days this week were active (Mon→Sun). 2-day streak.
  weeklyActivity: [true, true, false, true, true, false, false],
}

// Skill metadata — labels, colors, icons (emoji) used across screens.
export const skills = [
  { key: 'relevance', label: 'Relevance', color: '#8B5CF6', emoji: '🎯' },
  { key: 'smoothness', label: 'Smoothness', color: '#0EA5E9', emoji: '🌊' },
  { key: 'clarity', label: 'Clarity', color: '#22C55E', emoji: '🔍' },
  { key: 'grammar', label: 'Grammar', color: '#FF8A1F', emoji: '📐' },
]

// ── Books & scenes ──────────────────────────────────────────────────────────
// Every book is accessible from the start (no sequential locking). The only
// Free-plan limit is the 10-book cap, communicated in Plans.
//
// scene.status: 'completed' | 'current' | 'locked' ('locked' = not reached yet;
// its name is hidden in fog on the Book screen — future scenes are spoilers).
//
// All scene names, recaps and narration lines are ORIGINAL text written for
// this prototype — evocative of each book's premise, never quoting the novels.
export const books = [
  {
    id: 'scarlet',
    title: 'A Study in Scarlet',
    subtitle: 'A Sherlock Holmes story',
    pitch: 'Solve a murder alongside the world’s sharpest detective.',
    themeId: 'victorian-london',
    recapText:
      'Holmes hands you the telegram. “Lauriston Gardens,” he says. “There has been a murder — and this time, you do the talking.”',
    introText:
      'You arrive at 221B Baker Street as Holmes’s newest companion — just as a telegram brings news of a body in an empty house.',
    scenes: [
      {
        id: 'sc1',
        sceneName: 'The Telegram Arrives',
        status: 'completed',
        score: 84,
        narrationAfter: 'A cab rattles through the fog toward Lauriston Gardens…',
      },
      {
        id: 'sc2',
        sceneName: 'A Word with the Constable',
        status: 'completed',
        score: 76,
        narrationAfter: 'The constable lifts his lantern, and the door of Number 3 creaks open…',
      },
      {
        id: 'sc3',
        sceneName: 'The Empty House',
        status: 'completed',
        score: 81,
        narrationAfter: 'In the dust of the bare room, something glints — a wedding ring…',
      },
      {
        id: 'sc4',
        sceneName: 'The Word on the Wall',
        status: 'completed',
        score: 79,
        narrationAfter: 'Holmes studies the scrawled letters, then turns to you. “Now we find our cabman.”',
      },
      {
        id: 'sc5',
        sceneName: 'The Cabman’s Tale',
        status: 'current',
      },
      {
        id: 'sc6',
        sceneName: 'The Avenger Unmasked', // hidden in fog until Scene 5 is done
        status: 'locked',
      },
    ],
  },
  {
    id: 'train',
    title: 'The Girl on the Train',
    subtitle: 'Inspired by the thriller',
    pitch: 'What you saw from the train window could solve a disappearance.',
    themeId: 'rail-dusk',
    recapText:
      'Every morning you watch the same house from the 8:04. Today the news says the woman who lives there is missing — and you may be the last stranger who saw her.',
    introText:
      'You board the same commuter train every day, past the same row of houses — until one window shows you something you can’t forget.',
    scenes: [
      {
        id: 'tr1',
        sceneName: 'The 8:04 to London',
        status: 'completed',
        score: 72,
        narrationAfter: 'The same houses slide past, day after day — until today…',
      },
      {
        id: 'tr2',
        sceneName: 'The Couple on the Terrace',
        status: 'current',
      },
      { id: 'tr3', sceneName: 'A Gap in the Evening', status: 'locked' },
      { id: 'tr4', sceneName: 'Questions at the Station', status: 'locked' },
      { id: 'tr5', sceneName: 'What the Window Saw', status: 'locked' },
    ],
  },
  {
    id: 'mockingbird',
    title: 'To Kill a Mockingbird',
    subtitle: 'Inspired by the classic',
    pitch: 'A small town, a big trial, and a child who sees it all.',
    themeId: 'southern-summer',
    recapText:
      'The trial is the only thing anyone in town talks about — and tomorrow, you will sit in the gallery and hear it for yourself.',
    introText:
      'You arrive as the new kid in a sleepy Southern town. The summers are long, the neighbors whisper, and the quiet house at the end of the street keeps a secret.',
    scenes: [
      {
        id: 'mb1',
        sceneName: 'The New Kid in Town',
        status: 'current', // first scene of a not-started book
      },
      { id: 'mb2', sceneName: 'A Dare at Dusk', status: 'locked' },
      { id: 'mb3', sceneName: 'Whispers on the Porch', status: 'locked' },
      { id: 'mb4', sceneName: 'The Courtroom Gallery', status: 'locked' },
      { id: 'mb5', sceneName: 'The Walk Home', status: 'locked' },
    ],
  },
]

// ── Leaderboard ─────────────────────────────────────────────────────────────
// Per-user skill scores; avg + total precomputed so filters just re-sort.
// Shirsho sits at rank #14 by Avg Score. 15 entries total.
function makeUser(name, initials, color, relevance, smoothness, clarity, grammar, total) {
  const avg = Math.round((relevance + smoothness + clarity + grammar) / 4)
  return { name, initials, color, relevance, smoothness, clarity, grammar, avg, total }
}

export const leaderboardUsers = [
  makeUser('Tintin', 'TI', '#EF4444', 97, 92, 96, 95, 7793),
  makeUser('Hermione', 'HE', '#8B5CF6', 95, 90, 94, 93, 7510),
  makeUser('Naruto', 'NA', '#F59E0B', 92, 89, 91, 92, 7120),
  makeUser('Mulan', 'MU', '#EC4899', 90, 91, 89, 90, 6980),
  makeUser('Kabir', 'KA', '#0EA5E9', 91, 86, 90, 89, 6640),
  makeUser('Sora', 'SO', '#22C55E', 88, 87, 86, 89, 6210),
  makeUser('Diego', 'DI', '#14B8A6', 86, 84, 85, 85, 5870),
  makeUser('Ananya', 'AN', '#A855F7', 85, 82, 86, 83, 5540),
  makeUser('Leo', 'LE', '#F97316', 84, 80, 83, 85, 5230),
  makeUser('Mei', 'ME', '#06B6D4', 83, 81, 82, 82, 4980),
  makeUser('Omar', 'OM', '#84CC16', 82, 79, 81, 82, 4760),
  makeUser('Priya', 'PR', '#E11D48', 80, 78, 81, 81, 4520),
  makeUser('Yuki', 'YU', '#6366F1', 79, 77, 80, 80, 4360),
  // Shirsho — the active user (rank #14 by avg). isMe flag highlights the row.
  { ...makeUser('Shirsho', 'AA', '#FF8A1F', 82, 64, 78, 88, 3920), isMe: true },
  makeUser('Tomas', 'TO', '#64748B', 74, 70, 76, 76, 3890),
]

// Filter chips for the leaderboard. `key` maps to a field on each user.
export const leaderboardFilters = [
  { key: 'avg', label: 'Avg Score' },
  { key: 'total', label: 'Total Score' },
  { key: 'clarity', label: 'Clarity' },
  { key: 'grammar', label: 'Grammar' },
  { key: 'smoothness', label: 'Smoothness' },
  { key: 'relevance', label: 'Relevance' },
]

// ── Profile: strengths / weaknesses / coaching suggestions ──────────────────
export const strengths = [
  { skill: 'Grammar', score: 88, note: 'Your sentence structure is excellent.' },
  { skill: 'Relevance', score: 82, note: 'You stay relevant to the conversation.' },
]

export const weaknesses = [
  { skill: 'Smoothness', score: 64, note: 'You pause often mid-sentence.' },
]

export const suggestions = [
  {
    emoji: '🗣️',
    title: 'Practice shadowing',
    body: 'Repeat dialogue lines out loud right after hearing them.',
  },
  {
    emoji: '🔁',
    title: 'Replay Scene 2 of A Study in Scarlet',
    body: 'Your smoothness dipped there — a great spot to rebuild flow.',
  },
  {
    emoji: '🧠',
    title: 'Think in English daily',
    body: 'Spend 5 minutes thinking in English to reduce mid-sentence pauses.',
  },
]

// ── Plans ───────────────────────────────────────────────────────────────────
// Free limits: energy per scene + a 10-book cap. No book is locked in the
// prototype (only 3 books exist) — the cap is just communicated.
export const plans = {
  free: {
    name: 'Free',
    tagline: 'Energy-based learning',
    energy: { current: 1, max: 2, resetsEvery: '12 hours' },
    rules: [
      'Full energy completes 2 scenes',
      'Access up to 10 books on Free, unlimited on Pro',
    ],
    booksUsed: 2, // books started so far
    booksCap: 10,
  },
  pro: {
    name: 'Pro',
    price: '$6.99',
    period: '/month',
    badge: 'MOST POPULAR',
    perks: [
      'Unlimited energy',
      'Unlimited books',
      'Priority new stories',
      'Detailed skill analytics',
    ],
  },
  comparison: [
    { feature: 'Energy', free: '2 bolts / 12h', pro: 'Unlimited' },
    { feature: 'Books', free: 'Up to 10', pro: 'Unlimited' },
    { feature: 'New stories', free: 'Standard', pro: 'Priority' },
    { feature: 'Skill analytics', free: 'Basic', pro: 'Detailed' },
  ],
}

// ── Notifications (bell sheet on Home) ──────────────────────────────────────
export const notifications = [
  {
    id: 'n1',
    emoji: '☀️',
    title: 'Ready for today’s story?',
    body: 'Scene 5 of A Study in Scarlet is waiting for you.',
    time: '2h ago',
  },
  {
    id: 'n2',
    emoji: '🔥',
    title: 'Your streak is in danger!',
    body: 'Keep your 2-day streak alive — speak before midnight.',
    time: '5h ago',
    urgent: true,
  },
  {
    id: 'n3',
    emoji: '🏆',
    title: 'Tintin just scored 96 on A Study in Scarlet!',
    body: 'Can you beat that? Climb the leaderboard.',
    time: '1d ago',
  },
  {
    id: 'n4',
    emoji: '⚡',
    title: 'Energy refilled',
    body: 'You have 1 bolt ready. Time for a scene!',
    time: '1d ago',
  },
]

// ── Settings rows ───────────────────────────────────────────────────────────
export const appVersion = 'Amiboli v0.1 — Prototype'
