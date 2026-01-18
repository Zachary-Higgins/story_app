# Story Engine - Real Package Repository ✅

Your repository is now configured as a **professional npm package** with full local development support.

## What's New

### ✅ Professional Package Setup
- **package.json**: Complete metadata (author, license, repository, keywords, bugs)
- **LICENSE**: MIT license included
- **CHANGELOG.md**: Version history tracking
- **PACKAGE-REPO.md**: Complete repository guide
- **.npmignore**: Proper file exclusion for npm publish
- **Updated CONTRIBUTING.md**: Developer workflow documentation

### ✅ Dual-Mode Build System
**Same repo, two purposes:**

```bash
npm run dev              # Run locally with sample content
npm run build:dist       # Build for npm publish
```

### ✅ Release Workflow Scripts
```bash
npm run build:release    # Full validation before publish
npm run validate         # FULL: package build + app build
npm publish              # Auto-validates via prepublishOnly hook
```

### ✅ Updated Scripts
```bash
# Development
npm run dev              # Run dev server locally
npm run dev:validate     # Lint + test during development
npm run build:app        # Build app (lint → test → build)

# Package release
npm run build:dist       # Build package (dist/ with types)
npm run build:release    # Lint + test + build package
npm run validate         # Full validation: release + app
npm publish              # Publish to npm (auto-validates)

# Quality assurance
npm run lint             # Check code quality
npm test                 # Run tests
npm run test:coverage    # Generate coverage report
```

## File Structure

New files:
- **CHANGELOG.md** - Version history (update on each release)
- **LICENSE** - MIT license
- **PACKAGE-REPO.md** - Complete repository guide
- Updated **CONTRIBUTING.md** - Developer workflow
- Updated **.npmignore** - Proper npm publishing config
- Updated **package.json** - Metadata + new scripts

## How It Works

### Local Development
```bash
npm run dev
```
- ✅ Runs Vite dev server
- ✅ Serves from `content/` directory
- ✅ Plugin auto-discovers stories from `content/stories/*.json`
- ✅ Hot reload on changes

### Package Build
```bash
npm run build:dist
```
- ✅ Builds to `dist/` (separate from app build in `build/`)
- ✅ Generates TypeScript declarations
- ✅ Creates:
  - `dist/index.js` - Main component library
  - `dist/plugin.js` - Vite plugin for story discovery
  - `dist/story-engine.css` - Compiled styles

### Publishing
```bash
npm run build:release  # Validate everything
npm publish            # Publish to npm (runs prepublishOnly)
```
- ✅ Lint checks pass
- ✅ Tests pass
- ✅ Package builds successfully
- ✅ Types generate correctly
- ✅ Only `dist/`, `README.md`, `LICENSE` published

## Consuming Projects

Consumers can now use the package:

```bash
npm install story-engine
```

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

See [docs/INTEGRATION.md](docs/INTEGRATION.md) for full details.

## Version Management

When releasing:

1. **Update version** in `package.json`
   ```json
   "version": "1.0.0"
   ```

2. **Update CHANGELOG.md**
   ```markdown
   ## [1.0.0] - 2026-01-20

   ### Added
   - New feature
   
   ### Fixed
   - Bug fix
   ```

3. **Test release build**
   ```bash
   npm run build:release  # Lint + test + build
   ```

4. **Tag and publish**
   ```bash
   git add .
   git commit -m "chore: release v1.0.0"
   git tag -a v1.0.0 -m "Release 1.0.0"
   git push && git push --tags
   npm publish
   ```

## Current Build Output

✅ **App Build** (for deployment)
- Entry: `src/App.tsx`
- Output: `build/`
- Includes: All components, styles, sample content loader
- Use case: Standalone deployments

✅ **Package Build** (for npm)
- Entries: `src/index.ts` + `src/plugins/contentDiscovery.ts`
- Output: `dist/`
- Files:
  - `dist/index.js` (299 KB gzipped: 76 KB)
  - `dist/plugin.js` (0.96 KB gzipped: 0.51 KB)
  - `dist/story-engine.css` (25.88 KB gzipped: 5.12 KB)
- Types: Full `.d.ts` files included
- Use case: npm package for consumers

## Quality Checks

- ✅ **Linting**: ESLint + TypeScript strict mode
- ✅ **Testing**: 33 tests passing (Vitest + React Testing Library)
- ✅ **Build**: Both app and package build successfully
- ✅ **Types**: Full TypeScript declarations generated
- ✅ **CSS**: Properly bundled and exported

## Next Steps

1. **Review** [PACKAGE-REPO.md](PACKAGE-REPO.md) for full repository guide
2. **Test** local development with `npm run dev`
3. **Review** [docs/INTEGRATION.md](docs/INTEGRATION.md) for consumer documentation
4. **Publish** to npm when ready (see version management above)
5. **Update** [CHANGELOG.md](CHANGELOG.md) before each release

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run dev:validate     # Lint + test

# Building
npm run build            # Build app (build/)
npm run build:dist       # Build package (dist/)

# Quality
npm run lint             # Check code
npm test                 # Run tests

# Release
npm run build:release    # Full pre-publish validation
npm publish              # Publish to npm

# Full validation
npm run validate         # Build package + build app + all checks
```

---

Your repo is now ready for professional npm package distribution! 🚀
