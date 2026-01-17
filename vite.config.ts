import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  publicDir: 'content',
  root: '.',
  build: {
    outDir: 'build',
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
