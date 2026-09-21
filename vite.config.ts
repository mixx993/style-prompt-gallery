import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages project site: https://<user>.github.io/style-prompt-gallery/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/style-prompt-gallery/',
})
