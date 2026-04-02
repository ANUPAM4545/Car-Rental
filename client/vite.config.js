import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth-status': 'http://localhost:3000',
      '/register': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/add-car': 'http://localhost:3000',
      '/cars': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
      '/edit-car': 'http://localhost:3000',
      '/rent': 'http://localhost:3000',
      '/my-bookings': 'http://localhost:3000',
      '/agency-requests': 'http://localhost:3000',
      '/agency-requests/action': 'http://localhost:3000',
    }
  }
})
