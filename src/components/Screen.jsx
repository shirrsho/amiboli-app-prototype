import { motion } from 'framer-motion'

// Standard scrollable screen body with a smooth fade/slide-in transition.
// `title` renders a sticky header; pass `headerRight` for trailing actions.
export default function Screen({ title, subtitle, headerRight, children, className = '' }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {title && (
        <header className="z-20 flex shrink-0 items-center justify-between gap-3 bg-cream/90 px-5 pb-3 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink">{title}</h1>
            {subtitle && <p className="text-sm font-semibold text-ink-soft">{subtitle}</p>}
          </div>
          {headerRight}
        </header>
      )}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className={`no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-6 ${className}`}
      >
        {children}
      </motion.main>
    </div>
  )
}
