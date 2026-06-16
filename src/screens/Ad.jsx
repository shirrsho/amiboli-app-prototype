import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEnergy } from '../components/EnergyProvider'

// Mock interstitial ad shown on the Free plan — between finished scenes AND when
// a player leaves a scene early. No real ad SDK; it's a believable placeholder
// that (a) sells the "Free = ads" reality and (b) offers the Pro upgrade. Where
// it continues to is passed in via location state (`next`): finishing a scene →
// leaderboard, leaving early → back to the book. Defaults to the leaderboard.
const SKIP_SECONDS = 5

export default function Ad() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const energy = useEnergy()
  const next = state?.next ?? '/leaderboard'
  const [left, setLeft] = useState(SKIP_SECONDS)

  useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left])

  const done = left <= 0
  const finish = () => {
    // reward the user for watching (e.g. +1 energy), then continue. `nextState`
    // forwards data (like the scene timer) to the next screen.
    if (state?.reward === 'energy') energy?.addViaAd()
    navigate(next, state?.nextState ? { state: state.nextState } : undefined)
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0b0e1c] text-white">
      {/* top bar: label + skip/close */}
      <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
          Advertisement
        </span>
        <button
          onClick={finish}
          disabled={!done}
          className="grid h-9 min-w-[3.2rem] place-items-center rounded-full bg-white/10 px-3 text-sm font-extrabold backdrop-blur-md disabled:opacity-60"
        >
          {done ? '✕ Skip' : `${left}s`}
        </button>
      </div>

      {/* the "ad" creative */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          className="w-full max-w-xs rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 shadow-2xl"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
            className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-white/20 text-5xl backdrop-blur"
          >
            🧠
          </motion.div>
          <h2 className="mt-4 font-display text-2xl font-extrabold">BrightMind</h2>
          <p className="mt-1 text-sm font-semibold text-white/85">
            Daily brain games to keep your mind sharp. 5 minutes a day.
          </p>
          <div className="mt-3 flex items-center justify-center gap-1 text-sm font-bold text-white/90">
            ⭐️⭐️⭐️⭐️⭐️ <span className="text-white/70">4.8 · Free</span>
          </div>
          <div className="mt-4 w-full rounded-2xl bg-white py-3 font-display text-base font-extrabold text-indigo-600">
            Install
          </div>
          <p className="mt-2 text-[10px] font-semibold text-white/60">Sponsored · demo placement</p>
        </motion.div>
      </div>

      {/* bottom: go Pro to remove ads, then continue */}
      <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => navigate('/plans')}
          className="mb-2 w-full rounded-2xl border border-white/15 bg-white/5 py-3 text-sm font-extrabold text-white/90"
        >
          ✨ Tired of ads? Go Pro
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={finish}
          disabled={!done}
          className="w-full rounded-2xl bg-brand-500 py-3.5 font-display text-base font-extrabold text-white transition disabled:opacity-50"
        >
          {done ? 'Continue →' : `Continue in ${left}s`}
        </motion.button>
      </div>
    </div>
  )
}
