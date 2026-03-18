import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ✅ FIX: dynamic base
  base: process.env.NODE_ENV === 'production'
    ? '/Live-Trade/'   // for GitHub Pages
    : '/',             // for local dev

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})