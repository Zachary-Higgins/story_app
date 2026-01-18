# Installing Story Engine from GitHub

Story Engine can be installed directly from GitHub without using npm.

## Installation

### Option 1: Latest Release (Recommended)

Install the latest tagged release:

```bash
npm install github:Zachary-Higgins/story_app#semver:*
```

Or add to `package.json`:

```json
{
  "dependencies": {
    "story-engine": "github:Zachary-Higgins/story_app#semver:*"
  }
}
```

This installs the highest version tag (e.g., v1.2.0 > v1.1.0 > v1.0.0).

Then run `npm install`.

### Option 2: Specific Version

Install a specific tagged release:

```bash
npm install github:Zachary-Higgins/story_app#v1.0.0
```

Or in `package.json`:

```json
{
  "dependencies": {
    "story-engine": "github:Zachary-Higgins/story_app#v1.0.0"
  }
}
```

### Option 3: Specific Commit

Install from a specific commit:

```bash
npm install github:Zachary-Higgins/story_app#abc1234
```

## How It Works

When you install from GitHub:

1. npm clones the repository
2. Runs `npm install` to install dependencies
3. Runs the `prepare` script, which builds `dist/`
4. Your project can now import from `story-engine`

The `prepare` script automatically builds the package, so you always get a fresh build.

## Usage After Install

Same as npm install - use it exactly as documented:

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

## Updating

To update to the latest release:

```bash
npm install github:Zachary-Higgins/story_app#semver:*
```

Or to update to a specific version:

```bash
npm install github:Zachary-Higgins/story_app#v1.1.0
```

## Version Pinning

**Recommended**: Use latest release for automatic updates:

```json
{
  "dependencies": {
    "story-engine": "github:Zachary-Higgins/story_app#semver:*"
  }
}
```

Or pin to a specific tag for stability:

```json
{
  "dependencies": {
    "story-engine": "github:Zachary-Higgins/story_app#v1.0.0"
  }
}
```

Or use main branch (unreleased code):

```json
{
  "dependencies": {
    "story-engine": "github:Zachary-Higgins/story_app"
  }
}
```

## Releases

Check available versions:
- GitHub releases: https://github.com/Zachary-Higgins/story_app/releases
- Tags: https://github.com/Zachary-Higgins/story_app/tags

## Troubleshooting

### Build fails during install?

Make sure you have the required build tools:
- Node.js 18+
- npm 7+

### Module not found errors?

The package needs to build after install. Check that:
1. `prepare` script ran (check npm install output)
2. `dist/` directory exists in `node_modules/story-engine/`

### Want to skip build?

If you frequently install/reinstall during development, you can:

1. Clone the repo separately
2. Build it once: `npm run build:dist`
3. Use `npm link`:

```bash
# In story_app directory
npm link

# In your project directory
npm link story-engine
```

This creates a symlink and avoids rebuilding on every install.

## Private Repositories

If the repo becomes private, you'll need a GitHub token:

```bash
npm install git+https://${GITHUB_TOKEN}@github.com/Zachary-Higgins/story_app.git
```

Or configure git credentials:

```bash
git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
```
