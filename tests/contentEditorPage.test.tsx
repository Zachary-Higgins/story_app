import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ContentEditorPage } from '../src/pages/ContentEditorPage';

const homePayload = {
  navTitle: 'Story Engine',
  description: 'A quick intro.',
  hero: {
    kicker: 'Hello',
    title: 'Welcome',
    body: 'Intro copy.',
    tags: ['Narrative', 'Design'],
    image: '/images/hero.jpg',
    imageAlt: 'Hero',
    note: 'Small note.',
  },
};

describe('ContentEditorPage', () => {
  beforeEach(() => {
    vi.stubEnv('DEV', 'true');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => homePayload,
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('renders the home editor and loads content', async () => {
    render(
      <ContentEditorPage file="home.json" title="Home Editor" description="Edit the home page content JSON." />
    );

    expect(await screen.findByText('Home Editor')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('Story Engine')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/__story-editor/content?file=home.json'));
  });
});
