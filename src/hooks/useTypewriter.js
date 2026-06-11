import { useEffect, useState } from 'react'

// Typewriter reveal for story text. `finish()` completes it instantly.
// Resets whenever `text` changes (each beat has its own text).
export function useTypewriter(text = '', enabled = true, msPerChar = 26) {
  const [count, setCount] = useState(0)
  const done = count >= text.length

  useEffect(() => {
    setCount(0)
  }, [text])

  useEffect(() => {
    if (!enabled || done || !text) return
    const id = setInterval(() => {
      setCount((c) => Math.min(c + 1, text.length))
    }, msPerChar)
    return () => clearInterval(id)
  }, [text, enabled, done, msPerChar])

  return {
    display: text.slice(0, count),
    done: done && text.length > 0,
    finish: () => setCount(text.length),
  }
}
