# Contributing to Story Engine

We appreciate your interest in contributing to Story Engine. This is a **reusable npm package**—both a component library and a development environment for building storytelling experiences.

This document provides guidelines for contributing to the project.

## Repository Structure

This repo serves **two purposes**:

1. **Local development environment** - Run `npm run dev` to test the package locally with sample content
2. **Published npm package** - Consumers install via `npm install story-engine` and use `StoryEngine` component + plugin

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development & Validation

### Run locally for validation:
```bash
npm run dev              # Start dev server with sample content
npm run dev:validate    # Run linter + tests in watch mode
npm run build:app       # Full validation: lint → test → build
```

The app will be available at `http://localhost:5173` (or next available port).

### Build the package:
```bash
npm run build:dist      # Build library (dist/) with types
npm run build:release   # Lint + test + build package (pre-publish)
npm run validate        # Full validation: build package + build app
```

### Run tests:
```bash
npm test                # Run all tests
npm run test:ui         # Run tests with UI
npm run test:coverage   # Generate coverage report
```

### Linting:
```bash
npm run lint            # Check TypeScript + ESLint
```

## Project Structure

- **src/** - React/TypeScript source code
  - `components/` - UI components (HeroSection, SplitSection, etc.)
  - `pages/` - Page components (StoryView, LandingPage, AboutPage)
  - `context/` - React Context (StoryContext for story state)
  - `plugins/` - Vite plugins (storyEnginePlugin for story discovery)
  - `types/` - TypeScript type definitions
  - `theme/` - Theme system with CSS variables
  - `utils/` - Utility functions (basePath, safeUrl)
  - `index.ts` - Package entry point (exports component + types)

- **tests/** - Test files (Vitest + React Testing Library)

- **content/** (dev only) - Sample story content for local development
  - `stories/` - Story JSON files
  - `images/`, `videos/`, `audio/` - Media assets

- **dist/** - Built package (generated, not in git)
  - `index.js` - Main component library
  - `plugin.js` - Vite plugin for story discovery
  - `story-engine.css` - Compiled styles

- **config/** - Build configuration
  - `eslint/` - ESLint rules
  - `vitest.config.ts` - Test configuration

## Making Changes

### Adding a Feature

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes in `src/`
3. Add tests in `tests/`
4. Run `npm run dev:validate` to check your work
5. Update [CHANGELOG.md](CHANGELOG.md) under `[Unreleased]`
6. Commit and push to your fork
7. Open a pull request

### Testing Content

Add test stories to `content/stories/` and run `npm run dev` to see them locally:

```bash
# content/stories/my-test-story.json
{
  "id": "my-test-story",
  "title": "Test Story",
  "subtitle": "Testing new features",
  "theme": "dark-cinematic",
  "pages": [
    {
      "id": "page-1",
      "layout": "hero",
      "title": "Welcome"
    }
  ]
}
```

The plugin auto-generates `content/index.json` from files in `content/stories/`.

## Publishing

When ready to publish a new version:

1. Update version in [package.json](package.json)
2. Update [CHANGELOG.md](CHANGELOG.md) with version and changes
3. Run `npm run build:release` to validate everything
4. Commit: `git commit -m "chore: release v1.0.0"`
5. Tag: `git tag -a v1.0.0 -m "Release 1.0.0"`
6. Push: `git push && git push --tags`
7. Publish: `npm publish` (or use CI/CD if configured)

The `prepublishOnly` script will automatically validate before publishing.

## Code Quality

- **TypeScript** - Strict mode enabled
- **ESLint** - React + React Hooks rules
- **Tests** - Vitest + React Testing Library (33 tests)
- **Formatting** - Run `npm run lint` to check

## Troubleshooting

### Plugin not working in local dev?
```bash
npm run dev              # Make sure content/stories exists
ls -la content/stories   # Verify story JSON files
```

### Tests failing?
```bash
npm test                 # Run tests to see details
npm run test:coverage    # Check coverage
```

### Build errors?
```bash
rm -rf dist/ node_modules/
npm install
npm run build:dist
```

  - `audio/`, `images/`, `videos/` - Media assets
- **Root config files** - `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, and TypeScript configs
- **tests/** - Unit and integration tests

## Code Style

- Use TypeScript for all source files
- Follow existing code patterns and naming conventions
- Use Tailwind CSS for styling
- Components should be functional and use React hooks

## Adding New Stories

1. Create a new JSON file in `content/stories/` (or your content dir) following `src/storySchema.ts`.
2. Include `title`, `theme`, `pages`, and recommended `description`, `badge`, `publishedAt`.
3. Run `npm run dev` or build to regenerate `content/index.json` via the plugin.

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
