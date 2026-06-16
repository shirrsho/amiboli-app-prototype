import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import { user } from '../data/dummyData'

// Home status bar: streak, energy, bell, avatar. Dark frosted pills that stay
// readable floating over any book theme (dark London or light Southern).
export default function HomeTopBar({ onOpenNotifications }) {
  const navigate = useNavigate()
  const pill =
    'flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1.5 text-white backdrop-blur-md'

  return (
    <header className="flex items-center justify-between gap-2 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className={pill}>
        <span className="text-lg">🔥</span>
        <span className="font-display font-extrabold">{user.streak}</span>
      </div>

      <div className={pill}>
        {Array.from({ length: user.energy.max }).map((_, i) => (
          <span key={i} className={`text-lg ${i < user.energy.current ? '' : 'opacity-30 grayscale'}`}>
            ⚡
          </span>
        ))}
        <span className="ml-0.5 font-display font-extrabold">
          {user.energy.current}/{user.energy.max}
        </span>
      </div>

      <div className="flex-1" />

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onOpenNotifications}
        className="relative grid h-10 w-10 place-items-center rounded-full bg-black/35 backdrop-blur-md"
        aria-label="Notifications"
      >
        <span className="text-lg">🔔</span>
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-black/40" />
      </motion.button>

      <motion.button whileTap={{ scale: 0.85 }} onClick={() => navigate('/profile')} aria-label="Profile">
        <Avatar initials={user.initials} color={user.avatarColor} size={40} ring />
      </motion.button>

      {/* Settings lives in the top-right corner (moved off the bottom tab bar) */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => navigate('/settings')}
        className="grid h-10 w-10 place-items-center rounded-full bg-black/35 text-lg backdrop-blur-md"
        aria-label="Settings"
      >
        ⚙️
      </motion.button>
    </header>
  )
}
