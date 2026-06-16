import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

// Icon-only bottom navigation. Settings moved to the Home top-right corner.
// Labels live in aria-label for accessibility; the active tab gets a dot.
const tabs = [
  { to: '/home', label: 'Home', icon: '🏠' },
  { to: '/store', label: 'Store', icon: '🛍️' },
  { to: '/leaderboard', label: 'Ranks', icon: '🏆' },
  { to: '/profile', label: 'Profile', icon: '🧑' },
  { to: '/plans', label: 'Plans', icon: '⚡' },
]

export default function BottomTabBar() {
  const { pathname } = useLocation()
  return (
    <nav className="z-30 shrink-0 border-t border-black/5 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <ul className="flex items-stretch justify-around">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.to)
          return (
            <li key={tab.to} className="flex-1">
              <NavLink to={tab.to} aria-label={tab.label} className="block">
                <motion.div whileTap={{ scale: 0.82 }} className="flex flex-col items-center gap-1 py-1">
                  <motion.span
                    animate={active ? { y: -1, scale: 1.22 } : { y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    className={`text-[26px] leading-none ${active ? '' : 'grayscale-[45%] opacity-50'}`}
                  >
                    {tab.icon}
                  </motion.span>
                  {/* active indicator dot (replaces the removed text label) */}
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-brand-500"
                    animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  />
                </motion.div>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
