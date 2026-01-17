# AI Agent Instructions for Story Atlas

This document provides guidelines for AI coding agents working on the Story Atlas project.

## Project Overview

Story Atlas is a JSON-driven interactive narrative platform built with React, Vite, and TypeScript. Stories are configured through JSON files and rendered dynamically with support for multiple layouts, media, and audio.

## Key Constraints

### File Organization
- **src/** - All TypeScript/React source code
- **content-default/** (or **content/** if provided) - JSON configs and static assets served as `publicDir`
- **config/** - Build configuration files
- **tests/** - Test files
- **Root** - Entry point (index.html), Vite config, and package files

### Story Data Structure
Stories are defined in:
1. **src/App.tsx** - `storyRegistry` array with `id` and `configPath` entries.
2. **content-default/stories/{id}.json** - Full story configuration matching `StoryConfig` schema (includes optional `badge`, `description`, `publishedAt`).

When adding a story:
- Add an entry to `storyRegistry` in `src/App.tsx` with `id` and `configPath`.
- Create the JSON in `content-default/stories/` (or your content dir) including `title`, `theme`, `pages`, and recommended `publishedAt`/`description`/`badge`.
- Validate against `src/storySchema.ts`.
- Badge on the homepage is driven by the JSON `badge`; cover image is auto-derived from the first page `foreground` or `background`.

### Configuration Files
Located in **content-default/** (or provided content dir) and served as static assets:
- `home.json` - Hero section, navigation title
- `about.json` - About page content
- `social.json` - Social media links array
- `stories/` - Individual story configurations

These are loaded dynamically via fetch() and must remain in the content folder.

## Development Workflow

### Running the App
```bash
npm install      # Install dependencies
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production
```

### Key Technologies
- **React 18** with Hooks
- **Vite 5** - Fast build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with CSS variables for theming
- **Zod** - Schema validation for story configs
- **React Router 6** - Navigation
- **Framer Motion** - Animations

### Component Architecture
- **pages/** - Route-level components (LandingPage, StoryView, AboutPage)
- **components/** - Reusable UI components
  - **sections/** - Story layout renderers (HeroSection, SplitSection, TimelineSection, ImmersiveSection)
  - **Navigation.tsx** - Sidebar with expand/collapse (compact mode at aspect ≤ 1)
  - **ThemeToggle.tsx** - Theme switcher
  - **AudioController.tsx** - Music player
  - **ScrollProgress.tsx** - Scroll indicator
- **types/** - TypeScript interfaces
- **theme/** - Theme definitions and CSS variables

### Styling
- Tailwind CSS with responsive design (md: breakpoints)
- Three themes: dark-cinematic, light-editorial, bold-gradient
- CSS variables for dynamic theming (--color-surface, --color-text, --color-accent, etc.)
- Responsive layout: sidebar collapses; on aspect ≤ 1 it hides until expanded via floating button.

### Story Validation
All stories must validate against `src/storySchema.ts` Zod schema. Schema includes:
- `theme` - ThemeName
- `title`, `subtitle`, `description` (optional)
- `publishedAt` (optional but recommended)
- `badge` (optional)
- `backgroundMusic`
- `pages` - array of StoryPage objects with layouts (hero, split, timeline, immersive)
- `timeline`, `emphasis` - metadata arrays
- `media` - asset definitions

### Audio Handling
- Audio files in `content/audio/`
- Muted autoplay on page load (browser compliance)
- First user interaction unmutes audio
- Verify paths reference existing files before deploying

### Typography
- Display font: Playfair Display
- Body font: Manrope
- Use font-display / font-body Tailwind classes

### Responsive Design
- Mobile-first approach
- Sidebar collapses on mobile (w-16)
- All main content has pl-16 md:pl-80 padding for sidebar
- Use md: breakpoint for tablet+ layouts

## Common Tasks

### Adding a New Story
1. Create JSON in `content-default/stories/my-story.json` with full configuration (include `title`, `theme`, `pages`, and recommended `publishedAt`, `description`, `badge`).
2. Add `{ id: 'my-story', configPath: '/stories/my-story.json' }` to `storyRegistry` in `src/App.tsx`.
3. Validate against `src/storySchema.ts` using Zod.

### Modifying Home/About/Social
1. Edit the JSON in `content/`
2. Components fetch these files dynamically
3. No code changes needed unless schema changes

### Updating Configuration Files
Always use Vite's `publicDir: 'content'` setting. This serves the entire content/ folder as static assets.

### Debugging
- Check browser console for client-side errors
- Check Vite terminal for build errors
- Validate JSON files: use storySchema.ts tests
- Hot reload works for app/ changes; refresh for content/ changes

## Commit Messages
Use clear, descriptive messages:
- `feat: add new story about X`
- `fix: correct audio path in story Y`
- `refactor: reorganize components structure`
- `docs: update contributing guide`

## Important Notes
- **Never** move files without using the appropriate terminal commands (Windows PowerShell Move-Item, not Unix mv)
- **Always** validate story JSON against schema before committing
- **Keep** app/ and content/ separation strict
- **Test** responsive design on mobile devices
- **Use** Intl.DateTimeFormat for date formatting (cross-browser compatibility)

## Useful Commands
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

---

For questions or clarifications, refer to the project README.md and component source files.
