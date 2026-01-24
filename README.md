[![Validate Package](https://github.com/Zachary-Higgins/story_app/actions/workflows/test.yml/badge.svg)](https://github.com/Zachary-Higgins/story_app/actions/workflows/test.yml)
[![Create Release](https://github.com/Zachary-Higgins/story_app/actions/workflows/release.yml/badge.svg)](https://github.com/Zachary-Higgins/story_app/actions/workflows/release.yml)

# Story Engine

JSON-driven React storytelling engine. You supply a `content/` folder with story files and assets; the engine handles routing, themes, and rendering.

![Story Engine Screenshot](docs/images/screenshot.png)

## Install

Recommended: start from the template (pre-wired Vite + Story Engine + content folder).
https://github.com/Zachary-Higgins/story_app_template

Or install directly:
```bash
npm install github:Zachary-Higgins/story_app#semver:*
```

## Quick Start

1) Create `content/stories/*.json` (the plugin generates `content/index.json` for you).
2) Add media under `content/images`, `content/videos`, `content/audio`.
3) Start the dev server: `npm run dev`.

## Content Basics

- Story files: `content/stories/{id}.json`
- Required fields: `title`, `theme`, `pages[]`
- Optional `citations[]` on the story and each page (rendered at the bottom of each card)
- Layouts: `hero`, `split`, `timeline`, `immersive`
- Themes: `dark-cinematic`, `light-editorial`, `bold-gradient`

## Dev Editors

The dev server includes editors for content and stories (not shipped in production builds):

- Story Editor: `/#/editor`
- Home Editor: `/#/editor/home`
- About Editor: `/#/editor/about`

These routes are only enabled in dev (`npm run dev`) and use a dev-only Vite middleware for saving JSON and managing media assets.

For consuming projects, pass `editorEnabled={import.meta.env.DEV}` to `<StoryEngine />` and add `storyEditorServer()` to the Vite plugins when `command === 'serve'`.

## Scripts

- `npm run dev` — local dev with content folder
- `npm test` — tests
- `npm run build:dist` — package build
- `npm run build:release` — lint + test + package build

## Docs
- [docs/INSTALL-FROM-GITHUB.md](docs/INSTALL-FROM-GITHUB.md) — install & version pinning
- [docs/INTEGRATION.md](docs/INTEGRATION.md) — full setup guide
- [docs/STORY-AUTHORING.md](docs/STORY-AUTHORING.md) — schema & examples
- [CONTRIBUTING.md](CONTRIBUTING.md) — dev workflow
