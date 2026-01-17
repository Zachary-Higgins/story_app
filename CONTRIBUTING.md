# Contributing to Story Atlas

We appreciate your interest in contributing to Story Atlas. This is the base app used to ship custom story deployments by swapping in different content directories. This repository is **only** for the reusable application—please do not submit custom story content here. Separate usage guidelines for running your own stories will be provided later. This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

## Project Structure

- **src/** - React/TypeScript source code
- **content-default/** (or **content/** if provided) - JSON configuration files and media assets. Copy `content-default/` to `content/` when preparing a new deployment so the app uses your version automatically.
  - `stories/` - Story JSON configurations
  - `home.json` - Homepage configuration
  - `about.json` - About page configuration
  - `social.json` - Social links configuration
  - `audio/`, `images/`, `videos/` - Media assets
- **Root config files** - `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, and TypeScript configs
- **tests/** - Unit and integration tests

## Code Style

- Use TypeScript for all source files
- Follow existing code patterns and naming conventions
- Use Tailwind CSS for styling
- Components should be functional and use React hooks

## Adding New Stories

1. Create a new JSON file in `content-default/stories/` (or your content dir) following `src/storySchema.ts`.
2. Include `title`, `theme`, `pages`, and recommended `description`, `badge`, `publishedAt`.
3. Add `{ id, configPath }` to `storyRegistry` in `src/App.tsx`.

## Testing

Run tests with:
```bash
npm test
```

## Submitting Changes

1. Commit with clear, descriptive messages
2. Push to your fork
3. Create a Pull Request with a clear description
4. Wait for review and address any feedback

## Reporting Issues

Please use GitHub Issues to report bugs or suggest features. Include:
- Clear description of the issue
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

## Code of Conduct

Please be respectful and inclusive in all interactions with the community.
