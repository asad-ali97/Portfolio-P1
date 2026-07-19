import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Split heavy 3D / animation vendors into their own chunks so the
    // initial route JS stays small (see 11_performance.md: lazy load
    // heavy assets, optimize 3D).
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('three') ||
              id.includes('@react-three/fiber') ||
              id.includes('@react-three/drei')
            ) {
              return 'three'
            }
            if (id.includes('framer-motion') || id.includes('gsap')) {
              return 'motion'
            }
          }
          return undefined
        },
      },
    },
  },
})
