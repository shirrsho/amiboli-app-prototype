import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

// 5-tab bottom navigation. Active tab gets a colored pill + bounce.
const tabs = [
  { to: '/home', label: 'Home', icon: '🏠' },
  { to: '/leaderboard', label: 'Ranks', icon: '🏆' },
  { to: '/profile', label: 'Profile', icon: '🧑' },
  { to: '/plans', label: 'Plans', icon: '⚡' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function BottomTabBar() {
  const { pathname } = useLocation()
  return (
    <nav className="z-30 shrink-0 border-t border-black/5 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <ul className="flex items-stretch justify-between">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.to)
          return (
            <li key={tab.to} className="flex-1">
              <NavLink to={tab.to} className="block">
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className="flex flex-col items-center gap-0.5 rounded-2xl py-1.5"
                >
                  <motion.span
                    animate={active ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    className={`text-xl ${active ? '' : 'grayscale-[40%] opacity-60'}`}
                  >
                    {tab.icon}
                  </motion.span>
                  <span
                    className={`text-[10px] font-extrabold ${
                      active ? 'text-brand-600' : 'text-ink-soft/70'
                    }`}
                  >
                    {tab.label}
                  </span>
                </motion.div>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
