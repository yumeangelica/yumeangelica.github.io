import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  publicpath: process.env.PUBLIC_URL || '/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      "components": fileURLToPath(new URL('./src/components', import.meta.url)),
      "pages": fileURLToPath(new URL('./src/pages', import.meta.url)),
      "assets": fileURLToPath(new URL('./src/assets', import.meta.url)),
    }
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (name.endsWith('.css')) {
            return 'css/[name]-[hash][extname]'
          }
          if (/\.(png|jpg|jpeg|gif|svg|webp)$/.test(name)) {
            return 'images/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },

})
