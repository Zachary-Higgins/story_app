import { ThemeName, type StoryPage } from '../types/story';
import { storyConfigSchema, type StoryConfig } from '../storySchema';
import { withBasePath } from '../utils/basePath';

export interface StoryMeta {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  theme: ThemeName;
  cover: string;
  configPath: string;
  badge?: string;
  publishedAt: string; // ISO 8601 date string
}

export interface StoryRegistryEntry {
  id: string;
  configPath: string;
}

// Minimal registry: only id and configPath. All other data comes from story JSON configs.
export const storyRegistry: StoryRegistryEntry[] = [
  { id: 'voyage-of-light', configPath: '/stories/voyage-of-light.json' },
  { id: 'tides-of-the-blue', configPath: '/stories/tides-of-the-blue.json' },
];

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function findStoryConfig(id?: string | null) {
  if (!id) return undefined;
  return storyRegistry.find((story) => story.id === id);
}

function deriveCover(pages: StoryPage[]) {
  const firstPage = pages?.[0];
  return firstPage?.foreground?.src || firstPage?.background?.src || '';
}

export function toStoryMeta(entry: StoryRegistryEntry, config: StoryConfig, resolvedPath?: string): StoryMeta {
  return {
    id: entry.id,
    title: config.title,
    subtitle: config.subtitle,
    description: config.description || config.subtitle || config.title,
    theme: config.theme,
    cover: withBasePath(deriveCover(config.pages)),
    configPath: resolvedPath ?? withBasePath(entry.configPath),
    badge: config.badge,
    publishedAt: config.publishedAt || new Date().toISOString(),
  };
}

export async function loadStoryConfig(entry: StoryRegistryEntry) {
  const configPath = withBasePath(entry.configPath);
  const res = await fetch(configPath);
  if (!res.ok) throw new Error(`Unable to load story "${entry.id}"`);
  const raw = await res.json();
  const parsed = storyConfigSchema.safeParse(raw);
  if (!parsed.success) throw new Error(`Story config failed validation for "${entry.id}"`);
  return { config: parsed.data, configPath };
}
