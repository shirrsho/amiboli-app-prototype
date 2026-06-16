import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { user } from '../data/dummyData'

// In-memory energy state so a top-up from "watch an ad" survives the trip to
// the Ad screen and back. No persistence — resets on refresh. The 6-hour ad
// cooldown is simulated: one ad-energy per session, then it's "on cooldown".
const EnergyContext = createContext(null)

export const useEnergy = () => useContext(EnergyContext)

export default function EnergyProvider({ children }) {
  const max = user.energy.max
  const [current, setCurrent] = useState(user.energy.current)
  const [adAvailable, setAdAvailable] = useState(true)

  const addViaAd = useCallback(() => {
    setCurrent((c) => Math.min(max, c + 1))
    setAdAvailable(false)
  }, [max])

  const value = useMemo(() => {
    const isFull = current >= max
    return {
      current,
      max,
      isFull,
      adAvailable,
      canWatch: adAvailable && !isFull,
      addViaAd,
      resetsIn: user.energy.resetsIn,
    }
  }, [current, max, adAvailable, addViaAd])

  return <EnergyContext.Provider value={value}>{children}</EnergyContext.Provider>
}
