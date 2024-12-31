import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost:3000',
        target: 'https://shoppers-aniket.vercel.app',
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist', // Specify the output directory
  }
})
