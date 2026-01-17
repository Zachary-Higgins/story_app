# AI Agent Instructions for Story Atlas

This document provides guidelines for AI coding agents working on the Story Atlas project.

## Project Overview

Story Atlas is a JSON-driven interactive narrative platform built with React, Vite, and TypeScript. Stories are configured through JSON files and rendered dynamically with support for multiple layouts, media, and audio.

## Key Constraints

### File Organization
- **app/** - All TypeScript/React source code (imported files)
- **content/** - All JSON configs and static assets (not code; served as static files)
- **config/** - Build configuration files
- **tests/** - Test files
- **Root** - Only entry point (index.html), Vite config, and package files

### Story Data Structure
Stories are defined in two places:
1. **app/data/stories.ts** - `StoryMeta` interface with metadata (id, title, subtitle, theme, configPath, publishedAt)
2. **content/stories/{id}.json** - Full story configuration matching `StoryConfig` schema (supports optional `badge` to display on the homepage)

When adding a story:
- Add entry to `stories` array in `app/data/stories.ts`
- Create corresponding JSON file in `content/stories/`
- Always include `publishedAt` (ISO 8601 format) for proper sorting
- Validate against `storySchema.ts`
 - Optional: set `badge` (e.g., "Featured", "New") in the story JSON to control the homepage badge

### Configuration Files
Located in **content/** and served as static assets:
- `home.json` - Hero section, navigation title
- `about.json` - About page content
- `social.json` - Social media links array
- `stories/` - Individual story configurations

These are loaded dynamically via fetch() and must remain in content folder.

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
  - **Navigation.tsx** - Sidebar with expand/collapse
  - **ThemeToggle.tsx** - Theme switcher
  - **AudioController.tsx** - Music player
  - **ScrollProgress.tsx** - Scroll indicator
- **data/** - Data utilities (stories.ts with story metadata and formatDate)
- **types/** - TypeScript interfaces
- **theme/** - Theme definitions and CSS variables

### Styling
- Tailwind CSS with responsive design (md: breakpoints)
- Three themes: dark-cinematic, light-editorial, bold-gradient
- CSS variables for dynamic theming (--color-surface, --color-text, --color-accent, etc.)
- Responsive layout: sidebar fixed at w-16 (collapsed) / w-72 (expanded), main content pl-16 md:pl-80

### Story Validation
All stories must validate against `storySchema.ts` Zod schema. Schema includes:
- `theme` - ThemeName
- `title`, `subtitle` - strings
- `backgroundMusic` - audio file reference
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
1. Create JSON in `content/stories/my-story.json` with full configuration
2. Add to `app/data/stories.ts`:
   ```typescript
   {
     id: 'my-story',
     title: 'Story Title',
     subtitle: 'Story subtitle',
     theme: 'dark-cinematic',
     configPath: '/stories/my-story.json',
     publishedAt: '2026-01-17T00:00:00Z'
   }
   ```
3. Validate against storySchema using Zod

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
