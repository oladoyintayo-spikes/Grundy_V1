import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Grundy_V1/',  // GitHub Pages subpath (matches repo name)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
