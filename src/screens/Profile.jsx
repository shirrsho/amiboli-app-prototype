import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import Avatar from '../components/Avatar'
import { useToast } from '../components/ToastProvider'
import { user, skills, strengths, weaknesses, suggestions } from '../data/dummyData'

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function Profile() {
  const showToast = useToast()

  const stats = [
    { label: 'Chapters', value: user.chaptersCompleted, emoji: '📘' },
    { label: 'Duration', value: user.totalSpeakingTime, emoji: '⏱️' },
    { label: 'Avg score', value: user.avgScore, emoji: '⭐' },
    { label: 'Rank', value: `#${user.rank}`, emoji: '🏆' },
  ]

  return (
    <Screen title="Profile">
      {/* Identity card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex flex-col items-center rounded-3xl bg-white p-5 shadow-soft"
      >
        <Avatar initials={user.initials} color={user.avatarColor} size={84} />
        <h2 className="mt-3 font-display text-2xl font-extrabold text-ink">{user.name}</h2>
        <p className="text-sm font-bold text-ink-soft">Joined {user.joinedText}</p>

        {/* Streak + weekly calendar */}
        <div className="mt-4 w-full rounded-2xl bg-cream p-3">
          <div className="mb-2 flex items-center justify-center gap-1.5">
            <span className="text-lg">🔥</span>
            <span className="font-display font-extrabold text-ink">{user.streak}-day streak</span>
          </div>
          <div className="flex justify-between">
            {dayLabels.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-ink-soft/60">{d}</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`grid h-7 w-7 place-items-center rounded-full text-xs ${
                    user.weeklyActivity[i]
                      ? 'bg-brand-500 text-white'
                      : 'bg-black/5 text-ink-soft/40'
                  }`}
                >
                  {user.weeklyActivity[i] ? '🔥' : ''}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-white p-4 shadow-soft"
          >
            <div className="text-2xl">{s.emoji}</div>
            <div className="mt-1 font-display text-2xl font-extrabold text-ink">{s.value}</div>
            <div className="text-xs font-bold text-ink-soft">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Skill breakdown — horizontal bars */}
      <SectionTitle>Skill breakdown</SectionTitle>
      <div className="mb-5 flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-soft">
        {skills.map((sk) => (
          <div key={sk.key}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-extrabold text-ink">
                {sk.emoji} {sk.label}
              </span>
              <span className="font-display font-extrabold" style={{ color: sk.color }}>
                {user.scores[sk.key]}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-black/5">
              <motion.div
                className="h-full rounded-full"
                style={{ background: sk.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${user.scores[sk.key]}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Strengths */}
      <SectionTitle>💪 Strengths</SectionTitle>
      <div className="mb-4 flex flex-col gap-2">
        {strengths.map((s) => (
          <CoachCard key={s.skill} tone="good" title={`${s.skill} (${s.score})`} body={s.note} />
        ))}
      </div>

      {/* Weaknesses */}
      <SectionTitle>🌱 Areas to grow</SectionTitle>
      <div className="mb-4 flex flex-col gap-2">
        {weaknesses.map((w) => (
          <CoachCard key={w.skill} tone="grow" title={`${w.skill} (${w.score})`} body={w.note} />
        ))}
      </div>

      {/* Suggestions */}
      <SectionTitle>✨ Suggestions to improve</SectionTitle>
      <div className="mb-5 flex flex-col gap-2">
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-3 rounded-2xl bg-grape-400/10 p-4"
          >
            <span className="text-2xl">{s.emoji}</span>
            <div>
              <p className="font-extrabold leading-tight text-ink">{s.title}</p>
              <p className="text-sm font-semibold text-ink-soft">{s.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit personal info (static) */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => showToast('Editing coming soon', '✏️')}
        className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-soft"
      >
        <span className="font-extrabold text-ink">Edit personal info</span>
        <span className="text-ink-soft">›</span>
      </motion.button>
    </Screen>
  )
}

function SectionTitle({ children }) {
  return <h3 className="mb-2 mt-1 font-display text-lg font-extrabold text-ink">{children}</h3>
}

function CoachCard({ tone, title, body }) {
  const styles =
    tone === 'good'
      ? 'bg-leaf-400/15 text-leaf-600'
      : 'bg-amber-400/15 text-brand-600'
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl bg-white p-4 shadow-soft"
    >
      <div className={`mb-1 inline-block rounded-full px-2.5 py-0.5 text-sm font-extrabold ${styles}`}>
        {title}
      </div>
      <p className="text-sm font-semibold text-ink-soft">{body}</p>
    </motion.div>
  )
}
