import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import Avatar from '../components/Avatar'
import { leaderboardUsers, leaderboardFilters, user } from '../data/dummyData'

const medals = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const [filter, setFilter] = useState('avg')

  // Re-sort by the active filter (all scores precomputed in dummy data).
  const ranked = useMemo(
    () => [...leaderboardUsers].sort((a, b) => b[filter] - a[filter]),
    [filter]
  )

  const formatScore = (u) =>
    filter === 'total' ? u.total.toLocaleString() : u[filter]
  const activeLabel = leaderboardFilters.find((f) => f.key === filter).label

  return (
    <Screen title="Leaderboard" subtitle="See how you stack up">
      {/* Pinned "my rank" card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-center gap-3 rounded-3xl bg-gradient-to-r from-brand-500 to-brand-600 p-4 text-white shadow-pop"
      >
        <div className="font-display text-3xl font-extrabold">#{user.rank}</div>
        <Avatar initials={user.initials} color="#ffffff33" size={44} ring />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-extrabold leading-tight">{user.name}</p>
          <p className="text-sm font-bold text-white/90">Avg {user.avgScore} · You</p>
        </div>
        <span className="text-3xl">🔥</span>
      </motion.div>

      {/* Filter chips */}
      <div className="no-scrollbar -mx-5 mb-3 flex gap-2 overflow-x-auto px-5 pb-1">
        {leaderboardFilters.map((f) => (
          <motion.button
            key={f.key}
            whileTap={{ scale: 0.92 }}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-extrabold transition ${
              filter === f.key
                ? 'bg-ink text-white shadow-soft'
                : 'bg-white text-ink-soft'
            }`}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* Ranked list */}
      <ul className="flex flex-col gap-2">
        {ranked.map((u, idx) => {
          const isTop3 = idx < 3
          return (
            <motion.li
              key={u.name}
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              className={`flex items-center gap-3 rounded-2xl p-3 ${
                u.isMe
                  ? 'bg-brand-50 ring-2 ring-brand-400'
                  : isTop3
                  ? 'bg-white shadow-soft'
                  : 'bg-white/70'
              }`}
            >
              <div className="w-7 text-center font-display text-lg font-extrabold text-ink-soft">
                {isTop3 ? medals[idx] : idx + 1}
              </div>
              <Avatar initials={u.initials} color={u.color} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-extrabold text-ink">
                  {u.name} {u.isMe && <span className="text-brand-600">(You)</span>}
                </p>
                <p className="text-xs font-bold text-ink-soft">
                  {activeLabel} {formatScore(u)} · Total {u.total.toLocaleString()}
                </p>
              </div>
              <div
                className={`font-display text-xl font-extrabold ${
                  isTop3 ? 'text-brand-600' : 'text-ink'
                }`}
              >
                {formatScore(u)}
              </div>
            </motion.li>
          )
        })}
      </ul>
    </Screen>
  )
}
