import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'b464a1e0-dd22-46f6-8cda-c5a577dcd40c-00-2xdhy84z3o6w0.sisko.replit.dev'
    ]
  }
})
