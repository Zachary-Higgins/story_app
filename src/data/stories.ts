import { ThemeName } from '../types/story';

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

const rawStories: StoryMeta[] = [
  {
    id: 'voyage-of-light',
    title: 'Voyage of Light',
    subtitle: 'How light reveals the universe',
    description: 'Trace auroras, prisms, and telescopes in a cinematic journey through color and cosmos.',
    theme: 'dark-cinematic',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fm=jpg&q=80&w=1400&fit=crop',
    configPath: '/stories/voyage-of-light.json',
    badge: 'Featured',
    publishedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'tides-of-the-blue',
    title: 'Tides of the Blue',
    subtitle: 'Stories from the living ocean',
    description: 'Dive through currents, reef cities, and the twilight zone with soundscapes and gradients.',
    theme: 'bold-gradient',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fm=jpg&q=80&w=1400&fit=crop',
    configPath: '/stories/tides-of-the-blue.json',
    badge: 'New',
    publishedAt: '2026-01-15T00:00:00Z',
  },
];

// Sort by date, newest first
export const stories = rawStories.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function findStory(id?: string | null) {
  if (!id) return undefined;
  return stories.find((story) => story.id === id);
}
