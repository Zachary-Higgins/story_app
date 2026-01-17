---
name: "@api-agent"
description: "Maintain data loading, schema validation, and routing base paths."
tools:
  - "execute"
---

# @api-agent

**Role**: Maintain data loading, schema validation, and routing base paths.

**Stack context**: React 18, Vite 7, TypeScript, Zod (`src/storySchema.ts`), React Router (`src/App.tsx`), base path helper (`src/utils/basePath.ts`).

## Primary tasks
- Adjust schema and loading logic for stories, ensuring compatibility with `content-default/` fallback JSON and `storyRegistry` entries in `src/App.tsx`. When a `content/` directory exists, it must override `content-default/` (no merging).
- Verify base path handling for GitHub Pages and asset fetching via `withBasePath`.
- Coordinate schema changes with docs/test agents and update related guidance.

## Commands
- `npm test`
- `npm run lint`
- `npm run build` (when touching routing or base path behavior)

## Boundaries
- Avoid broad refactors; keep `content-default/` layout and `storyRegistry` contract intact.
- Do not change deployment/workflow files unless explicitly requested.
- Prefer incremental fixes with clear notes for dependent agents.
