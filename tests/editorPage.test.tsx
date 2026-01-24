import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EditorPage } from '../src/pages/EditorPage';

const storyPayload = {
  theme: 'dark-cinematic',
  title: 'Sample Story',
  pages: [
    {
      id: 'section-1',
      title: 'Section 1',
      body: ['Hello world'],
      layout: 'hero',
    },
  ],
};

const indexPayload = {
  stories: [{ id: 'sample', configPath: '/stories/sample.json' }],
};

describe('EditorPage', () => {
  beforeEach(() => {
    vi.stubEnv('DEV', 'true');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('/__story-editor/index')) {
          return { ok: true, json: async () => indexPayload };
        }
        if (url.includes('/__story-editor/story')) {
          return { ok: true, json: async () => storyPayload };
        }
        return { ok: false, json: async () => ({ error: 'Not found' }) };
      })
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('loads the first story and shows the editor panels', async () => {
    render(<EditorPage />);
    expect(await screen.findByText('Dev Mode Workspace')).toBeInTheDocument();
    expect(await screen.findByText('Story Pages')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/__story-editor/index'));
  });
});
