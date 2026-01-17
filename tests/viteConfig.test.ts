/**
 * @vitest-environment node
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

const loadConfig = async () => {
  const configModule = await import('../vite.config');
  return configModule.default as { base?: string };
};

describe('vite.config base', () => {
  afterEach(() => {
    delete process.env.GITHUB_PAGES;
    vi.resetModules();
  });

  it('defaults to root base when not building for GitHub Pages', async () => {
    delete process.env.GITHUB_PAGES;
    const config = await loadConfig();
    expect(config.base).toBe('/');
  });

  it('sets repository base when building for GitHub Pages', async () => {
    process.env.GITHUB_PAGES = 'true';
    const config = await loadConfig();
    expect(config.base).toBe('/story_app/');
  });
});
