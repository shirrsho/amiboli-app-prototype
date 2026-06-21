import { motion } from 'framer-motion'

// ─── Ami, the Amiboli mascot ────────────────────────────────────────────────
// A single teal book character (brand v2). Used sparingly — as the app logo
// and on a few static/welcome screens — NOT throughout the app. Per brand the
// art is FLAT (no glow/shadow/recolour/stretch); we only add a gentle bob.
//
//   <Mascot mood="happy" size={120} float />
//
// moods: happy · sad · excited · celebrating · thinking · talking · sleeping
const MOODS = new Set([
  'happy',
  'sad',
  'excited',
  'celebrating',
  'thinking',
  'talking',
  'sleeping',
])

export default function Mascot({ mood = 'happy', size = 96, float = false, className = '', style, alt }) {
  const m = MOODS.has(mood) ? mood : 'happy'
  const src = `/mascots/book-teal/book-${m}.svg`
  const img = (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt ?? `Ami the book — ${m}`}
      draggable={false}
      className="block select-none"
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )

  if (!float) {
    return (
      <span className={className} style={style}>
        {img}
      </span>
    )
  }

  return (
    <motion.span
      className={className}
      style={style}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {img}
    </motion.span>
  )
}
