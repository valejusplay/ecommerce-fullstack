import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // En desarrollo el backend se sirve bajo el mismo origen que el frontend.
    // Replica el comportamiento de los rewrites de Vercel en produccion, para
    // que la cookie httpOnly sea first-party en ambos entornos.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
