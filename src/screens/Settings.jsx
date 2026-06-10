import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Screen from '../components/Screen'
import DownloadButton from '../components/DownloadButton'
import { useToast } from '../components/ToastProvider'
import { appVersion } from '../data/dummyData'

export default function Settings() {
  const navigate = useNavigate()
  const showToast = useToast()
  // Toggles are UI-only, kept in memory (reset on refresh).
  const [notifications, setNotifications] = useState(true)
  const [sound, setSound] = useState(true)

  return (
    <Screen title="Settings">
      {/* Install / download the app as a PWA */}
      <div className="mb-3">
        <DownloadButton variant="row" />
      </div>

      {/* Group: account */}
      <Group>
        <Row icon="👤" label="Account" onClick={() => showToast('Account settings coming soon', '👤')} />
        <Row
          icon="🔔"
          label="Notifications"
          right={<Toggle on={notifications} onClick={() => setNotifications((v) => !v)} />}
        />
        <Row
          icon="🔊"
          label="Sound effects"
          right={<Toggle on={sound} onClick={() => setSound((v) => !v)} />}
        />
        <Row icon="🌐" label="Language" value="English" onClick={() => showToast('More languages coming soon', '🌐')} />
      </Group>

      {/* Group: legal */}
      <Group>
        <Row icon="🛡️" label="Privacy Policy" onClick={() => showToast('Opens policy page', '🛡️')} />
        <Row icon="📄" label="Terms of Service" onClick={() => showToast('Opens terms page', '📄')} />
      </Group>

      {/* Log out → back to auth */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/auth')}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 p-4 font-display text-lg font-extrabold text-red-500"
      >
        🚪 Log out
      </motion.button>

      <p className="mt-6 text-center text-sm font-bold text-ink-soft/50">{appVersion}</p>
    </Screen>
  )
}

function Group({ children }) {
  return (
    <div className="mb-3 overflow-hidden rounded-3xl bg-white shadow-soft">
      {children}
    </div>
  )
}

// Uses a div (not a button) so rows with a nested Toggle button stay valid DOM.
function Row({ icon, label, value, right, onClick }) {
  const interactive = !!onClick
  return (
    <motion.div
      whileTap={interactive ? { scale: 0.98 } : {}}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      className={`flex w-full items-center gap-3 border-b border-black/5 px-4 py-3.5 last:border-0 ${
        interactive ? 'cursor-pointer' : ''
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1 text-left font-extrabold text-ink">{label}</span>
      {value && <span className="text-sm font-bold text-ink-soft">{value}</span>}
      {right ?? (interactive && <span className="text-ink-soft">›</span>)}
    </motion.div>
  )
}

// Non-functional toggle (visual state only).
function Toggle({ on, onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`relative h-7 w-12 rounded-full transition-colors ${on ? 'bg-brand-500' : 'bg-black/15'}`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 32 }}
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow ${on ? 'right-0.5' : 'left-0.5'}`}
      />
    </button>
  )
}
