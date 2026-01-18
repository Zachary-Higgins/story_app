import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { storyConfigSchema, type StoryConfig } from '../src/storySchema';
import { formatDate } from '../src/data/stories';

// Load story data from content directory (if it exists)
// Note: This is for development/testing only. The engine package itself
// does not include default content.

function getContentDir(): string {
  return resolve('content');
}

function loadStoryFile(filename: string) {
  const filePath = resolve(getContentDir(), 'stories', filename);
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

function getStoryFiles() {
  const dir = resolve(getContentDir(), 'stories');
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir).filter((f) => f.endsWith('.json'));
}

describe('formatDate', () => {
  it('should format story publishedAt dates correctly', () => {
    const storyFiles = getStoryFiles();
    if (storyFiles.length === 0) {
      // Skip test if no content available
      expect(true).toBe(true);
      return;
    }

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
    const storyFiles = getStoryFiles();
    if (storyFiles.length === 0) {
      expect(true).toBe(true);
      return;
    }

    const storyFile = storyFiles[0];
    const story = loadStoryFile(storyFile);
    if (story.publishedAt) {
      const formatted = formatDate(story.publishedAt);
      expect(formatted).toMatch(/\d{4}/);
    }
  });

  it('should handle development content if available', () => {
    const welcomeFile = resolve(getContentDir(), 'stories', 'welcome.json');
    if (existsSync(welcomeFile)) {
      const story = loadStoryFile('welcome.json');
      const formatted = formatDate(story.publishedAt);
      expect(formatted).toMatch(/\d{4}/);
    } else {
      expect(true).toBe(true);
    }
  });
});

describe('Story JSON files in content directory', () => {
  it('should validate all story files against schema', () => {
    const files = getStoryFiles();
    if (files.length === 0) {
      expect(true).toBe(true);
      return;
    }

    files.forEach((filename) => {
      const story = loadStoryFile(filename);
      const result = storyConfigSchema.safeParse(story);
      expect(result.success).toBe(true);
    });
  });

  it('should have pages array in all stories', () => {
    const files = getStoryFiles();
    if (files.length === 0) {
      expect(true).toBe(true);
      return;
    }

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
    if (files.length === 0) {
      expect(true).toBe(true);
      return;
    }

    files.forEach((filename) => {
      const story = loadStoryFile(filename);
      expect(validThemes).toContain(story.theme);
    });
  });

  it('should have publishedAt dates in all stories', () => {
    const files = getStoryFiles();
    if (files.length === 0) {
      expect(true).toBe(true);
      return;
    }

    files.forEach((filename) => {
      const story = loadStoryFile(filename);
      expect(story).toHaveProperty('publishedAt');
      // Validate ISO 8601 format
      expect(new Date(story.publishedAt).getTime()).not.toBeNaN();
    });
  });

  it('should have descriptions in all stories', () => {
    const files = getStoryFiles();
    if (files.length === 0) {
      expect(true).toBe(true);
      return;
    }

    files.forEach((filename) => {
      const story = loadStoryFile(filename);
      expect(story).toHaveProperty('description');
      expect(typeof story.description).toBe('string');
      expect(story.description.length).toBeGreaterThan(0);
    });
  });
});
