import { describe, it, expect } from 'vitest';
import { storyConfigSchema } from '../src/storySchema';

describe('storyConfigSchema', () => {
  const validStoryConfig = {
    theme: 'dark-cinematic',
    title: 'Test Story',
    subtitle: 'A test subtitle',
    backgroundMusic: '/audio/test.mp3',
    pages: [
      {
        id: 'page-1',
        layout: 'hero',
        title: 'Page Title',
        body: ['Page content line 1', 'Page content line 2'],
      },
    ],
  };

  it('should validate a correct story config', () => {
    const result = storyConfigSchema.safeParse(validStoryConfig);
    expect(result.success).toBe(true);
  });

  it('should reject invalid theme', () => {
    const invalid = { ...validStoryConfig, theme: 'invalid-theme' };
    const result = storyConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should require title field', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { title, ...invalid } = validStoryConfig;
    const result = storyConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should require pages array', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pages, ...invalid } = validStoryConfig;
    const result = storyConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should validate hero page layout', () => {
    const heroPage = {
      ...validStoryConfig,
      pages: [
        {
          id: 'hero-1',
          layout: 'hero',
          title: 'Hero Title',
          body: ['Hero body text'],
          kicker: 'Kicker text',
        },
      ],
    };
    const result = storyConfigSchema.safeParse(heroPage);
    expect(result.success).toBe(true);
  });

  it('should validate split page layout', () => {
    const splitPage = {
      ...validStoryConfig,
      pages: [
        {
          id: 'split-1',
          layout: 'split',
          title: 'Split Title',
          body: ['Split body text'],
        },
      ],
    };
    const result = storyConfigSchema.safeParse(splitPage);
    expect(result.success).toBe(true);
  });

  it('should validate timeline page layout', () => {
    const timelinePage = {
      ...validStoryConfig,
      pages: [
        {
          id: 'timeline-1',
          layout: 'timeline',
          title: 'Timeline Title',
          body: ['Timeline content'],
          timeline: [
            {
              title: 'Event 1',
              description: 'Event description',
            },
          ],
        },
      ],
    };
    const result = storyConfigSchema.safeParse(timelinePage);
    expect(result.success).toBe(true);
  });

  it('should validate immersive page layout', () => {
    const immersivePage = {
      ...validStoryConfig,
      pages: [
        {
          id: 'immersive-1',
          layout: 'immersive',
          title: 'Immersive Title',
          body: ['Immersive content'],
        },
      ],
    };
    const result = storyConfigSchema.safeParse(immersivePage);
    expect(result.success).toBe(true);
  });

  it('should accept optional fields', () => {
    const minimal = {
      theme: 'dark-cinematic',
      title: 'Minimal Story',
      pages: [
        {
          id: 'page-1',
          layout: 'hero',
          title: 'Page',
          body: ['Content'],
        },
      ],
    };
    const result = storyConfigSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it('should validate media assets in background/foreground', () => {
    const withMedia = {
      ...validStoryConfig,
      pages: [
        {
          id: 'page-1',
          layout: 'hero',
          title: 'Page',
          body: ['Content'],
          background: {
            type: 'image',
            src: '/img.jpg',
            alt: 'Alt text',
          },
        },
      ],
    };
    const result = storyConfigSchema.safeParse(withMedia);
    expect(result.success).toBe(true);
  });

  it('should reject invalid body format (requires array)', () => {
    const invalid = {
      ...validStoryConfig,
      pages: [
        {
          id: 'page-1',
          layout: 'hero',
          title: 'Page',
          body: 'This should be an array',
        },
      ],
    };
    const result = storyConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject unsafe URLs in links and media', () => {
    const unsafe = {
      ...validStoryConfig,
      backgroundMusic: 'javascript:alert(1)',
      pages: [
        {
          id: 'page-1',
          layout: 'hero',
          title: 'Page',
          body: ['Content'],
          actions: [{ label: 'Bad', href: 'javascript:alert(1)' }],
          background: {
            type: 'image',
            src: '//malicious.test/img.jpg',
          },
        },
      ],
    };
    const result = storyConfigSchema.safeParse(unsafe);
    expect(result.success).toBe(false);
  });
});
