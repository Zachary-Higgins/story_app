import { describe, it, expect } from 'vitest';
import { formatDate, findStory, stories } from '../src/data/stories';

describe('formatDate', () => {
  it('should format ISO date to readable format', () => {
    const date = '2026-01-15T00:00:00Z';
    const formatted = formatDate(date);
    expect(formatted).toMatch(/Jan 1[45], 2026/);
  });

  it('should handle different months correctly', () => {
    const formatted1 = formatDate('2026-12-25T00:00:00Z');
    expect(formatted1).toMatch(/Dec 2[45], 2026/);
    const formatted2 = formatDate('2026-03-01T00:00:00Z');
    expect(formatted2).toMatch(/Mar 1, 2026|Feb 2[89], 2026/);
  });

  it('should format dates with timezone', () => {
    const date = '2026-01-10T12:30:00Z';
    const formatted = formatDate(date);
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Jan');
  });
});

describe('findStory', () => {
  it('should find story by id', () => {
    const story = findStory('voyage-of-light');
    expect(story).toBeDefined();
    expect(story?.id).toBe('voyage-of-light');
    expect(story?.title).toBe('Voyage of Light');
  });

  it('should return undefined for non-existent story', () => {
    const story = findStory('non-existent');
    expect(story).toBeUndefined();
  });

  it('should return undefined when id is undefined', () => {
    const story = findStory(undefined);
    expect(story).toBeUndefined();
  });
});

describe('stories array', () => {
  it('should contain story entries', () => {
    expect(stories.length).toBeGreaterThan(0);
  });

  it('should have all required fields', () => {
    stories.forEach((story) => {
      expect(story).toHaveProperty('id');
      expect(story).toHaveProperty('title');
      expect(story).toHaveProperty('subtitle');
      expect(story).toHaveProperty('theme');
      expect(story).toHaveProperty('configPath');
      expect(story).toHaveProperty('publishedAt');
    });
  });

  it('should be sorted by publishedAt (newest first)', () => {
    for (let i = 0; i < stories.length - 1; i++) {
      const current = new Date(stories[i].publishedAt);
      const next = new Date(stories[i + 1].publishedAt);
      expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
    }
  });

  it('should have valid theme values', () => {
    const validThemes = ['dark-cinematic', 'light-editorial', 'bold-gradient'];
    stories.forEach((story) => {
      expect(validThemes).toContain(story.theme);
    });
  });

  it('should have valid config paths', () => {
    stories.forEach((story) => {
      expect(story.configPath).toMatch(/^\/stories\/.+\.json$/);
    });
  });
});
