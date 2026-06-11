import { motion } from 'framer-motion'

// Hero card at the top of a Book screen.
//   in progress → "Previously, in <book>" recap + "Continue · Scene N"
//   not started → "Your story begins" intro ("You arrive as…") + "Begin Scene 1"
export default function StoryCard({ book, theme, started, currentSceneNo, onCta }) {
  const p = theme.palette
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border p-5 backdrop-blur-sm"
      style={{ background: p.panel, borderColor: p.panelBorder, boxShadow: '0 16px 36px -18px rgba(0,0,0,0.5)' }}
    >
      <p className="text-[11px] font-extrabold uppercase tracking-[0.22em]" style={{ color: p.accent }}>
        {started ? `Previously, in ${book.title}` : 'Your story begins'}
      </p>

      <p className="mt-2.5 font-serif text-[17px] leading-relaxed" style={{ color: p.textOnBg }}>
        {started ? book.recapText : book.introText}
      </p>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onCta}
        className="mt-4 w-full rounded-2xl py-3.5 font-display text-base font-extrabold"
        style={{
          background: `linear-gradient(135deg, ${p.accent}, ${p.accentDeep})`,
          color: p.ctaText,
          boxShadow: `0 10px 22px -10px ${p.glow}`,
        }}
      >
        {started ? `Continue · Scene ${currentSceneNo}` : 'Begin Scene 1'}
      </motion.button>
    </motion.section>
  )
}
