import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Celebratory streak-up animation for the result screen: the flame pops in,
// the count rolls from `from` → `to`, sparks burst outward, and a ring of the
// week's days lights up. Transforms/opacity only.
export default function StreakBurst({ from, to, color = '#FFD166' }) {
  const [n, setN] = useState(from)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setN(to)
      setBurst(true)
    }, 650)
    return () => clearTimeout(t)
  }, [to])

  const SPARKS = 12

  return (
    <div className="relative flex flex-col items-center py-2">
      {/* expanding glow on the increment */}
      <motion.div
        className="absolute top-1 h-32 w-32 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)`, opacity: 0.0 }}
        animate={burst ? { opacity: [0, 0.55, 0.2], scale: [0.5, 1.5, 1.2] } : {}}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />

      {/* spark particles */}
      <div className="absolute top-10">
        {burst &&
          Array.from({ length: SPARKS }).map((_, i) => {
            const a = (i / SPARKS) * Math.PI * 2
            const dist = 70 + (i % 3) * 14
            return (
              <motion.span
                key={i}
                className="absolute h-2 w-2 rounded-full"
                style={{ background: color, left: 0, top: 0 }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{ x: Math.cos(a) * dist, y: Math.sin(a) * dist, scale: 0.2, opacity: 0 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
              />
            )
          })}
      </div>

      {/* flame */}
      <motion.div
        initial={{ scale: 0, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 11 }}
        className="relative text-6xl leading-none"
      >
        <motion.span
          animate={burst ? { scale: [1, 1.35, 1], y: [0, -6, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          🔥
        </motion.span>
      </motion.div>

      {/* rolling count */}
      <div className="relative mt-1 flex h-[58px] items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={n}
            initial={{ y: 30, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 320, damping: 16 }}
            className="font-display text-[52px] font-extrabold leading-none"
            style={{ color }}
          >
            {n}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="font-display text-base font-extrabold uppercase tracking-[0.18em]"
        style={{ color }}
      >
        Day streak!
      </motion.p>

      {/* week dots — the newest day lights up last */}
      <div className="mt-3 flex gap-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const lit = i < to
          return (
            <motion.span
              key={i}
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: lit ? color : 'rgba(255,255,255,0.15)' }}
              initial={lit ? { scale: 0 } : {}}
              animate={lit ? { scale: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.07, type: 'spring', stiffness: 400, damping: 14 }}
            />
          )
        })}
      </div>
    </div>
  )
}
