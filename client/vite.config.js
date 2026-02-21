import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://fyp-lms-h8i1.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://fyp-lms-h8i1.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
