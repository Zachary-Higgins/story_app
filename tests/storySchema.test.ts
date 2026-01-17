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
        kicker: 'Test',
        title: 'Page Title',
        body: 'Page content',
        image: '/images/test.jpg',
      },
    ],
    timeline: [
      {
        date: '2026-01-01',
        event: 'Test Event',
      },
    ],
    emphasis: 'Key message',
    media: {
      'test-img': {
        type: 'image',
        src: '/images/test.jpg',
        alt: 'Test image',
      },
    },
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
    const { title, ...invalid } = validStoryConfig;
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
          kicker: 'Kicker',
          title: 'Hero Title',
          body: 'Hero body',
          image: '/images/hero.jpg',
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
          body: 'Split body',
          image: '/images/split.jpg',
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
          events: [
            {
              date: '2026-01-01',
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
          body: 'Immersive content',
          backgroundImage: '/images/bg.jpg',
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
      subtitle: 'Subtitle',
      pages: [
        {
          id: 'page-1',
          layout: 'hero',
          title: 'Page',
          body: 'Content',
        },
      ],
    };
    const result = storyConfigSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it('should validate media asset types', () => {
    const withMedia = {
      ...validStoryConfig,
      media: {
        img1: { type: 'image', src: '/img.jpg', alt: 'Alt' },
        vid1: { type: 'video', src: '/vid.mp4' },
        aud1: { type: 'audio', src: '/aud.mp3' },
      },
    };
    const result = storyConfigSchema.safeParse(withMedia);
    expect(result.success).toBe(true);
  });
});
