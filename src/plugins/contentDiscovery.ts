import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

/**
 * Vite plugin that auto-discovers story JSON files in /content/stories/
 * and generates /content/index.json (no manual index needed).
 */
export function storyEnginePlugin(): Plugin {
  return {
    name: 'story-engine-content-discovery',
    configureServer(server) {
      const contentDir = path.resolve(server.config.root, 'content');
      const storiesDir = path.join(contentDir, 'stories');
      
      // Generate on server start
      generateIndexJson(contentDir, storiesDir);

      // Watch for story file changes
      server.watcher.add(storiesDir);
      server.watcher.on('add', () => generateIndexJson(contentDir, storiesDir));
      server.watcher.on('unlink', () => generateIndexJson(contentDir, storiesDir));
    },
    buildStart() {
      const contentDir = path.resolve(process.cwd(), 'content');
      const storiesDir = path.join(contentDir, 'stories');
      generateIndexJson(contentDir, storiesDir);
    },
  };
}

export { storyEditorServer } from './storyEditorServer';

function generateIndexJson(contentDir: string, storiesDir: string) {
  if (!fs.existsSync(storiesDir)) {
    console.warn('[story-engine] No content/stories directory found');
    return;
  }

  const files = fs.readdirSync(storiesDir).filter((f: string) => f.endsWith('.json'));
  const stories = files.map((file: string) => {
    const id = file.replace('.json', '');
    return {
      id,
      configPath: `/stories/${file}`,
    };
  });

  const indexPath = path.join(contentDir, 'index.json');
  const indexContent = JSON.stringify({ stories }, null, 2);
  
  fs.writeFileSync(indexPath, indexContent, 'utf-8');
  console.log(`[story-engine] Generated index.json with ${stories.length} stories`);
}
