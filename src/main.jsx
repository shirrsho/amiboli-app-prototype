import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// HashRouter keeps routing working when packaged as a static APK (file://).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)

// Register the service worker so Amiboli is an installable PWA (the "Download"
// button). Only in production builds — a custom SW would interfere with Vite's
// dev HMR. Run `npm run build && npm run preview` to test installability locally.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* install just won't be offered; not fatal for the prototype */
    })
  })
}
