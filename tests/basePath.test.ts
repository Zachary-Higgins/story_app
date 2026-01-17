import { afterEach, describe, expect, it, vi } from 'vitest';
import { withBasePath } from '../src/utils/basePath';

describe('withBasePath', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('prefixes root-relative paths with the configured base', () => {
    vi.stubEnv('BASE_URL', '/story_app/');
    expect(withBasePath('/stories/example.json')).toBe('/story_app/stories/example.json');
  });

  it('avoids double-prefixing when path already includes base', () => {
    vi.stubEnv('BASE_URL', '/story_app/');
    expect(withBasePath('/story_app/stories/example.json')).toBe('/story_app/stories/example.json');
  });

  it('leaves absolute URLs unchanged', () => {
    expect(withBasePath('https://example.com/file.jpg')).toBe('https://example.com/file.jpg');
  });

  it('returns empty string for falsy input', () => {
    expect(withBasePath('')).toBe('');
  });
});
