import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from './ToastProvider'
import { usePwaInstall, promptInstall, isIOS, isStandalone } from '../lib/pwaInstall'

// "Download" button → installs Amiboli as a PWA (Add to Home Screen).
// On Chrome/Android/desktop it fires the native install prompt; on iOS or when
// the prompt isn't ready yet, it opens a short instructions sheet.
// variant: 'fab' (floating pill) | 'row' (settings list row).
export default function DownloadButton({ variant = 'fab' }) {
  const { canInstall } = usePwaInstall()
  const showToast = useToast()
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleClick = async () => {
    if (isStandalone) {
      showToast('App already installed', '✅')
      return
    }
    if (canInstall) {
      const outcome = await promptInstall()
      if (outcome === 'accepted') showToast('Installing Amiboli…', '🎉')
      else if (outcome === 'dismissed') showToast('Maybe next time!', '👍')
      else setSheetOpen(true) // 'unavailable' → show manual steps
      return
    }
    // No native prompt available (iOS, not-yet-eligible, or dev server).
    setSheetOpen(true)
  }

  return (
    <>
      {variant === 'fab' ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleClick}
          className="absolute bottom-[5.5rem] right-4 z-40 flex items-center gap-2 rounded-full bg-ink px-4 py-3 font-display text-sm font-extrabold text-white shadow-soft"
          aria-label="Download Amiboli"
        >
          <motion.span
            animate={{ y: [0, 2, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="text-base"
          >
            ⬇️
          </motion.span>
          Download
        </motion.button>
      ) : (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleClick}
          className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 p-4 text-left font-display text-lg font-extrabold text-white shadow-pop"
        >
          <span className="text-xl">⬇️</span>
          <span className="flex-1">Download app</span>
          <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-xs font-extrabold">
            Install
          </span>
        </motion.button>
      )}

      <InstallSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  )
}

// Bottom sheet with platform-specific "Add to Home Screen" steps.
function InstallSheet({ open, onClose }) {
  const steps = isIOS
    ? [
        'Tap the Share button ⤴ in Safari',
        "Choose “Add to Home Screen”",
        'Tap “Add” — Amiboli lands on your home screen',
      ]
    : [
        'Open Amiboli in Chrome or Edge',
        'Open the browser menu (⋮)',
        'Tap “Install app” / “Add to Home screen”',
      ]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-ink/40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-4xl bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-soft"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-black/10" />
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-2xl">📲</div>
              <div>
                <h2 className="font-display text-xl font-extrabold text-ink">Install Amiboli</h2>
                <p className="text-sm font-semibold text-ink-soft">Add it to your home screen</p>
              </div>
            </div>

            <ol className="flex flex-col gap-2">
              {steps.map((s, i) => (
                <li key={i} className="flex items-center gap-3 rounded-2xl bg-cream p-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-500 font-display text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-ink">{s}</span>
                </li>
              ))}
            </ol>

            <p className="mt-3 text-center text-xs font-semibold text-ink-soft/70">
              Tip: the one-tap install prompt appears automatically in supported browsers.
            </p>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="mt-4 w-full rounded-2xl bg-ink py-3.5 font-display text-base font-extrabold text-white"
            >
              Got it
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
