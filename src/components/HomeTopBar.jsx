import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import { useEnergy } from './EnergyProvider'
import { user } from '../data/dummyData'

// Home status bar (left → right): energy, streak … bell, avatar.
// Energy is tappable (opens the top energy sheet). The avatar in the top-right
// corner now opens Settings. Dark frosted pills read over any book theme.
export default function HomeTopBar({ onOpenNotifications, onOpenEnergy }) {
  const navigate = useNavigate()
  const { current, max } = useEnergy()
  const pill =
    'flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1.5 text-white backdrop-blur-md'

  return (
    <header className="flex items-center justify-between gap-2 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
      {/* Energy — tap to open the energy sheet */}
      <motion.button whileTap={{ scale: 0.9 }} onClick={onOpenEnergy} className={pill} aria-label="Energy">
        {Array.from({ length: max }).map((_, i) => (
          <span key={i} className={`text-lg ${i < current ? '' : 'opacity-30 grayscale'}`}>
            ⚡
          </span>
        ))}
        <span className="ml-0.5 font-display font-extrabold">
          {current}/{max}
        </span>
        <span className="ml-0.5 text-xs opacity-70">＋</span>
      </motion.button>

      {/* Streak */}
      <div className={pill}>
        <span className="text-lg">🔥</span>
        <span className="font-display font-extrabold">{user.streak}</span>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onOpenNotifications}
        className="relative grid h-10 w-10 place-items-center rounded-full bg-black/35 backdrop-blur-md"
        aria-label="Notifications"
      >
        <span className="text-lg">🔔</span>
        <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-black/40" />
      </motion.button>

      {/* Avatar in the corner → Settings */}
      <motion.button whileTap={{ scale: 0.85 }} onClick={() => navigate('/settings')} aria-label="Settings">
        <Avatar initials={user.initials} color={user.avatarColor} size={40} ring />
      </motion.button>
    </header>
  )
}
