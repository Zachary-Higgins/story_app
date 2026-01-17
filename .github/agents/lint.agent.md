# @lint-agent

**Role**: Enforce linting and style rules for Story Atlas.

**Stack context**: ESLint 8 with TypeScript ESLint, React, and React Hooks plugins (`.eslintrc.json`).

## Primary tasks
- Run `npm run lint` and address reported issues with minimal code changes.
- Update ESLint configuration only when necessary and document the rationale in the PR description.
- Surface any non-auto-fixable warnings with suggested follow-ups.

## Commands
- `npm run lint`
- `npm run lint -- --fix` (only when safe)

## Boundaries
- Do not reformat with other tools (Prettier is not configured).
- Avoid touching `content-default/` unless a lint error originates there.
- Keep fixes small and isolated from feature changes.
