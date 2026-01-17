# Story Atlas

A reusable, scrollable, JSON-driven storytelling atlas built with React, Vite, TypeScript, Tailwind, Framer Motion, Zod, and React Router. Use it as a base app for new deployments—swap in your own content directory to tell rich, custom stories without redesigning the UI.

## Getting Started

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Build for production: `npm run build`
4. Preview production build: `npm run preview`

## Configuration

- Content lives in `content-default/` (served as static assets via Vite `publicDir`). For real deployments, copy it to `content/` and swap in your own JSON + media; the app automatically prefers `content/` and falls back to `content-default/`.
- Story registry is defined in `src/App.tsx` (`storyRegistry` array). Each entry needs `id` and `configPath` (e.g., `/stories/voyage-of-light.json`).
- All story metadata (title, subtitle, description, theme, badge, publishedAt) now comes from the JSON itself. The cover on the home/menu is auto-derived from the first page's `foreground` image, falling back to `background`.

Story JSON key fields:
- `theme`: `dark-cinematic` | `light-editorial` | `bold-gradient`
- `title`, `subtitle`, `description`
- `publishedAt`: ISO 8601 string (recommended for sorting)
- `badge`: optional homepage badge text (e.g., "Featured")
- `backgroundMusic`: URL for looping ambience
- `pages[]`: each page supports `layout` (`hero`, `split`, `timeline`, `immersive`), `transition` (`fade`, `slide-up`, `slide-left`, `zoom`), `body` text, `background`/`foreground` media, and optional `actions` or `timeline` items.

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
