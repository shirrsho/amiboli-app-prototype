import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Lightweight in-memory toast system. Used for all non-functional actions
// ("Story mode coming soon", "Upgrade coming soon", etc.). No persistence.
const ToastContext = createContext(() => {})

export const useToast = () => useContext(ToastContext)

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, emoji = '✨') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, emoji }])
    // auto-dismiss
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 2200)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {/* Toast stack pinned above the tab bar, centered in the phone frame */}
      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex flex-col items-center gap-2 px-6">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white shadow-soft"
            >
              <span className="text-base">{t.emoji}</span>
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
