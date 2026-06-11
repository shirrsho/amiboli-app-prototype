import { useCallback, useEffect, useRef } from 'react'

// Web Speech Synthesis for NPC/narration lines. Picks the best available
// English voice (prefers en-GB). If synthesis is unavailable, every call
// silently no-ops — the scene paces itself off the typewriter, not the audio.
export function useSpeech() {
  const voiceRef = useRef(null)

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const pick = () => {
      const voices = window.speechSynthesis.getVoices()
      voiceRef.current =
        voices.find((v) => /en-GB/i.test(v.lang) && /daniel|male/i.test(v.name)) ||
        voices.find((v) => /en-GB/i.test(v.lang)) ||
        voices.find((v) => /^en/i.test(v.lang)) ||
        null
    }
    pick()
    window.speechSynthesis.addEventListener('voiceschanged', pick)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pick)
  }, [])

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window) || !text) return
    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      if (voiceRef.current) u.voice = voiceRef.current
      u.rate = 1.04
      u.pitch = 0.95
      window.speechSynthesis.speak(u)
    } catch {
      /* no audio — fine */
    }
  }, [])

  const stop = useCallback(() => {
    try {
      window.speechSynthesis?.cancel()
    } catch {
      /* ignore */
    }
  }, [])

  // Stop talking if the screen unmounts mid-line.
  useEffect(() => stop, [stop])

  return { speak, stop }
}
