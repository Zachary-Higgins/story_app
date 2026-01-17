# Story Trails

A scrollable, JSON-driven storytelling atlas built with React, Vite, TypeScript, Tailwind, Framer Motion, Zod, and React Router. Pick a story from the left menu or the landing grid, then scroll through themed, animated chapters.

## Getting Started

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Build for production: `npm run build`
4. Preview production build: `npm run preview`

## Configuration

Stories live as JSON files under `public/stories/*.json`. Register them in `src/data/stories.ts` with metadata (title, cover image, theme, config path). Key fields inside each story JSON:
- `theme`: `dark-cinematic` | `light-editorial` | `bold-gradient`
- `backgroundMusic`: URL for looping ambience
- `pages[]`: each page supports `layout` (`hero`, `split`, `timeline`, `immersive`), `transition` (`fade`, `slide-up`, `slide-left`, `zoom`), `body` text, `background`/`foreground` media, and optional `actions` or `timeline` items.

### Audio assets

- Drop MP3s into `public/audio/` (e.g., `public/audio/ambient-aurora.mp3`).
- Reference them in story JSON with `"backgroundMusic": "/audio/your-file.mp3"`.

## Theming

Themes are applied via CSS variables and Tailwind. Use the theme toggle in the header or set `theme` inside each story JSON (e.g., public/stories/voyage-of-light.json) to define the default look.

## Navigation

- Left navigation lists every story and the About page (thumbnail at public/about/about.png).
- Landing page showcases all configured stories with covers and badges.

## Notes

- Fonts: Playfair Display (headings) + Manrope (body) for an elegant but readable pairing.
- Respect `storySchema` validation—invalid JSON will surface an error banner.
- Media URLs in the samples use Unsplash/Pixabay; replace with your own assets for production.
