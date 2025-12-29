import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/SIGATAN/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './Components'),
      '@pages': path.resolve(__dirname, './Pages'),
      '@lib': path.resolve(__dirname, './lib'),
      '@utils': path.resolve(__dirname, './utils'),
      '@api': path.resolve(__dirname, './api'),
      '@entities': path.resolve(__dirname, './Entities'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // leaflet config removed
          if (id.includes('jspdf')) return 'pdf';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Tambahan agar console.log tidak dihapus saat minify
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
      },
    },
  },
  define: {
    global: 'window',
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // paksa Vite prebundle React
  },
});