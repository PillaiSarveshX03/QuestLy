import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Bind to 0.0.0.0 for Docker container port mapping
    port: 5173,
    watch: {
      usePolling: true, // Necessary for file-change detection in Docker on Windows/WSL2
    },
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://questly-server:5000',
        changeOrigin: true,
      },
    },
  },
});
