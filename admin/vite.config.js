import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '6b77b9ed-2fda-4d41-b06b-cc6f53bf39d9-00-3fwnnvcbxwxjp.pike.replit.dev'
    ]
  }
})
