import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { browserslistToTargets } from 'lightningcss'
import { defineConfig } from 'vitest/config'

// Browser targets for Lightning CSS, aligned with the es2020 build target.
const cssTargets = browserslistToTargets([
  'chrome >= 80',
  'firefox >= 78',
  'safari >= 14',
  'edge >= 80',
])

export default defineConfig({
  base: process.env.PUBLIC_URL || '/',
  plugins: [vue()],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: cssTargets,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (info) => {
          const name = info.names?.[0] || ''
          if (name.endsWith('.css')) {
            return 'css/[name]-[hash][extname]'
          }
          if (/\.(png|jpg|jpeg|gif|svg|webp)$/.test(name)) {
            return 'images/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        // Manual chunks for better code splitting
        manualChunks(id) {
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/vue-router')
          ) {
            return 'vendor'
          }
          return undefined
        },
      },
    },
    // Enable more optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Use Lightning CSS for faster, smaller CSS minification
    cssMinify: 'lightningcss',
  },
})
