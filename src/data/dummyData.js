// ────────────────────────────────────────────────────────────────────────────
// Amiboli — ALL dummy data lives here. Tweak names / scores freely.
// Everything is hardcoded for one pre-logged-in user. No persistence.
// ────────────────────────────────────────────────────────────────────────────

// The active (already logged-in) user — mid-journey.
export const user = {
  name: 'Shirsho',
  initials: 'AA',
  avatarColor: '#FF8A1F',
  joinedDaysAgo: 24,
  joinedText: '24 days ago',
  plan: 'Free',
  energy: { current: 1, max: 2, resetsIn: '6h 24m' },
  streak: 2,
  chaptersCompleted: 7,
  totalSpeakingTime: '3h 42m',
  rank: 14,
  scores: {
    relevance: 82,
    smoothness: 64,
    clarity: 78,
    grammar: 88,
  },
  avgScore: 78, // (82 + 64 + 78 + 88) / 4
  totalScore: 4210,
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

// ── Story map: Books → Chapters ─────────────────────────────────────────────
// status: 'completed' | 'current' | 'locked'
// Book 1 (3 ch, all completed) + Book 2 ch1–4 completed = 7 completed total.
export const books = [
  {
    id: 'b1',
    title: 'The Gloria Scott',
    emoji: '⛵',
    accent: '#22C55E',
    locked: false,
    chapters: [
      { id: 'b1c1', title: 'Chapter 1', status: 'completed', score: 84 },
      { id: 'b1c2', title: 'Chapter 2', status: 'completed', score: 76 },
      { id: 'b1c3', title: 'Chapter 3', status: 'completed', score: 81 },
    ],
  },
  {
    id: 'b2',
    title: 'A Study in Scarlet',
    emoji: '🔬',
    accent: '#FF8A1F',
    locked: false,
    chapters: [
      { id: 'b2c1', title: 'Chapter 1', status: 'completed', score: 79 },
      { id: 'b2c2', title: 'Chapter 2', status: 'completed', score: 85 },
      { id: 'b2c3', title: 'Chapter 3', status: 'completed', score: 71 },
      { id: 'b2c4', title: 'Chapter 4', status: 'completed', score: 83 },
      { id: 'b2c5', title: 'Chapter 5', status: 'current' },
      { id: 'b2c6', title: 'Chapter 6', status: 'locked' },
    ],
  },
  {
    id: 'b3',
    title: 'The Sign of the Four',
    emoji: '💎',
    accent: '#0EA5E9',
    locked: false, // visible, but every chapter grayed out / not started
    chapters: [
      { id: 'b3c1', title: 'Chapter 1', status: 'locked' },
      { id: 'b3c2', title: 'Chapter 2', status: 'locked' },
      { id: 'b3c3', title: 'Chapter 3', status: 'locked' },
      { id: 'b3c4', title: 'Chapter 4', status: 'locked' },
      { id: 'b3c5', title: 'Chapter 5', status: 'locked' },
    ],
  },
  // Books 4–6: collapsed / locked behind previous books.
  {
    id: 'b4',
    title: 'The Hound of the Baskervilles',
    emoji: '🐾',
    accent: '#8B5CF6',
    locked: true,
    chapters: [],
  },
  {
    id: 'b5',
    title: 'The Adventure of the Speckled Band',
    emoji: '🐍',
    accent: '#EF4444',
    locked: true,
    chapters: [],
  },
  {
    id: 'b6',
    title: 'The Red-Headed League',
    emoji: '🎩',
    accent: '#EC4899',
    locked: true,
    chapters: [],
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
  { ...makeUser('Shirsho', 'AA', '#FF8A1F', 82, 64, 78, 88, 4210), isMe: true },
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
    title: 'Replay Chapter 3 of A Study in Scarlet',
    body: 'Your smoothness dipped there — a great spot to rebuild flow.',
  },
  {
    emoji: '🧠',
    title: 'Think in English daily',
    body: 'Spend 5 minutes thinking in English to reduce mid-sentence pauses.',
  },
]

// ── Plans ───────────────────────────────────────────────────────────────────
export const plans = {
  free: {
    name: 'Free',
    tagline: 'Energy-based learning',
    energy: { current: 1, max: 2, resetsEvery: '12 hours' },
    rules: [
      'Full energy completes 2 chapters',
      'Max 20 chapters in free mode',
    ],
    chaptersUsed: 7,
    chaptersCap: 20,
  },
  pro: {
    name: 'Pro',
    price: '$6.99',
    period: '/month',
    badge: 'MOST POPULAR',
    perks: [
      'Unlimited energy',
      'Unlimited chapters',
      'Priority new stories',
      'Detailed skill analytics',
    ],
  },
  comparison: [
    { feature: 'Energy', free: '2 bolts / 12h', pro: 'Unlimited' },
    { feature: 'Chapters', free: 'Up to 20', pro: 'Unlimited' },
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
    body: 'Chapter 5 of A Study in Scarlet is waiting for you.',
    time: '2h ago',
  },
  {
    id: 'n2',
    emoji: '🔥',
    title: 'Your streak is in danger!',
    body: 'Keep your 5-day streak alive — speak before midnight.',
    time: '5h ago',
    urgent: true,
  },
  {
    id: 'n3',
    emoji: '🏆',
    title: 'Tintin just scored 96 on The Gloria Scott!',
    body: 'Can you beat that? Climb the leaderboard.',
    time: '1d ago',
  },
  {
    id: 'n4',
    emoji: '⚡',
    title: 'Energy refilled',
    body: 'You have 1 bolt ready. Time for a chapter!',
    time: '1d ago',
  },
]

// ── Settings rows ───────────────────────────────────────────────────────────
export const appVersion = 'Amiboli v0.1 — Prototype'
