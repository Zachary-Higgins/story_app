# Copilot Instructions

Use these guardrails for Copilot agents working on Story Engine (React 18 + Vite 7 + TypeScript + Tailwind).

## Project context
- This is **Story Engine**, a GitHub-installable React package. Consumers install via `npm install github:Zachary-Higgins/story_app#semver:*` (latest release) or pinned version.
- The engine exports `StoryEngine` component and `storyEnginePlugin` (Vite plugin) as separate entry points.
- Plugin auto-discovers stories: `src/plugins/contentDiscovery.ts` scans `content/stories/*.json` and generates `content/index.json`.
- Story config schema: `src/storySchema.ts` (Zod); types: `src/types/story.ts`.
- Context state: `src/context/StoryContext.tsx` (provides stories via `useStories()`).
- UI and routing live in `src/components/`, `src/pages/`, `src/utils/`, and `src/theme/`.
- Tests live in `tests/` using Vitest + React Testing Library. Tests gracefully skip if content is unavailable.
- Dev-only editors live at `/#/editor`, `/#/editor/home`, `/#/editor/about` and are backed by the `storyEditorServer` middleware (dev server only).

## Core commands (run from repo root)
- `npm install`
- `npm run lint`
- `npm test`
- `npm run dev` (http://localhost:5173, plugin auto-generates index.json)
- `npm run build:dist` (builds package to dist/)
- `npm run build:release` (lint + test + build package)

## Boundaries
- Do not add hardcoded story registry; plugin generates index at build/dev time.
- Plugin must work in both local dev and GitHub-installed context.
- No npm publishing; GitHub releases only.
- Keep docs (`README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `docs/`) in sync.
- `/content` dev folder is for testing only; not shipped in npm package.

## Package structure
- **Dual entry points**: `src/index.ts` (components) + `src/plugins/contentDiscovery.ts` (plugin)
- **Build outputs**: `dist/index.js` (main), `dist/plugin.js` (plugin), `dist/story-engine.css` (styles)
- **Install**: Consumers use `npm install github:Zachary-Higgins/story_app#semver:*` (latest release)
- **Plugin usage**: `import { storyEnginePlugin } from 'story-engine/plugin'` in vite.config

## Agents
- `test-agent`: Vitest + React Testing Library coverage, tests plugin behavior
- `lint-agent`: ESLint for TS/React, allows Node.js APIs in plugin code
- `api-agent`: Plugin architecture, schema validation, package exports
- `dev-deploy-agent`: GitHub releases, package builds, validation
- `docs-agent`: Maintains README, docs/, CONTRIBUTING, agent playbooks

## Workflow
- Make the smallest change that solves the task.
- Run `npm run lint` and `npm test` before handoff.
- Update CHANGELOG.md for user-facing changes.
- Include a short summary of what changed and why.
