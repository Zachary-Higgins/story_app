# Copilot Instructions

Use these guardrails for Copilot agents working on Story Atlas (React 18 + Vite 7 + TypeScript + Tailwind).

## Project context
- Stories and assets live in `content-default/` (served as `publicDir`). Story registry is in `src/App.tsx`; schema is in `src/storySchema.ts`.
- UI and routing live in `src/components/`, `src/pages/`, `src/utils/`, and `src/theme/`.
- Tests live in `tests/` using Vitest + React Testing Library.

## Core commands (run from repo root)
- `npm install`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run dev` (http://localhost:5173) / `npm run preview`

## Boundaries
- Keep `content-default/` paths stable; validate JSON changes against `src/storySchema.ts` and tests.
- Prefer minimal diffs; avoid adding dependencies unless necessary.
- Do not alter GitHub workflows or deployment settings unless requested.
- Keep docs (`README.md`, `AGENTS.md`, `SECURITY.md`, `CONTRIBUTIONS.md`, `.github/agents`) consistent when updating guidance.

## Agents
Use the playbooks in `.github/agents`:
- `docs-agent`: documentation and examples.
- `test-agent`: Vitest + React Testing Library coverage.
- `lint-agent`: ESLint fixes for TS/React.
- `api-agent`: data loading, schema, and base path handling.
- `dev-deploy-agent`: dev server, builds, and release handoff.

## Workflow
- Make the smallest change that solves the task.
- Run lint/tests before handoff; include a short summary of what changed and why.
