import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { StoryConfig, StoryPage, ThemeName } from '../types/story';
import { storyConfigSchema } from '../storySchema';
import { applyTheme } from '../theme/themes';
import { stories, findStory, StoryMeta } from '../data/stories';
import { ThemeToggle } from '../components/ThemeToggle';
import { AudioController } from '../components/AudioController';
import { ScrollProgress } from '../components/ScrollProgress';
import { HeroSection } from '../components/sections/HeroSection';
import { SplitSection } from '../components/sections/SplitSection';
import { TimelineSection } from '../components/sections/TimelineSection';
import { ImmersiveSection } from '../components/sections/ImmersiveSection';

function renderSection(page: StoryPage, index: number) {
  switch (page.layout) {
    case 'hero':
      return <HeroSection key={page.id} page={page} index={index} />;
    case 'split':
      return <SplitSection key={page.id} page={page} index={index} flip={index % 2 === 1} />;
    case 'timeline':
      return <TimelineSection key={page.id} page={page} index={index} />;
    case 'immersive':
      return <ImmersiveSection key={page.id} page={page} index={index} />;
    default:
      return null;
  }
}

export function StoryView() {
  const { id } = useParams();
  const meta: StoryMeta | undefined = findStory(id ?? undefined);
  const navigate = useNavigate();

  const [story, setStory] = useState<StoryConfig | null>(null);
  const [theme, setTheme] = useState<ThemeName>(meta?.theme ?? 'dark-cinematic');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!meta) return;
    setTheme(meta.theme);
  }, [meta]);

  useEffect(() => {
    if (!meta) return;
    const loadStory = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(meta.configPath);
        if (!res.ok) throw new Error('Unable to load story file');
        const raw = await res.json();
        const parsed = storyConfigSchema.parse(raw);
        setStory(parsed);
        setTheme(parsed.theme);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError('Story config failed validation.');
        } else {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    };
    loadStory();
  }, [meta]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const pageContent = useMemo(() => story?.pages ?? [], [story]);

  if (!meta) {
    return (
      <div className="space-y-6 rounded-3xl bg-elevated/70 p-10 text-muted">
        <h1 className="font-display text-3xl text-white">Story not found</h1>
        <p>The story you tried to load does not exist. Pick another one from the menu.</p>
        <Link to="/" className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-surface shadow-soft">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <ScrollProgress />
      <div className="pointer-events-none fixed inset-0 bg-overlay opacity-70" aria-hidden />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-2 pb-16 pt-4 md:px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-elevated/70 p-5 backdrop-blur">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Interactive Story</p>
            <h1 className="font-display text-2xl text-white md:text-3xl">{story?.title ?? meta.title}</h1>
            <p className="text-sm text-muted">{story?.subtitle ?? meta.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ThemeToggle value={theme} onChange={setTheme} />
            <AudioController src={story?.backgroundMusic} />
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-accent/40 bg-elevated/70 p-4 text-sm text-accent">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-3 rounded-3xl bg-elevated/70 p-6 text-muted">
            <div className="h-4 w-24 rounded bg-surface/80" />
            <div className="h-6 w-48 rounded bg-surface/80" />
            <div className="h-4 w-full rounded bg-surface/80" />
            <div className="h-4 w-5/6 rounded bg-surface/80" />
            <div className="h-4 w-4/6 rounded bg-surface/80" />
          </div>
        )}

        {!loading && pageContent.map((page, idx) => renderSection(page, idx))}

        <div className="flex flex-wrap gap-3 rounded-3xl bg-elevated/60 px-6 py-4 text-sm text-muted">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-4 py-2 font-semibold text-accent hover:border-accent"
          >
            ← Back to all stories
          </Link>
          <button
            onClick={() => navigate(0)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-semibold text-white/80 hover:border-accent"
          >
            Refresh story
          </button>
        </div>

        <div className="rounded-2xl bg-elevated/60 p-5 text-sm text-muted">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              More journeys
            </span>
            <div className="flex flex-wrap gap-2">
              {stories
                .filter((s) => s.id !== meta.id)
                .map((s) => (
                  <Link
                    key={s.id}
                    to={`/story/${s.id}`}
                    className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-white hover:text-accent"
                  >
                    {s.title}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
