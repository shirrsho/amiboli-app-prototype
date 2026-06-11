import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame'
import BottomTabBar from './components/BottomTabBar'
import ToastProvider from './components/ToastProvider'

import Splash from './screens/Splash'
import Onboarding from './screens/Onboarding'
import Auth from './screens/Auth'
import Home from './screens/Home'
import Book from './screens/Book'
import Leaderboard from './screens/Leaderboard'
import Profile from './screens/Profile'
import Plans from './screens/Plans'
import Settings from './screens/Settings'

// Layout for the 5 main tabs: scrollable content + persistent bottom tab bar.
function MainLayout() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
      <BottomTabBar />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <PhoneFrame>
      <ToastProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Pre-app flow */}
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth" element={<Auth />} />

            {/* A book's own immersive screen — full-screen, no tab bar */}
            <Route path="/book/:id" element={<Book />} />

            {/* Main app with tab bar */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </AnimatePresence>
      </ToastProvider>
    </PhoneFrame>
  )
}
