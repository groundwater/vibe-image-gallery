import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const plugins = [await Promise.resolve(react())]

export default defineConfig({
  plugins,
  server: {
    port: 5173,
    strictPort: true
  }
})
