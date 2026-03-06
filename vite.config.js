// vite.config.js (must be in project ROOT, not inside frontend/)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  root: 'frontend',               // ← Tells Vite: "my app starts in frontend/ folder"
  
  base: './',                     // ← Relative paths so Android/Capacitor can load assets correctly
  
  build: {
    outDir: 'dist',               // ← Output built files to frontend/dist
    emptyOutDir: true             // ← Clean old files before new build
  },
  
  server: {
    port: 5173                    // ← Dev server port (optional but good)
  }
})