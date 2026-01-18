# Story Engine - Package Repository Setup

This is a **dual-mode repository** for Story Engine. It works both as a local development environment AND as a published npm package.

## What You Can Do

### 1. **Run Locally for Development & Validation**

```bash
# Start dev server with sample content
npm run dev

# Validate everything works
npm run dev:validate        # Lint + test
npm run build:app           # Lint + test + build app
npm run validate            # Full validation: package + app
```

### 2. **Build & Publish as an npm Package**

```bash
# Build the package
npm run build:dist          # Builds dist/ with types

# Release workflow
npm run build:release       # Lint + test + build package (pre-publish)
npm publish                 # Publish to npm (runs prepublishOnly hook)
```

### 3. **Use in Consuming Projects**

Consumers install and use the package:

```typescript
// vite.config.ts
import { storyEnginePlugin } from 'story-engine/plugin';

export default defineConfig({
  plugins: [react(), storyEnginePlugin()],
  publicDir: 'content',
});

// src/main.tsx
import { StoryEngine } from 'story-engine';
import 'story-engine/dist/story-engine.css';

createRoot(document.getElementById('root')!).render(
  <StoryEngine />
);
```

## Repository Layout

```
story_app/
├── src/                    # Package source code
│   ├── index.ts           # Main entry (exports component)
│   ├── plugins/           # Vite plugins
│   │   └── contentDiscovery.ts  # Story auto-discovery plugin
│   ├── components/        # UI components
│   ├── pages/            # Page components
│   ├── types/            # TypeScript definitions
│   └── ...
├── tests/                  # Test files (Vitest + RTL)
├── dist/                   # Built package (generated)
│   ├── index.js           # Main component library
│   ├── plugin.js          # Story discovery plugin
│   ├── story-engine.css   # Compiled styles
│   └── ...
├── content/                # Sample content (dev only)
│   └── stories/
│       └── *.json
├── docs/                   # Documentation
│   ├── INTEGRATION.md      # Consumer integration guide
│   ├── STORY-AUTHORING.md # Story JSON schema
│   └── ...
├── package.json           # Package metadata + scripts
├── vite.config.ts         # Dual-mode build config
├── CHANGELOG.md           # Version history
├── LICENSE                # MIT License
└── .npmignore             # Files to exclude from npm publish
```

## Key Files

### `package.json`
- **version** - Bump this for releases
- **exports** - Defines public API (`.`, `./plugin`, `./dist/story-engine.css`)
- **files** - Only `dist/`, `README.md`, `LICENSE` are published
- **scripts** - Development and release workflows

### `vite.config.ts`
- **Dual mode**: `BUILD_TARGET=package` triggers library build
- App build: outputs to `build/`, runs stories from `content/`
- Package build: outputs to `dist/`, exports as npm module

### `src/plugins/contentDiscovery.ts`
- Vite plugin that scans `content/stories/*.json`
- Generates `content/index.json` at build/dev time
- Exported as separate entry point: `story-engine/plugin`

## Development Workflow

### Adding Features

1. Make changes in `src/`
2. Add tests in `tests/`
3. Run `npm run dev:validate` to check everything
4. Update `CHANGELOG.md`
5. Commit and push

### Local Testing

```bash
# Run dev server with sample content
npm run dev

# Add test story to content/stories/
# Plugin auto-generates index.json
# Visit http://localhost:5174 to see it
```

### Publishing

```bash
# 1. Update version and changelog
# 2. Test everything
npm run build:release

# 3. Commit, tag, and publish
git commit -m "chore: release v1.0.0"
git tag -a v1.0.0 -m "Release 1.0.0"
git push && git push --tags
npm publish
```

## Build Modes Explained

### App Build (default)
```bash
npm run build        # Builds to build/ for deployment
```
- Uses `publicDir: content`
- Includes all components + styles
- Runs plugin to generate `content/index.json`
- Output: standalone HTML/JS/CSS for deployment

### Package Build
```bash
npm run build:dist   # Builds to dist/ for npm
```
- Sets `BUILD_TARGET=package`
- Dual entry points:
  - `dist/index.js` → Main component library
  - `dist/plugin.js` → Separate Vite plugin
- Externalizes peer dependencies (React, React-DOM, Vite)
- Output: ES modules + TypeScript declarations

## npm Publishing Details

### Entry Points
```json
{
  "exports": {
    ".": "./dist/index.js",           // Main: StoryEngine component
    "./plugin": "./dist/plugin.js",   // Plugin: storyEnginePlugin()
    "./dist/story-engine.css": ...    // CSS: styles
  }
}
```

### Published Files (from `.npmignore`)
- ✅ `dist/` - All built files
- ✅ `README.md` - Package documentation
- ✅ `LICENSE` - MIT license
- ❌ `src/`, `tests/`, `config/` - Development only
- ❌ `content/`, `docs/` - Development only
- ❌ `.github/`, `vite.config.ts` - Config only

### Version Strategy
Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** - Breaking API changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes

Update [CHANGELOG.md](CHANGELOG.md) for every release.

## Validation Scripts

```bash
npm run lint                  # TypeScript + ESLint check
npm test                      # Run all tests
npm run dev:validate          # Lint + test (recommended during dev)
npm run build:app             # Lint + test + build app
npm run build:release         # Lint + test + build package
npm run validate              # FULL: release build + app build
```

## Troubleshooting

### Port 5173 already in use?
Dev server will automatically use next available port (5174, 5175, etc.)

### Plugin not discovering stories?
```bash
ls -la content/stories/       # Verify .json files exist
npm run dev                   # Check console for "[story-engine]" messages
```

### Build errors?
```bash
npm run lint                  # Check for linting issues
npm test                      # Check for test failures
rm -rf dist/ node_modules/
npm install
npm run build:dist
```

### Publishing fails?
```bash
npm run build:release         # Validate before publish
npm whoami                    # Check you're logged in
npm publish --dry-run         # Test publish
```

## Next Steps

- **For consumers**: See [docs/INTEGRATION.md](docs/INTEGRATION.md)
- **For authors**: See [docs/STORY-AUTHORING.md](docs/STORY-AUTHORING.md)
- **For developers**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Version history**: See [CHANGELOG.md](CHANGELOG.md)
