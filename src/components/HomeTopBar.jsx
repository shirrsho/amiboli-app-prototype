import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import { user } from '../data/dummyData'

// Home header: streak flame, energy bolts, bell, avatar.
export default function HomeTopBar({ onOpenNotifications }) {
  const navigate = useNavigate()
  return (
    <header className="z-20 flex shrink-0 items-center justify-between gap-2 bg-cream/90 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
      {/* Streak */}
      <Stat>
        <motion.span
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="text-lg"
        >
          🔥
        </motion.span>
        <span className="font-display font-extrabold text-ink">{user.streak}</span>
      </Stat>

      {/* Energy bolts */}
      <Stat>
        {Array.from({ length: user.energy.max }).map((_, i) => (
          <span key={i} className={`text-lg ${i < user.energy.current ? '' : 'opacity-25 grayscale'}`}>
            ⚡
          </span>
        ))}
        <span className="ml-0.5 font-display font-extrabold text-ink">
          {user.energy.current}/{user.energy.max}
        </span>
      </Stat>

      <div className="flex-1" />

      {/* Bell */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onOpenNotifications}
        className="relative grid h-10 w-10 place-items-center rounded-full bg-white shadow-soft"
        aria-label="Notifications"
      >
        <span className="text-lg">🔔</span>
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
      </motion.button>

      {/* Avatar → profile */}
      <motion.button whileTap={{ scale: 0.85 }} onClick={() => navigate('/profile')} aria-label="Profile">
        <Avatar initials={user.initials} color={user.avatarColor} size={40} ring />
      </motion.button>
    </header>
  )
}

function Stat({ children }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 shadow-soft">
      {children}
    </div>
  )
}
