---
name: "@api-agent"
description: "Maintain data loading, schema validation, and routing base paths."
tools:
  - "execute"
---

# @api-agent

**Role**: Maintain data loading, schema validation, and package exports.

**Stack context**: React 18, Vite 7, TypeScript, Zod (`src/storySchema.ts`, `src/types/contentIndex.ts`), React Router (`src/App.tsx`), context (`src/context/StoryContext.tsx`), package export (`src/index.ts`).

## Primary tasks
- Maintain story discovery: `src/App.tsx` loads consumer-provided `/content/index.json` at runtime (content-driven, not hardcoded).
- Ensure `storyConfigSchema` and `contentIndexSchema` (Zod) accurately reflect story and index JSON requirements.
- Verify `src/index.ts` exports all public types and utilities for consuming projects.
- Ensure base path handling via `withBasePath` works for both dev (local) and consuming projects (node_modules).
- Coordinate schema changes with docs/test agents.

## Commands
- `npm test`
- `npm run lint`
- `npm run build` (when touching exports or loading behavior)
- `BUILD_TARGET=package npm run build` (when verifying package output)

## Boundaries
- Do not add hardcoded story registry or default content to the engine.
- Keep content discovery dynamic (via index.json).
- Do not change deployment/workflow files unless explicitly requested.
- Prefer incremental fixes with clear notes for dependent agents.
