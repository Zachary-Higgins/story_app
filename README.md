# Story Engine

A reusable, JSON-driven React storytelling component library. Build once, tell infinite stories. This package provides the UI, routing, and rendering layer—you provide the content.

## What is Story Engine?

Story Engine is an npm package that transforms a `/content` folder into an immersive, multi-page storytelling experience. The engine handles:

- **Story discovery** via automatic JSON scanning (no manual index needed!)
- **Dynamic page rendering** with multiple layout types (hero, split, timeline, immersive)
- **Themes & styling** with CSS variables and Tailwind
- **Navigation & routing** with React Router
- **Media playback** (images, video, background audio)
- **Animations** with Framer Motion

Your project provides the content: story JSON configs and media assets in a `/content` folder. The engine's Vite plugin automatically discovers stories and builds the index—no manual configuration required.

## Installation

Install directly from GitHub:

```bash
npm install github:Zachary-Higgins/story_app#v1.0.0
```

Or add to `package.json`:

```json
{
  "dependencies": {
    "story-engine": "github:Zachary-Higgins/story_app#v1.0.0"
  }
}
```

> See [docs/INSTALL-FROM-GITHUB.md](docs/INSTALL-FROM-GITHUB.md) for version pinning and troubleshooting.

## Quick Start

See [docs/INTEGRATION.md](docs/INTEGRATION.md) for complete setup instructions.

**Summary:**

1. **Install**: `npm install github:Zachary-Higgins/story_app#v1.0.0`
2. **Configure Vite**: Add `storyEnginePlugin()` from `story-engine/plugin`
3. **Create Content**: Add story JSON files to `content/stories/`
4. **Use Component**: Import `<StoryEngine />` and the CSS

```tsx
// vite.config.ts
import { storyEnginePlugin } from 'story-engine/plugin';

export default defineConfig({
  plugins: [react(), storyEnginePlugin()],
  publicDir: 'content',
});

// src/main.tsx
import { StoryEngine } from 'story-engine';
import 'story-engine/dist/story-engine.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoryEngine />
  </StrictMode>
);
```

The plugin automatically scans `content/stories/*.json` and generates the story index. No manual setup required!

## Story JSON Format

Each story is a JSON file following this structure:

```json
{
  "id": "my-story",
  "title": "Story Title",
  "subtitle": "Compelling subtitle",
  "theme": "dark-cinematic",
  "publishedAt": "2024-01-15T00:00:00Z",
  "pages": [
    {
      "id": "page-1",
      "layout": "hero",
      "title": "Welcome",
      "subtitle": "Start your journey"
    }
  ]
}
```

**Layout Types:**
- `hero` - Full-screen title page
- `split` - Two-column content
- `timeline` - Vertical timeline with media
- `immersive` - Full-screen media experience

**Themes:**
- `dark-cinematic` - Dark mode with high contrast
- `light-editorial` - Light mode, clean typography
- `bold-gradient` - Vibrant gradients

> Complete schema documentation: [docs/STORY-AUTHORING.md](docs/STORY-AUTHORING.md)

## Development

### Local Development

```bash
git clone https://github.com/Zachary-Higgins/story_app
cd story_app
npm install
npm run dev
```

The repo includes sample content in `/content` for testing.

### Scripts

```bash
npm run dev              # Start dev server
npm run lint             # Check code quality
npm test                 # Run tests
npm run build:dist       # Build package
npm run build:release    # Full validation before release
```

### Project Structure

```
src/
  ├── components/        # UI components
  ├── pages/             # Page components
  ├── plugins/           # Vite plugins (story discovery)
  ├── types/             # TypeScript definitions
  └── index.ts           # Package exports

dist/                    # Built package
  ├── index.js           # Component library
  ├── plugin.js          # Story discovery plugin
  └── story-engine.css   # Styles
```

## Documentation


## License

MIT © Zachary Higgins


**Build immersive stories with JSON.** Install, configure, and create.

