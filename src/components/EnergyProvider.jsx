import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { user } from '../data/dummyData'

// In-memory energy state so a top-up from "watch an ad" survives the trip to
// the Ad screen and back. No persistence — resets on refresh.
//
// Rule: a Free user may watch at most MAX_ADS_PER_DAY ads to gain energy.
// Energy ads are the ONLY ads in the app. (Pro = unlimited energy, no ads.)
const MAX_ADS_PER_DAY = 2

const EnergyContext = createContext(null)

export const useEnergy = () => useContext(EnergyContext)

export default function EnergyProvider({ children }) {
  const max = user.energy.max
  const [current, setCurrent] = useState(user.energy.current)
  const [adsToday, setAdsToday] = useState(0)

  const addViaAd = useCallback(() => {
    setCurrent((c) => Math.min(max, c + 1))
    setAdsToday((n) => n + 1)
  }, [max])

  const value = useMemo(() => {
    const isFull = current >= max
    const adsLeft = Math.max(0, MAX_ADS_PER_DAY - adsToday)
    const limitReached = adsLeft === 0
    return {
      current,
      max,
      isFull,
      adsLeft,
      adsPerDay: MAX_ADS_PER_DAY,
      limitReached,
      canWatch: !isFull && !limitReached, // not full AND has a daily ad left
      addViaAd,
      resetsIn: user.energy.resetsIn,
    }
  }, [current, max, adsToday, addViaAd])

  return <EnergyContext.Provider value={value}>{children}</EnergyContext.Provider>
}
