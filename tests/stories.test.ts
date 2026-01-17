import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { storyConfigSchema, type StoryConfig } from '../src/storySchema';
import { formatDate } from '../src/data/stories';

// Load real story data from content-default
function loadStoryFile(filename: string) {
  const filePath = resolve(`content-default/stories/${filename}`);
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

function getStoryFiles() {
  const dir = resolve('content-default/stories');
  return readdirSync(dir).filter((f) => f.endsWith('.json'));
}

describe('formatDate', () => {
  it('should format story publishedAt dates correctly', () => {
    const storyFiles = getStoryFiles();
    expect(storyFiles.length).toBeGreaterThan(0);

    storyFiles.forEach((filename) => {
      const story = loadStoryFile(filename);
      if (story.publishedAt) {
        const formatted = formatDate(story.publishedAt);
        // Should contain year and month
        expect(formatted).toMatch(/\d{4}/); // year
        expect(formatted).toMatch(/[A-Z][a-z]{2}/); // 3-letter month
      }
    });
  });

  it('should handle ISO 8601 dates from stories', () => {
    const voyageStory = loadStoryFile('voyage-of-light.json');
    const formatted = formatDate(voyageStory.publishedAt);
    expect(formatted).toContain('2026');
  });

  it('should handle tides story publishedAt', () => {
    const tidesStory = loadStoryFile('tides-of-the-blue.json');
    const formatted = formatDate(tidesStory.publishedAt);
    expect(formatted).toContain('2026');
  });
});

describe('Story JSON files in content-default', () => {
  it('should have all story files', () => {
    const files = getStoryFiles();
    expect(files.length).toBeGreaterThan(0);
    expect(files).toContain('voyage-of-light.json');
    expect(files).toContain('tides-of-the-blue.json');
  });

  it('should validate voyage-of-light.json against schema', () => {
    const story = loadStoryFile('voyage-of-light.json');
    const result = storyConfigSchema.safeParse(story);
    expect(result.success).toBe(true);
  });

  it('should have valid voyage-of-light metadata', () => {
    const story = loadStoryFile('voyage-of-light.json');
    expect(story.title).toBe('Voyage of Light');
    expect(story.theme).toBe('dark-cinematic');
    expect(story.subtitle).toBe('How light reveals the universe');
    expect(story.publishedAt).toBe('2026-01-10T00:00:00Z');
    expect(story.badge).toBe('Featured');
  });

  it('should validate tides-of-the-blue.json against schema', () => {
    const story = loadStoryFile('tides-of-the-blue.json');
    const result = storyConfigSchema.safeParse(story);
    expect(result.success).toBe(true);
  });

  it('should have valid tides-of-the-blue metadata', () => {
    const story = loadStoryFile('tides-of-the-blue.json');
    expect(story.title).toBe('Tides of the Blue');
    expect(story.theme).toBe('bold-gradient');
    expect(story.subtitle).toBe('Stories from the living ocean');
    expect(story.publishedAt).toBe('2026-01-15T00:00:00Z');
  });

  it('should have pages array in all stories', () => {
    const files = getStoryFiles();
    files.forEach((filename) => {
      const story = loadStoryFile(filename);
      expect(Array.isArray(story.pages)).toBe(true);
      expect(story.pages.length).toBeGreaterThan(0);
      story.pages.forEach((page: StoryConfig['pages'][number]) => {
        expect(page).toHaveProperty('id');
        expect(page).toHaveProperty('layout');
      });
    });
  });

  it('should have valid theme values', () => {
    const validThemes = ['dark-cinematic', 'light-editorial', 'bold-gradient'];
    const files = getStoryFiles();
    files.forEach((filename) => {
      const story = loadStoryFile(filename);
      expect(validThemes).toContain(story.theme);
    });
  });

  it('should have backgroundMusic in all stories', () => {
    const files = getStoryFiles();
    files.forEach((filename) => {
      const story = loadStoryFile(filename);
      expect(story).toHaveProperty('backgroundMusic');
      expect(typeof story.backgroundMusic).toBe('string');
      expect(story.backgroundMusic.length).toBeGreaterThan(0);
    });
  });

  it('should have publishedAt dates in all stories', () => {
    const files = getStoryFiles();
    files.forEach((filename) => {
      const story = loadStoryFile(filename);
      expect(story).toHaveProperty('publishedAt');
      // Validate ISO 8601 format
      expect(new Date(story.publishedAt).getTime()).not.toBeNaN();
    });
  });

  it('should have descriptions in all stories', () => {
    const files = getStoryFiles();
    files.forEach((filename) => {
      const story = loadStoryFile(filename);
      expect(story).toHaveProperty('description');
      expect(typeof story.description).toBe('string');
      expect(story.description.length).toBeGreaterThan(0);
    });
  });
});
