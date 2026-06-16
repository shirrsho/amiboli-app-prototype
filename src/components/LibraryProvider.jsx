import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { storeBooks } from '../data/dummyData'

// In-memory library of "bought" store books. No persistence — resets on
// refresh (consistent with the prototype's hard constraints). Buying a book
// makes it appear on Home and openable from its Book screen.
const LibraryContext = createContext(null)

export const useLibrary = () => useContext(LibraryContext)

export default function LibraryProvider({ children }) {
  const [ownedIds, setOwnedIds] = useState(() => new Set())

  const buy = useCallback((id) => {
    setOwnedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const value = useMemo(() => {
    const owns = (id) => ownedIds.has(id)
    const ownedBooks = storeBooks.filter((b) => ownedIds.has(b.id))
    return { ownedIds, owns, buy, ownedBooks }
  }, [ownedIds, buy])

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}
