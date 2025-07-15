import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true
      }
    }
  }
})