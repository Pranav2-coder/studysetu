import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Increase chunk size warning limit slightly (Supabase SDK is ~200KB)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        /**
         * manualChunks as a function — required by rolldown (Vite 8+).
         * Splits heavy vendor libraries into separate, long-cached chunks.
         */
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('qrcode')) return 'vendor-qr';
            if (
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('/react/')
            ) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
});
