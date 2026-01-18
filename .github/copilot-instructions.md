# Copilot Instructions

Use these guardrails for Copilot agents working on Story Atlas (React 18 + Vite 7 + TypeScript + Tailwind).

## Project context
- This is **Story Engine**, a reusable npm package. Content is consumer-provided (not in this repo).
- The engine exports `StoryEngine` component and utilities from `src/index.ts`.
- Story discovery is content-driven: `src/App.tsx` loads `/content/index.json` at runtime (schema: `contentIndexSchema`).
- Story config schema: `src/storySchema.ts` (Zod); types: `src/types/story.ts`.
- Context state: `src/context/StoryContext.tsx` (provides stories via `useStories()`).
- UI and routing live in `src/components/`, `src/pages/`, `src/utils/`, and `src/theme/`.
- Tests live in `tests/` using Vitest + React Testing Library. Tests gracefully skip if content is unavailable.

## Core commands (run from repo root)
- `npm install`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run dev` (http://localhost:5173) / `npm run preview`

## Boundaries
- Do not add hardcoded story registry or default content to the engine package.
- Content discovery must remain dynamic (via `/content/index.json`).
- Prefer minimal diffs; avoid adding dependencies unless necessary.
- Do not alter GitHub workflows or deployment settings unless requested.
- Keep docs (`README.md`, `SECURITY.md`, `CONTRIBUTING.md`, `docs/AGENTS.md`) and `.github/agents/*` playbooks in sync.
- `/content` dev folder is for testing only; not shipped in npm package.

## AgentsPackage documentation and consuming project examples.
- `test-agent`: Vitest + React Testing Library coverage (tests gracefully handle missing content).
- `lint-agent`: ESLint fixes for TS/React.
- `api-agent`: Content discovery, schema validation, and package exports.
- `dev-deploy-agent`: Dev/app builds and npm package builds
- `api-agent`: data loading, schema, and base path handling.
- `dev-deploy-agent`: dev server, builds, and release handoff.

## Workflow
- Make the smallest change that solves the task.
- Run lint/tests before handoff; include a short summary of what changed and why.
