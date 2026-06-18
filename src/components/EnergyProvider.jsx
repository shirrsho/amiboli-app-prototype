import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { user } from '../data/dummyData'

// In-memory energy state so a top-up from "watch an ad" survives the trip to
// the Ad screen and back. No persistence — resets on refresh. An ad can be
// watched any time (no cooldown) to add 1 bolt, up to the max.
const EnergyContext = createContext(null)

export const useEnergy = () => useContext(EnergyContext)

export default function EnergyProvider({ children }) {
  const max = user.energy.max
  const [current, setCurrent] = useState(user.energy.current)

  const addViaAd = useCallback(() => {
    setCurrent((c) => Math.min(max, c + 1))
  }, [max])

  const value = useMemo(() => {
    const isFull = current >= max
    return {
      current,
      max,
      isFull,
      canWatch: !isFull, // ad available any time until energy is full
      addViaAd,
      resetsIn: user.energy.resetsIn,
    }
  }, [current, max, addViaAd])

  return <EnergyContext.Provider value={value}>{children}</EnergyContext.Provider>
}
