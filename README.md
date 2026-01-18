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

## Installation

### From GitHub (Recommended)

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

See [docs/INSTALL-FROM-GITHUB.md](docs/INSTALL-FROM-GITHUB.md) for details.

### From npm (if published)

```bash
npm install story-engine
```

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

Each story is a JSON file in `content/stories/` following this structure:
    <BrowserRouter>
      <StoryEngine />
    </BrowserRouter>
  );
}
```

### 2. Create your `/content` folder structure

Your project root must include a `/content` directory:

```
your-project/
├── src/
│   └── App.tsx
├── public/
├── content/
│   ├── index.json              (story registry)
│   ├── home.json               (landing page config)
│   ├── about.json              (about page config)
│   ├── social.json             (social links)
│   ├── stories/
│   │   ├── story-1.json
│   │   └── story-2.json
│   ├── audio/
│   │   └── ambient.mp3
│   ├── images/
│   ├── videos/
├── package.json
└── vite.config.ts
```

### 3. Create your content index (`/content/index.json`)

This file tells the engine which stories exist:

```json
{
  "version": "1.0",
  "stories": [
    {
      "id": "story-1",
      "configPath": "/stories/story-1.json"
    },
    {
      "id": "story-2",
      "configPath": "/stories/story-2.json"
    }
  ]
}
```

### 4. Create story configs (`/content/stories/*.json`)

Each story is a JSON file with pages, metadata, and media references:

```json
{
  "theme": "dark-cinematic",
  "title": "My Story",
  "subtitle": "A Short Tale",
  "description": "Shown on the landing page",
  "publishedAt": "2026-01-18T00:00:00Z",
  "badge": "Featured",
  "backgroundMusic": "/audio/ambient.mp3",
  "pages": [
    {
      "id": "page-1",
      "title": "Opening",
      "kicker": "Part One",
      "layout": "hero",
      "body": [
        "The story begins...",
        "Second paragraph."
      ],
      "background": {
        "type": "image",
        "src": "/images/hero.jpg",
        "alt": "Hero image"
      },
      "transition": "fade"
    },
    {
      "id": "page-2",
      "title": "Development",
      "layout": "split",
      "body": ["Story continues..."],
      "foreground": {
        "type": "image",
        "src": "/images/middle.jpg"
      },
      "transition": "slide-up"
    }
  ]
}
```

## Configuration Files

### Home Page (`/content/home.json`)

Configures the landing page hero section and intro text:

```json
{
  "hero": {
    "kicker": "Welcome",
    "title": "Your Site Title",
    "body": "A short intro blurb",
    "tags": ["tag1", "tag2"],
    "image": "/images/hero.jpg",
    "imageAlt": "Description",
    "note": "Optional footer note"
  }
}
```

### About Page (`/content/about.json`)

Configures the about page content:

```json
{
  "hero": {
    "kicker": "About",
    "title": "About This Project",
    "body": "About section hero content"
  },
  "sections": [
    {
      "title": "Section Title",
      "body": "Section content"
    }
  ]
}
```

### Social Links (`/content/social.json`)

Footer social and external links:

```json
{
  "links": [
    {
      "label": "GitHub",
      "href": "https://github.com/..."
    }
  ]
}
```

## Story JSON Schema

Each story config file must adhere to the following schema:

### Root Object

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `theme` | `'dark-cinematic' \| 'light-editorial' \| 'bold-gradient'` | Yes | Overall visual theme |
| `title` | string | Yes | Story title |
| `subtitle` | string | No | Subtitle (shown on home) |
| `description` | string | No | Short description for metadata |
| `publishedAt` | ISO 8601 string | No | Publication date; used for sorting |
| `badge` | string | No | Badge text (e.g., "Featured", "New") |
| `backgroundMusic` | URL string | No | Looping ambient music file |
| `pages` | Array<Page> | Yes | Story pages (at least one required) |

### Page Object

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | Yes | Unique page identifier within story |
| `title` | string | Yes | Page title |
| `kicker` | string | No | Small uppercase label above title |
| `layout` | `'hero' \| 'split' \| 'timeline' \| 'immersive'` | Yes | Page layout type |
| `body` | string[] | Yes | Array of body paragraphs |
| `background` | MediaAsset | No | Full-width or split background media |
| `foreground` | MediaAsset | No | Overlay or split-section foreground media |
| `transition` | `'fade' \| 'slide-up' \| 'slide-left' \| 'zoom'` | No | Page entry animation |
| `actions` | ActionLink[] | No | Call-to-action buttons |
| `timeline` | TimelineEntry[] | No | Timeline items (for `timeline` layout) |
| `emphasis` | string | No | Emphasized quote or callout text |

### MediaAsset Object

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `type` | `'image' \| 'video'` | Yes | Media type |
| `src` | URL string | Yes | Relative or absolute media URL |
| `alt` | string | No | Alt text for accessibility |
| `loop` | boolean | No | Loop video (default: true) |
| `autoPlay` | boolean | No | Auto-play video (default: true) |

### ActionLink Object

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `label` | string | Yes | Button text |
| `href` | URL string | Yes | Link destination |

### TimelineEntry Object

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | Entry title |
| `subtitle` | string | No | Entry subtitle |
| `description` | string | Yes | Entry description |
| `marker` | string | No | Marker text (e.g., year, date) |

## Page Layouts

### `hero`

Full-bleed hero section. Used for opening pages or dramatic moments.

**Example:**
```json
{
  "layout": "hero",
  "title": "Opening Page",
  "body": ["Story begins..."],
  "background": { "type": "image", "src": "/images/hero.jpg" }
}
```

### `split`

Side-by-side text and media. Alternates left/right per page.

**Example:**
```json
{
  "layout": "split",
  "title": "Two Perspectives",
  "body": ["Left-side text..."],
  "foreground": { "type": "image", "src": "/images/side.jpg" }
}
```

### `timeline`

Vertical timeline with entries. Use `timeline` array in config.

**Example:**
```json
{
  "layout": "timeline",
  "title": "Historical Timeline",
  "body": ["Intro text..."],
  "timeline": [
    {
      "marker": "1492",
      "title": "Event Title",
      "description": "Event description..."
    }
  ]
}
```

### `immersive`

Scrollytelling with parallax effects and custom transitions.

**Example:**
```json
{
  "layout": "immersive",
  "title": "Immersive Experience",
  "body": ["Narrative text..."],
  "background": { "type": "video", "src": "/videos/background.mp4" }
}
```

## Theming

Three built-in themes are available:

- **`dark-cinematic`**: Dark backgrounds, high contrast, elegant fonts
- **`light-editorial`**: Light backgrounds, serif headings, classic editorial style
- **`bold-gradient`**: Vibrant gradients, modern design

Set the default theme in your story JSON:

```json
{ "theme": "dark-cinematic", ... }
```

Users can also toggle themes via the header UI.

## Asset Management

### Audio

Place MP3 files in `/content/audio/`. Reference them in story JSON:

```json
{
  "backgroundMusic": "/audio/ambient.mp3"
}
```

### Images & Video

Place media in `/content/images/` and `/content/videos/`. Use relative paths:

```json
{
  "background": {
    "type": "image",
    "src": "/images/photo.jpg",
    "alt": "Photo description"
  }
}
```

**Media URLs can be**:
- Relative (e.g., `/images/photo.jpg`)
- Absolute HTTPS URLs (e.g., `https://example.com/photo.jpg`)

URL validation rejects:
- `javascript:` and other protocols
- Protocol-relative URLs (`//example.com`)

## Development

To work on the Story Engine itself:

```bash
# Install
npm install

# Dev server (loads /content folder)
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

The dev server uses the `/content` folder for local development. This folder is not included in the npm package.

## Exports

The package exports the main component and useful types:

```tsx
import StoryEngine, { 
  StoryMeta,
  StoryConfig,
  StoryPage,
  ContentIndex,
  ThemeName,
  useStories,
  storyConfigSchema,
  contentIndexSchema
} from 'story-engine';
```

## Example: Consuming Project

Here's a complete minimal consuming project:

```
my-stories/
├── src/
│   ├── App.tsx
│   └── main.tsx
├── content/
│   ├── index.json
│   ├── home.json
│   ├── about.json
│   ├── social.json
│   ├── stories/
│   │   └── my-story.json
│   ├── images/
│   └── audio/
├── public/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

**package.json:**
```json
{
  "name": "my-stories",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.3",
    "story-engine": "^0.0.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^7.3.1",
    "typescript": "^5.4.2"
  }
}
```

**src/App.tsx:**
```tsx
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import StoryEngine from 'story-engine';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch('/index.json')
      .then(() => setReady(true))
      .catch(err => {
        console.error('No content/index.json found:', err);
        setReady(false);
      });
  }, []);

  return (
    <BrowserRouter>
      {ready ? <StoryEngine /> : <div>No stories loaded</div>}
    </BrowserRouter>
  );
}
```

**vite.config.ts:**
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'content',
  server: { port: 5173 },
});
```

## Notes

- The engine serves assets from the `/content` directory. Ensure your Vite config points `publicDir` to `content`.
- Media URLs are validated for security (no `javascript:` or protocol-relative URLs).
- Stories are sorted by `publishedAt` (newest first) on the landing page.
- The cover image on the landing page is auto-derived from the first page's `foreground` or `background` media.
- All story JSON must validate against the schema. Invalid JSON will show an error banner.

## License

MIT

---

**Ready to tell your story?** Install the package, create a `/content` folder with your stories, and run the dev server. The engine handles the rest.
