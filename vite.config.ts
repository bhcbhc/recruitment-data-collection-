import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: false,
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: 'src/main.tsx',
      name: 'RecruitmentCollector',
      formats: ['iife'],
      fileName: 'popup'
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      }
    }
  },
  server: {
    port: 5173
  }
})
