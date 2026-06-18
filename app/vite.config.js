import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served under item.app/pickle (the rest of item.app is proxied to Figma).
  base: '/pickle/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Nest the build under dist/pickle so the served root (dist) is empty and
    // the Figma proxy rewrite can own "/". Vercel's Output Directory stays "dist".
    outDir: 'dist/pickle',
    emptyOutDir: true,
  },
})
