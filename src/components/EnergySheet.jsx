import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEnergy } from './EnergyProvider'

// Top sheet that drops down when the energy pill is tapped. Shows current
// energy and a "watch an ad to add 1 ⚡" action (Free: up to 2 ads a day).
export default function EnergySheet({ open, onClose }) {
  const navigate = useNavigate()
  const { current, max, isFull, canWatch, adsLeft, adsPerDay, limitReached } = useEnergy()

  const watchAd = () => {
    onClose()
    // Reuse the Ad screen; on finish it adds the energy and returns home.
    navigate('/ad/energy/reward', { state: { reward: 'energy', next: '/home' } })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-ink/40"
          />
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute inset-x-0 top-0 z-50 rounded-b-4xl bg-white px-5 pb-5 pt-[max(1rem,env(safe-area-inset-top))] shadow-soft"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-extrabold text-ink">Energy</h2>
              <button
                onClick={onClose}
                className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-600"
              >
                Close
              </button>
            </div>

            {/* big bolts + status */}
            <div className="flex items-center gap-3 rounded-2xl bg-cream p-4">
              <div className="flex gap-1">
                {Array.from({ length: max }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={i < current ? { scale: [1, 1.25, 1] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`text-3xl ${i < current ? '' : 'opacity-25 grayscale'}`}
                  >
                    ⚡
                  </motion.span>
                ))}
              </div>
              <div>
                <p className="font-display text-lg font-extrabold text-ink">
                  {current}/{max} energy
                </p>
                <p className="text-xs font-bold text-ink-soft">Each scene costs 1 ⚡ · refills over time</p>
              </div>
            </div>

            {/* watch-ad action */}
            <motion.button
              whileTap={canWatch ? { scale: 0.97 } : {}}
              onClick={canWatch ? watchAd : undefined}
              disabled={!canWatch}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-display text-base font-extrabold text-white"
              style={{
                background: canWatch
                  ? 'linear-gradient(135deg, #7C5CDB, #4A35B0)'
                  : '#C7BFE0',
              }}
            >
              {isFull
                ? 'Energy full ⚡'
                : limitReached
                ? "You're out of ad energy for today"
                : `▶︎ Watch an ad for +1 ⚡ · ${adsLeft} left today`}
            </motion.button>
            <p className="mt-2 text-center text-xs font-semibold text-ink-soft/70">
              {isFull
                ? 'Your bolts are topped up.'
                : limitReached
                ? `Free: up to ${adsPerDay} energy ads a day. Come back tomorrow — or go Pro for unlimited energy.`
                : `Free: up to ${adsPerDay} energy ads a day — or go Pro for unlimited energy.`}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
