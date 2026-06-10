// PWA install singleton + React hook.
//
// The browser fires `beforeinstallprompt` once (often before React mounts), so
// we capture it at module load on a tiny store. Components read the reactive
// state via usePwaInstall() and trigger the native install with promptInstall().
import { useSyncExternalStore } from 'react'

// One-time platform facts (don't change during a session).
export const isIOS =
  typeof navigator !== 'undefined' &&
  (/iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPadOS reports as Mac but has touch
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

export const isStandalone =
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true)

let deferredPrompt = null
let installed = isStandalone

// Stable snapshot object so useSyncExternalStore doesn't loop.
let snapshot = { canInstall: false, installed }
const listeners = new Set()

function refresh() {
  snapshot = { canInstall: !!deferredPrompt, installed }
  listeners.forEach((l) => l())
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault() // stop the mini-infobar; we drive install from our button
    deferredPrompt = e
    refresh()
  })
  window.addEventListener('appinstalled', () => {
    installed = true
    deferredPrompt = null
    refresh()
  })
}

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
function getSnapshot() {
  return snapshot
}

// Returns 'accepted' | 'dismissed' | 'unavailable'.
export async function promptInstall() {
  if (!deferredPrompt) return 'unavailable'
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  // A prompt can only be used once.
  deferredPrompt = null
  refresh()
  return outcome
}

export function usePwaInstall() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
