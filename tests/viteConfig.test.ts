/**
 * @vitest-environment node
 */

import type { UserConfig } from 'vite';
import { afterEach, describe, expect, it, vi } from 'vitest';

const loadConfig = async () => {
  const configModule = await import('../vite.config');
  const configFactory = configModule.default as unknown as (env: { command: string; mode: string }) => UserConfig;
  return configFactory({ command: 'serve', mode: 'development' });
};

describe('vite.config base', () => {
  afterEach(() => {
    delete process.env.GITHUB_PAGES;
    delete process.env.GITHUB_REPOSITORY;
    vi.resetModules();
  });

  it('defaults to root base when not building for GitHub Pages', async () => {
    delete process.env.GITHUB_PAGES;
    const config = await loadConfig();
    expect(config.base).toBe('/');
  });

  it('sets repository base when building for GitHub Pages', async () => {
    process.env.GITHUB_PAGES = 'true';
    process.env.GITHUB_REPOSITORY = 'owner/custom-repo';
    const config = await loadConfig();
    expect(config.base).toBe('/custom-repo/');
  });
});
