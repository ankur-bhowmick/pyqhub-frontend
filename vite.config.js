import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'https://pyqhub-backend-k94y.onrender.com',
      '/uploads': 'https://pyqhub-backend-k94y.onrender.com'
    }
  }
})
