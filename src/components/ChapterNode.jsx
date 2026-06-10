import { motion } from 'framer-motion'

// A single chapter node on the winding path.
// status: 'completed' | 'current' | 'locked'. Tapping is non-functional —
// it only bounces and fires a toast (handled by parent).
export default function ChapterNode({ chapter, accent, offsetX, onTap }) {
  const { status, score } = chapter
  const isCurrent = status === 'current'
  const isCompleted = status === 'completed'

  return (
    <div className="relative flex w-full justify-center" style={{ transform: `translateX(${offsetX}px)` }}>
      {/* Glow halo for the current chapter */}
      {isCurrent && (
        <motion.span
          className="absolute -inset-3 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,138,31,0.45), transparent 70%)' }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.3, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}

      <motion.button
        whileTap={{ scale: 0.88 }}
        animate={isCurrent ? { y: [0, -6, 0] } : {}}
        transition={isCurrent ? { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } : {}}
        onClick={onTap}
        className="relative grid place-items-center rounded-full"
        style={{
          width: isCurrent ? 84 : 64,
          height: isCurrent ? 84 : 64,
          background: isCompleted
            ? `linear-gradient(145deg, #FFD56A, ${accent})`
            : isCurrent
            ? 'linear-gradient(145deg, #FF9A33, #F2730A)'
            : '#E7E1DA',
          boxShadow: status === 'locked' ? 'none' : '0 6px 0 0 rgba(0,0,0,0.12)',
        }}
        aria-label={`${chapter.title} (${status})`}
      >
        <span className={`text-2xl ${isCurrent ? 'text-3xl' : ''}`}>
          {isCompleted ? '⭐' : isCurrent ? '▶️' : '🔒'}
        </span>

        {/* Score badge for completed chapters */}
        {isCompleted && score != null && (
          <span className="absolute -bottom-2 -right-1 rounded-full bg-white px-1.5 py-0.5 text-xs font-extrabold text-leaf-600 shadow-soft">
            {score}
          </span>
        )}

        {/* "Continue" pill for current chapter */}
        {isCurrent && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-7 whitespace-nowrap rounded-full bg-brand-600 px-3 py-1 text-xs font-extrabold text-white shadow-pop"
          >
            Continue ✨
          </motion.span>
        )}
      </motion.button>
    </div>
  )
}
