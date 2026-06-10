import { AnimatePresence, motion } from 'framer-motion'
import { notifications } from '../data/dummyData'

// Bottom sheet of dummy notifications, opened by the bell on Home.
export default function NotificationsSheet({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-ink/40"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute inset-x-0 bottom-0 z-50 max-h-[80%] overflow-hidden rounded-t-4xl bg-white shadow-soft"
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-5 pb-2 pt-3">
                <div className="mx-auto h-1.5 w-12 rounded-full bg-black/10" />
              </div>
              <div className="flex items-center justify-between px-5 pb-3">
                <h2 className="font-display text-xl font-extrabold text-ink">Notifications</h2>
                <button
                  onClick={onClose}
                  className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-600"
                >
                  Close
                </button>
              </div>
              <ul className="no-scrollbar overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                {notifications.map((n, i) => (
                  <motion.li
                    key={n.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`mb-2 flex gap-3 rounded-2xl p-3 ${
                      n.urgent ? 'bg-red-50' : 'bg-cream'
                    }`}
                  >
                    <span className="text-2xl">{n.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold leading-tight text-ink">{n.title}</p>
                      <p className="text-sm text-ink-soft">{n.body}</p>
                      <p className="mt-1 text-xs font-bold text-ink-soft/60">{n.time}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
