# Story Atlas

A reusable, scrollable, JSON-driven storytelling atlas built with React, Vite, TypeScript, Tailwind, Framer Motion, Zod, and React Router. Use it as a base app for new deployments—swap in your own content directory to tell rich, custom stories without redesigning the UI.

This repository hosts the base application only. Do not submit custom story content here; separate usage guidelines will explain how to run your own stories on top of this app.

## Getting Started

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Build for production: `npm run build`
4. Preview production build: `npm run preview`

## Configuration

- Content lives in `content-default/` (served as static assets via Vite `publicDir`). For real deployments, copy it to `content/` and swap in your own JSON + media; any path in `content/` overrides the same path in `content-default/`.
- Stories are JSON files under `content/stories/` (with media in sibling `images/`, `videos/`, `audio/` folders). Use leading slashes in JSON (e.g., `/stories/voyage-of-light.json`, `/images/cover.jpg`) and they will resolve against whichever content directory is active.
- The app loads stories from the `storyRegistry` constants in `src/App.tsx` (home + navigation) and `src/pages/StoryView.tsx` (story page). Each entry is `{ id, configPath }`, and the runtime fetches those JSON files to derive metadata (cover comes from the first page `foreground` or `background`).
- All story metadata (title, subtitle, description, theme, badge, publishedAt) comes from the JSON itself.

### Add a story

1. Copy a sample from `content-default/stories/` into `content/stories/<your-id>.json` and edit it to match `src/storySchema.ts`.
2. Add `{ id: '<your-id>', configPath: '/stories/<your-id>.json' }` to the `storyRegistry` arrays in `src/App.tsx` and `src/pages/StoryView.tsx` so the app can load it.
3. Place supporting media in `content/images/`, `content/videos/`, or `content/audio/` and reference them with leading slashes (e.g., `/images/<your-id>/cover.jpg`).

Example `content/` tree:
```
content/
  home.json
  about.json
  social.json
  stories/
    voyage-of-light.json
    tides-of-the-blue.json
  images/
    voyage-of-light/cover.jpg
  audio/
    voyage-of-light/ambient.mp3
```

Story JSON key fields:
- `theme`: `dark-cinematic` | `light-editorial` | `bold-gradient`
- `title`, `subtitle`, `description`
- `publishedAt`: ISO 8601 string (recommended for sorting)
- `badge`: optional homepage badge text (e.g., "Featured")
- `backgroundMusic`: URL for looping ambience
- `pages[]`: each page supports `layout` (`hero`, `split`, `timeline`, `immersive`), `transition` (`fade`, `slide-up`, `slide-left`, `zoom`), `body` text, `background`/`foreground` media, and optional `actions` or `timeline` items.
- See `docs/STORY-AUTHORING.md` for detailed story layout and media guidance.

### Audio assets

- Drop MP3s into `content-default/audio/` (or `content/audio/` if you provide your own directory).
- Reference them in story JSON with `"backgroundMusic": "/audio/your-file.mp3"`.

## Theming

Themes are applied via CSS variables and Tailwind. Use the theme toggle in the header or set `theme` inside each story JSON to define the default look.

## Navigation

- Left navigation lists every story (loaded from `storyRegistry`) and the About page.
- Landing page showcases all configured stories with covers (first page media) and badges (from story JSON).

## Notes

- Fonts: Playfair Display (headings) + Manrope (body) for an elegant but readable pairing.
- Respect `storySchema` validation—invalid JSON will surface an error banner.
- Media URLs in the samples use Unsplash/Pixabay; replace with your own assets for production.
- If you bring your own content directory, keep the same structure (`stories/`, `audio/`, `images/`, `videos/`) and ensure `configPath` points to it.
- Use the `/research/` folder to store briefs or reference assets; keep it intact when adding new content.
