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

// Stories are loaded dynamically from JSON configs via App or pages that need them
export const stories: StoryMeta[] = [];

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
