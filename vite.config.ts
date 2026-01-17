import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { appConfig } from './app.config';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
  ?? process.env.npm_package_name
  ?? 'story_app';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
// Check if content directory exists, otherwise use fallback
const contentDir = fs.existsSync(appConfig.contentDir) 
  ? appConfig.contentDir 
  : appConfig.contentDirFallback;

console.log(`Using content directory: ${contentDir}`);

export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? `/${repoName}/` : '/',
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
