import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Mascot from '../components/Mascot'

// 3-slide swipeable onboarding. Reachable but skippable (Skip → Auth).
// Ami (the mascot) guides each slide with a fitting mood.
const slides = [
  {
    mood: 'talking',
    title: 'Live the story',
    body: 'Step inside classic tales and become part of the adventure.',
    bg: 'from-brand-400 to-brand-600',
  },
  {
    mood: 'thinking',
    title: 'Speak to move forward',
    body: 'Say your lines out loud — your voice drives the story onward.',
    bg: 'from-teal to-teal-dark',
  },
  {
    mood: 'celebrating',
    title: 'Get scored & climb',
    body: 'Earn XP on every line and rise up the leaderboard.',
    bg: 'from-slate to-brand-900',
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [i, setI] = useState(0)
  const last = i === slides.length - 1

  const next = () => (last ? navigate('/auth') : setI((v) => v + 1))

  return (
    <div className={`flex h-full flex-col bg-gradient-to-br ${slides[i].bg} text-white transition-colors duration-500`}>
      {/* Skip */}
      <div className="flex justify-end px-5 pt-[max(1rem,env(safe-area-inset-top))]">
        <button onClick={() => navigate('/auth')} className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold">
          Skip
        </button>
      </div>

      {/* Swipeable slide */}
      <div className="flex flex-1 items-center justify-center overflow-hidden px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) next()
              else if (info.offset.x > 60 && i > 0) setI((v) => v - 1)
            }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="flex cursor-grab flex-col items-center text-center active:cursor-grabbing"
          >
            <div className="mb-8 grid h-48 w-48 place-items-center rounded-[2.5rem] bg-white/15 backdrop-blur">
              <Mascot mood={slides[i].mood} size={170} float />
            </div>
            <h2 className="font-display text-3xl font-extrabold">{slides[i].title}</h2>
            <p className="mt-3 max-w-xs font-body text-lg font-semibold text-white/90">{slides[i].body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots + CTA */}
      <div className="px-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="mb-6 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <motion.span
              key={idx}
              animate={{ width: idx === i ? 28 : 8, opacity: idx === i ? 1 : 0.5 }}
              className="h-2 rounded-full bg-white"
            />
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={next}
          className="w-full rounded-2xl bg-white py-4 font-display text-lg font-extrabold text-ink shadow-soft"
        >
          {last ? 'Get started' : 'Next'}
        </motion.button>
      </div>
    </div>
  )
}
