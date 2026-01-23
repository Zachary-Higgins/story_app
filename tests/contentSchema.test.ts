import { describe, it, expect } from 'vitest';
import { aboutConfigSchema, homeConfigSchema } from '../src/contentSchema';

describe('content schemas', () => {
  it('validates home config', () => {
    const home = {
      navTitle: 'Test',
      description: 'Desc',
      hero: {
        kicker: 'Kick',
        title: 'Title',
        body: 'Body',
        tags: ['One'],
        image: '/images/test.jpg',
        imageAlt: 'Alt',
        note: 'Note',
      },
    };
    const result = homeConfigSchema.safeParse(home);
    expect(result.success).toBe(true);
  });

  it('rejects invalid home config', () => {
    const home = {
      navTitle: 'Test',
      hero: {
        kicker: 'Kick',
        title: 'Title',
        body: 'Body',
        tags: ['One'],
        image: 'javascript:alert(1)',
        imageAlt: 'Alt',
        note: 'Note',
      },
    };
    const result = homeConfigSchema.safeParse(home);
    expect(result.success).toBe(false);
  });

  it('validates about config', () => {
    const about = {
      kicker: 'About',
      title: 'Title',
      description: 'Desc',
      sections: [
        { title: 'Section', content: 'Content', tags: ['Tag'] },
        { title: 'Section 2', items: ['Item 1'] },
      ],
      cta: 'CTA',
    };
    const result = aboutConfigSchema.safeParse(about);
    expect(result.success).toBe(true);
  });

  it('rejects about config without sections', () => {
    const about = {
      kicker: 'About',
      title: 'Title',
    };
    const result = aboutConfigSchema.safeParse(about);
    expect(result.success).toBe(false);
  });
});
