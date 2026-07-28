import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Ignore legacy paths left behind after the features/ refactor (Windows EPERM).
      ignored: [
        '**/src/components/crop/**',
        '**/src/componants/**',
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdf: ['react-pdf', 'pdfjs-dist'],
          pdflib: ['pdf-lib'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
});
