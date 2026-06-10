import { motion } from 'framer-motion'
import ChapterNode from './ChapterNode'

// Renders one Book: a decorative header + a winding vertical path of chapters.
// Locked books collapse to a single lock card.
export default function BookSection({ book, index, onChapterTap }) {
  const completed = book.chapters.filter((c) => c.status === 'completed').length
  const total = book.chapters.length

  if (book.locked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-6 w-full max-w-[340px] rounded-3xl border-2 border-dashed border-black/10 bg-white/60 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-black/5 text-2xl grayscale">
            {book.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-soft/60">
              Book {index + 1}
            </p>
            <p className="truncate font-display font-extrabold text-ink-soft">{book.title}</p>
          </div>
          <span className="text-xl">🔒</span>
        </div>
        <p className="mt-2 text-center text-xs font-bold text-ink-soft/70">
          Complete previous books to unlock
        </p>
      </motion.div>
    )
  }

  return (
    <section className="mb-4">
      {/* Decorative book header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        className="mx-auto mb-4 w-full max-w-[360px] overflow-hidden rounded-3xl shadow-soft"
        style={{ background: `linear-gradient(135deg, ${book.accent}, ${book.accent}cc)` }}
      >
        <div className="flex items-center gap-3 p-4 text-white">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/25 text-3xl backdrop-blur">
            {book.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-white/80">
              Book {index + 1}
            </p>
            <h2 className="truncate font-display text-lg font-extrabold leading-tight">{book.title}</h2>
            <p className="text-sm font-bold text-white/90">
              {completed}/{total} chapters
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 w-full bg-black/15">
          <motion.div
            className="h-full rounded-r-full bg-white"
            initial={{ width: 0 }}
            whileInView={{ width: `${(completed / total) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Winding path of chapters */}
      <div className="relative flex flex-col items-center gap-6 py-2">
        {book.chapters.map((ch, i) => {
          // Alternate horizontal offset to create the winding look.
          const wave = [0, 56, 0, -56]
          const offsetX = wave[i % wave.length]
          const nextOffset = wave[(i + 1) % wave.length]
          return (
            <div key={ch.id} className="relative flex w-full flex-col items-center">
              <ChapterNode
                chapter={ch}
                accent={book.accent}
                offsetX={offsetX}
                onTap={() => onChapterTap(ch)}
              />
              {/* Dotted connector to the next node */}
              {i < book.chapters.length - 1 && (
                <Connector from={offsetX} to={nextOffset} accent={book.accent} done={ch.status === 'completed'} />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// A slanted dotted line connecting two staggered nodes.
function Connector({ from, to, accent, done }) {
  const dx = to - from
  return (
    <div className="pointer-events-none relative h-6 w-full" style={{ transform: `translateX(${from + dx / 2}px)` }}>
      <svg width="120" height="28" className="absolute left-1/2 -translate-x-1/2 overflow-visible">
        <line
          x1={60 - dx / 2}
          y1={0}
          x2={60 + dx / 2}
          y2={26}
          stroke={done ? accent : '#D9D2C9'}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="2 12"
        />
      </svg>
    </div>
  )
}
