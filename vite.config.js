import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  base: '/caibaropedia/',
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'copy-404-for-spa',
      closeBundle() {
        try {
          fs.copyFileSync(
            path.resolve('dist/index.html'),
            path.resolve('dist/404.html')
          );
        } catch {}
      }
    }
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/leaflet')) {
            return 'vendor-leaflet';
          }
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) {
            return 'vendor-motion';
          }
        }
      }
    }
  }
});
