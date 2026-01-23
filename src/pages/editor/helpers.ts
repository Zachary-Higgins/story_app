import type { ActionLink, MediaAsset, StoryConfig, StoryPage, TimelineEntry } from '../../types/story';

export const STORY_ID_PATTERN = /^[a-zA-Z0-9-_]+$/;
const DEFAULT_MEDIA_IMAGE = '/images/reef_card1_bg.jpg';

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to) return items;
  const next = [...items];
  const [removed] = next.splice(from, 1);
  next.splice(to, 0, removed);
  return next;
}

export function normalizeOptional(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export function toTitleCase(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function createMediaTemplate(): MediaAsset {
  return {
    type: 'image',
    src: DEFAULT_MEDIA_IMAGE,
    alt: 'Media',
  };
}

export function createActionTemplate(): ActionLink {
  return {
    label: 'Learn more',
    href: '/',
  };
}

export function createCitationTemplate() {
  return {
    label: 'Source',
    url: 'https://example.com',
  };
}

export function createTimelineTemplate(): TimelineEntry {
  return {
    title: 'Milestone',
    subtitle: '',
    description: 'Describe this moment.',
    marker: '',
  };
}

export function createPageTemplate(index: number): StoryPage {
  return {
    id: `section-${index}`,
    title: `Section ${index}`,
    kicker: 'Chapter',
    body: ['Write the narrative for this section.'],
    layout: 'split',
    transition: 'fade',
  };
}

export function createStoryTemplate(id: string): StoryConfig {
  const now = new Date().toISOString();
  return {
    theme: 'dark-cinematic',
    title: toTitleCase(id) || 'New Story',
    subtitle: 'Add a short subtitle',
    description: 'Add a story description',
    publishedAt: now,
    backgroundMusic: undefined,
    badge: 'Draft',
    pages: [createPageTemplate(1)],
  };
}
