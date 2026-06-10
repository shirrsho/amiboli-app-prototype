// Minimal service worker — required so the browser treats Amiboli as an
// installable PWA (the "Download" / Add-to-Home-Screen flow). It also caches
// the app shell so the installed app opens offline. This caches static assets
// only, NOT any user/dummy data — app state still lives in memory and resets.
const CACHE = 'amiboli-shell-v1'
const SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

// Cache-first for same-origin GETs, falling back to the app shell when offline.
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request)
        .then((res) => {
          if (new URL(request.url).origin === self.location.origin) {
            const copy = res.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return res
        })
        .catch(() => caches.match('/index.html'))
    })
  )
})
