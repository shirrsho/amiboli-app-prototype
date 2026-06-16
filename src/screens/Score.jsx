import { useMemo } from 'react'
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Scenery from '../components/story/Scenery'
import { WaxSeal } from '../components/story/SceneNodes'
import StreakBurst from '../components/StreakBurst'
import { getPlayableScene } from '../data/scenes'
import { getBookById, user, skills } from '../data/dummyData'
import { getTheme } from '../data/bookThemes'

// Detailed score page shown right after a scene finishes (/score/:bookId/:sceneId).
// Scores are deterministic from the scene's user-turn data, so this page is
// robust even on refresh / deep-link. `elapsed` is passed from Play when present.
const COACH = {
  relevance: 'Keep each line tied to what is happening — you drifted once or twice.',
  smoothness: 'Your pauses got shorter as the scene went on — keep it up.',
  clarity: 'Shape the long words a little more — your clarity will jump.',
  grammar: 'Watch your tenses in the fast moments — slow down half a beat.',
}

export default function Score() {
  const { bookId, sceneId } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()

  const scene = getPlayableScene(bookId, sceneId)
  const book = getBookById(bookId)
  if (!scene || !book) return <Navigate to="/home" replace />

  const theme = getTheme(book.themeId)
  const p = theme.palette

  // Aggregate the four skills across every user turn in the scene.
  const { averages, sceneAvg, turns, best } = useMemo(() => {
    const t = scene.beats.filter((b) => b.type === 'user_turn' && b.simulated)
    const avg = {}
    skills.forEach((s) => {
      avg[s.key] = Math.round(t.reduce((a, b) => a + b.simulated.scores[s.key], 0) / t.length)
    })
    const sAvg = Math.round(
      t.reduce((a, b) => a + Object.values(b.simulated.scores).reduce((x, y) => x + y, 0) / 4, 0) /
        t.length
    )
    const bestBeat = scene.beats.find((b) => b.simulated?.isBigMoment) || t[t.length - 1]
    return { averages: avg, sceneAvg: sAvg, turns: t, best: bestBeat }
  }, [scene])

  const weakest = skills.reduce((a, b) => (averages[a.key] <= averages[b.key] ? a : b))
  const pointsEarned = sceneAvg * 4 // simple XP from this scene
  const newTotal = user.totalScore + pointsEarned
  const elapsed = state?.elapsed ?? 168
  const time = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`
  const newStreak = user.streak + 1 // completing the scene extends the streak

  const Card = ({ children, delay = 0, className = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`rounded-3xl border p-4 backdrop-blur-md ${className}`}
      style={{ background: p.panel, borderColor: p.panelBorder }}
    >
      {children}
    </motion.div>
  )

  return (
    <div className="relative flex h-full flex-col" style={{ background: p.bgDeep }}>
      <Scenery theme={theme} ambient={false} />
      {/* darken the scenery so the cards read clearly */}
      <div className="absolute inset-0" style={{ background: 'rgba(6,9,18,0.55)' }} />

      <main className="no-scrollbar relative z-10 flex-1 overflow-y-auto px-5 pb-32 pt-[max(1.5rem,env(safe-area-inset-top))]">
        {/* ── Hero: streak increases (the celebration) ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-3xl border p-4 backdrop-blur-md"
          style={{ background: p.panel, borderColor: p.panelBorder }}
        >
          <StreakBurst from={user.streak} to={newStreak} color={p.accent} />
        </motion.div>

        {/* ── Result: the seal stamps the average ── */}
        <div className="flex flex-col items-center pt-2 text-center">
          <motion.div
            initial={{ scale: 2.4, opacity: 0, rotate: -16 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 15, delay: 0.1 }}
          >
            <WaxSeal score={sceneAvg} color={theme.sealColor} size={104} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 font-serif text-3xl font-bold"
            style={{ color: p.textOnBg }}
          >
            Scene sealed
          </motion.h1>
          <p className="mt-1 text-sm font-bold" style={{ color: p.textMuted }}>
            Scene {scene.sceneNumber} · {scene.title}
          </p>
          {/* quick facts */}
          <div className="mt-3 flex items-center gap-2">
            <Fact label="Time" value={time} p={p} />
            <Fact label="Energy" value="−1 ⚡" p={p} />
            <Fact label="Turns" value={turns.length} p={p} />
          </div>
        </div>

        {/* ── Score earned ── */}
        <div className="mt-5">
          <Card delay={0.15}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em]" style={{ color: p.accent }}>
                  Score earned
                </p>
                <p className="font-display text-3xl font-extrabold" style={{ color: p.textOnBg }}>
                  +{pointsEarned.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold" style={{ color: p.textMuted }}>
                  Total score
                </p>
                <p className="font-display text-lg font-extrabold" style={{ color: p.textOnBg }}>
                  {user.totalScore.toLocaleString()} → {newTotal.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-black/20 px-3 py-2">
              <span className="text-lg">🔥</span>
              <span className="text-[13px] font-extrabold" style={{ color: p.textOnBg }}>
                Streak extended to {newStreak} days
              </span>
            </div>
          </Card>
        </div>

        {/* ── Skill breakdown vs your profile ── */}
        <div className="mt-3">
          <Card delay={0.2}>
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em]" style={{ color: p.accent }}>
              How you spoke
            </p>
            <div className="flex flex-col gap-3">
              {skills.map((s) => {
                const v = averages[s.key]
                const delta = v - user.scores[s.key]
                return (
                  <div key={s.key}>
                    <div className="mb-1 flex items-center justify-between text-[12px] font-extrabold">
                      <span style={{ color: p.textOnBg }}>
                        {s.emoji} {s.label}
                      </span>
                      <span className="flex items-center gap-2">
                        <span style={{ color: p.textOnBg }}>{v}</span>
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[9px]"
                          style={{
                            background: delta >= 0 ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                            color: delta >= 0 ? '#4ADE80' : '#FCA5A5',
                          }}
                        >
                          {delta >= 0 ? `+${delta}` : delta} vs avg
                        </span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: s.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${v}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* ── Best moment ── */}
        {best?.simulated && (
          <div className="mt-3">
            <Card delay={0.25}>
              <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em]" style={{ color: p.accent }}>
                ✨ Your best line
              </p>
              <p className="font-serif text-[16px] italic leading-snug" style={{ color: p.textOnBg }}>
                “{best.simulated.transcript}”
              </p>
              <p className="mt-1.5 text-[12px] font-bold" style={{ color: p.textMuted }}>
                {best.simulated.npcReaction}
              </p>
            </Card>
          </div>
        )}

        {/* ── Coaching ── */}
        <div className="mt-3">
          <Card delay={0.3} className="flex gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="text-[12px] font-extrabold" style={{ color: p.textOnBg }}>
                Work on {weakest.label.toLowerCase()} next
              </p>
              <p className="font-serif text-[13px] italic leading-snug" style={{ color: p.textMuted }}>
                {COACH[weakest.key]}
              </p>
            </div>
          </Card>
        </div>

        {/* ── Rank nudge ── */}
        <button onClick={() => navigate('/leaderboard')} className="mt-3 w-full text-left">
          <Card delay={0.35} className="flex items-center gap-3">
            <span className="font-display text-2xl font-extrabold" style={{ color: p.accent }}>
              #{user.rank}
            </span>
            <div className="flex-1">
              <p className="text-[13px] font-extrabold" style={{ color: p.textOnBg }}>
                You’re #{user.rank} on the leaderboard
              </p>
              <p className="text-[11px] font-bold" style={{ color: p.textMuted }}>
                Two more strong scenes could put you in the top 12 →
              </p>
            </div>
          </Card>
        </button>
      </main>

      {/* ── Sticky actions ── */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 flex gap-2 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
        style={{ background: `linear-gradient(to top, ${p.bgDeep}, transparent)` }}
      >
        <button
          onClick={() => navigate(`/play/${book.id}/${scene.id}`)}
          className="rounded-2xl border px-5 py-3.5 text-sm font-extrabold"
          style={{ borderColor: p.panelBorder, color: p.textOnBg }}
        >
          Replay
        </button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(`/book/${book.id}`)}
          className="flex-1 rounded-2xl py-3.5 font-display text-base font-extrabold"
          style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accentDeep})`, color: p.ctaText }}
        >
          Back to the story →
        </motion.button>
      </div>
    </div>
  )
}

function Fact({ label, value, p }) {
  return (
    <div className="rounded-xl border px-3 py-1.5 text-center" style={{ borderColor: p.panelBorder, background: p.panel }}>
      <p className="text-[9px] font-extrabold uppercase tracking-wide" style={{ color: p.textMuted }}>
        {label}
      </p>
      <p className="text-[13px] font-extrabold" style={{ color: p.textOnBg }}>
        {value}
      </p>
    </div>
  )
}
