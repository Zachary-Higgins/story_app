# Story authoring guide

Use this guide to craft or update JSON story configs in `content/` (or `content-default/` as a reference). All stories must validate against `src/storySchema.ts` and use paths relative to the content root.

## Content locations and helpers
- Place your live assets in `content/` (`stories/`, `images/`, `videos/`, `audio/`). The app falls back to `content-default/` when a file is missing.
- If supporting materials are provided, check the `/research/` folder before starting; keep the folder intact when adding new artifacts.
- Home, About, and Social pages live in `home.json`, `about.json`, and `social.json` in the same directory.

## Story config shape
Top-level fields (see `StoryConfig` in `src/storySchema.ts`):
- `theme`: one of `dark-cinematic`, `light-editorial`, `bold-gradient`.
- `title`, `subtitle?`, `description?`, `badge?`, `publishedAt?` (ISO 8601), `backgroundMusic?` (e.g., `/audio/ambient.mp3`).
- `pages`: array of page objects described below.

Media objects:
- `type`: `image` | `video`
- `src`: relative or https URL (schema blocks other protocols)
- `alt?`: accessible description
- `loop?`, `autoPlay?`: optional hints (video renders muted, looping, inline by default)

Actions and timeline helpers:
- `actions?`: `{ label, href }[]` rendered as CTA buttons on `hero` and `split` pages.
- `timeline?`: `{ title, subtitle?, description, marker? }[]` for the `timeline` layout.
- `emphasis?`: short highlight text box on `split` pages.

## Page layouts
Each page needs `id`, `title`, `body` (string array), `layout`, and optional `kicker`, `transition` (`fade`, `slide-up`, `slide-left`, `zoom`), `background`, `foreground`, `actions`, `timeline`, `emphasis`.

- **hero**: full-bleed background image/video with gradient overlay; optional `foreground` card on desktop; supports `actions`.
- **split**: text and media side-by-side; uses `background` (or `foreground` fallback) for the visual; supports `emphasis` and `actions`.
- **timeline**: summary text plus a grid of `timeline` entries; `background`/`foreground` are typically omitted.
- **immersive**: full-bleed `background` behind centered text; best for mood or long-form sections.

## Workflow for new stories
1. Copy a sample from `content-default/stories/` into `content/stories/your-id.json`.
2. Update metadata, theme, and pages using the layouts above; keep media paths relative to the content root (e.g., `/images/cover.jpg`).
3. Add `{ id: 'your-id', configPath: '/stories/your-id.json' }` to `storyRegistry` in `src/App.tsx`.
4. Run `npm test` to validate JSON against the schema.
5. When shipping, keep the `/research/` artifacts untouched and commit only JSON plus required media.
