import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolveContentDir } from './app.config';

const packageName = process.env.npm_package_name?.split('/').pop();
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
  ?? packageName
  ?? 'story_app';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const contentDir = resolveContentDir();
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
