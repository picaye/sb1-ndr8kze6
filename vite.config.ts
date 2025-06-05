import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // Use relative paths instead of absolute paths
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Remove incorrect server options
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});