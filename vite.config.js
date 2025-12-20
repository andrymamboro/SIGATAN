import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './Components'),
      '@/pages': path.resolve(__dirname, './Pages'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/utils': path.resolve(__dirname, './utils'),
      '@/api': path.resolve(__dirname, './api'),
      '@/entities': path.resolve(__dirname, './Entities'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
