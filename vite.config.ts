import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { appConfig } from './app.config';

// Check if content directory exists, otherwise use fallback
const contentDir = fs.existsSync(appConfig.contentDir) 
  ? appConfig.contentDir 
  : appConfig.contentDirFallback;

console.log(`Using content directory: ${contentDir}`);

export default defineConfig({
  plugins: [react()],
  publicDir: contentDir,
  root: '.',
  build: {
    outDir: 'build',
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
