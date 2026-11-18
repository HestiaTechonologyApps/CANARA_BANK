import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  esbuild: {
    // Production builds strip console.log/info/debug (the code logs API responses and user data).
    // console.warn and console.error are kept so real failures stay visible.
    pure: command === 'build' ? ['console.log', 'console.info', 'console.debug'] : [],
  },
}))
