import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Moving the cache directory to bypass Windows EPERM issues
  cacheDir: './.vite_cache',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
