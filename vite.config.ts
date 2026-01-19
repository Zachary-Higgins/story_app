import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { appConfig } from './app.config';
import { storyEnginePlugin } from './src/plugins/contentDiscovery';

const isBuildingPackage = process.env.BUILD_TARGET === 'package';
const packageName = process.env.npm_package_name?.split('/').pop();
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
  ?? packageName
  ?? 'story_app';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

// For dev server or standard app build, use content directory
// For package build (library), don't include publicDir—it's handled by consumers
let viteConfig: UserConfig = {
  plugins: [react(), storyEnginePlugin()],
  base: isGitHubPages ? `/${repoName}/` : '/',
  root: '.',
  server: {
    port: 5173,
    strictPort: false,
  },
};

if (!isBuildingPackage) {
  // App build: check if content directory exists, otherwise use fallback
  const contentDir = fs.existsSync(appConfig.contentDir) 
    ? appConfig.contentDir 
    : appConfig.contentDirFallback;
  console.log(`Using content directory: ${contentDir}`);
  
  viteConfig = {
    ...viteConfig,
    publicDir: contentDir,
    build: {
      outDir: 'build',
    },
  };
} else {
  // Package build: output to dist, use lib mode with multiple entries
  viteConfig = {
    ...viteConfig,
    build: {
      lib: {
        entry: {
          index: path.resolve(__dirname, 'src/index.ts'),
          plugin: path.resolve(__dirname, 'src/plugins/contentDiscovery.ts'),
        },
        formats: ['es'],
      },
      outDir: 'dist',
      rollupOptions: {
        external: ['react', 'react-dom', 'react-router-dom', 'fs', 'path', 'vite'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-router-dom': 'ReactRouterDOM',
          },
        },
      },
    },
  };
}

export default defineConfig(viteConfig);
