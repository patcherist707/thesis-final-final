import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import wasm from 'vite-plugin-wasm';

// Export the Vite configuration
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your backend server
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    wasm(),
  ],
  optimizeDeps: {
    exclude: ['firebase-admin'],  // Exclude firebase-admin from optimization
  },
});
