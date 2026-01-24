# Story Engine Integration Guide

## Installation

```bash
npm install github:Zachary-Higgins/story_app#semver:*
```

## Basic Setup

### 1. Configure Vite

Import the plugins from the separate plugin entry point in your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { storyEnginePlugin, storyEditorServer } from 'story-engine/plugin';

export default defineConfig(({ command }) => {
  const plugins = [react(), storyEnginePlugin()]; // Auto-discovers stories from content/stories/*.json
  if (command === 'serve') {
    plugins.push(storyEditorServer());
  }
  return {
    plugins,
    publicDir: 'content', // Serve content directory as static files
  };
});
```

### 2. Create Content Structure

Create a `content/` directory in your project root:

```
your-project/
├── content/
│   ├── stories/
│   │   ├── my-first-story.json
│   │   └── my-second-story.json
│   ├── images/
│   ├── videos/
│   └── audio/
├── src/
│   └── main.tsx
├── vite.config.ts
└── package.json
```

### 3. Use the Component

Import the StoryEngine component and CSS in your app. Use `HashRouter` for static hosts like GitHub Pages (no server-side rewrites):

```typescript
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { StoryEngine } from 'story-engine';
import 'story-engine/dist/story-engine.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <StoryEngine editorEnabled={import.meta.env.DEV} />
    </HashRouter>
  </StrictMode>
);
```

## How It Works

1. **Plugin**: The `storyEnginePlugin()` scans your `content/stories/` directory at build and dev time
2. **Auto-Discovery**: It generates a `content/index.json` file listing all story configs
3. **Component**: The `<StoryEngine />` component loads the index and renders stories dynamically
4. **Story IDs**: Story ids come from filenames (e.g., `content/stories/my-story.json` → `id: "my-story"`)

## Story JSON Format

Each story JSON file should follow this schema (see [STORY-AUTHORING.md](STORY-AUTHORING.md) for details):

```json
{
  "title": "My Story Title",
  "subtitle": "A compelling subtitle",
  "publishedAt": "2024-01-15",
  "theme": "dark-cinematic",
  "citations": [
    { "label": "NOAA 2023", "url": "https://example.com/source" }
  ],
  "pages": [
    {
      "id": "opening",
      "title": "Welcome",
      "body": ["Start your journey."],
      "layout": "hero",
      "background": { "type": "image", "src": "/images/cover.jpg" },
      "citations": [{ "label": "Dataset A", "url": "https://example.com" }]
    }
  ]
}
```

## TypeScript Support

The package includes full TypeScript definitions. Import types as needed:

```typescript
import type { StoryConfig, StorySection } from 'story-engine';
```

## Troubleshooting

### Plugin Not Found Error

If you see `Cannot find module 'story-engine/plugin'`, ensure:
- You're using a package manager that supports exports field (npm 7+, yarn 2+, pnpm)
- Your vite.config.ts is in the project root

### No Stories Loaded

If stories don't appear:
- Check that `content/stories/` exists and contains `.json` files
- Verify plugin generates `content/index.json` (check build output)
- Ensure `publicDir: 'content'` is set in vite.config.ts
