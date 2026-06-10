import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Animated logo splash. Auto-advances to Home after ~2s.
// Onboarding/Auth remain reachable but are skipped by default (pre-logged-in).
export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/home'), 2100)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-400 to-brand-600 text-white">
      {/* Floating background blobs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{ width: 120 + i * 40, height: 120 + i * 40, left: `${i * 18}%`, top: `${(i * 23) % 80}%` }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 4 + i, ease: 'easeInOut' }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="grid h-28 w-28 place-items-center rounded-[2rem] bg-white shadow-2xl"
      >
        <span className="font-display text-6xl font-extrabold text-brand-600">A</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 font-display text-5xl font-extrabold tracking-tight"
      >
        Amiboli
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-1 font-body font-bold text-white/90"
      >
        Live the story. Speak it out loud.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 flex gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-white"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  )
}
