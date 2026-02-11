import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('@tanstack')) return 'vendor';
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('recharts') || id.includes('d3-')) return 'charts';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('@radix-ui')) return 'ui';
            if (id.includes('react-markdown') || id.includes('rehype') || id.includes('remark') || id.includes('unified') || id.includes('hast') || id.includes('mdast')) return 'markdown';
          }
        },
      },
    },
  },
})
