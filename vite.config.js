import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config — plain SPA with React. PWA assets live in /public.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // expose on LAN so you can open it on a real phone
    port: 5173,
    allowedHosts: true, // allow any host (ngrok tunnels, LAN IPs, etc.)
  },
  preview: {
    host: true,
    allowedHosts: true, // allow any host so HTTPS tunnels reach the prod build
  },
})
