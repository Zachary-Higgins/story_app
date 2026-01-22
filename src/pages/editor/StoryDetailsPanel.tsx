import type { StoryConfig, ThemeName } from '../../types/story';
import { THEMES, themeLabels } from '../../theme/themes';
import { normalizeOptional } from './helpers';

interface StoryDetailsPanelProps {
  story: StoryConfig | null;
  selectedId: string;
  onUpdateStoryField: <K extends keyof StoryConfig>(key: K, value: StoryConfig[K]) => void;
}

export function StoryDetailsPanel({ story, selectedId, onUpdateStoryField }: StoryDetailsPanelProps) {
  return (
    <div className="rounded-3xl border border-white/5 bg-elevated/70 p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Story Details</h2>
        <span className="text-xs text-muted">{selectedId || 'No story loaded'}</span>
      </div>

      {!story && <p className="mt-4 text-sm text-muted">Select a story to begin editing.</p>}

      {story && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Theme</label>
            <select
              value={story.theme}
              onChange={(event) => onUpdateStoryField('theme', event.target.value as ThemeName)}
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
            >
              {THEMES.map((theme) => (
                <option key={theme} value={theme}>
                  {themeLabels[theme]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Title</label>
            <input
              value={story.title}
              onChange={(event) => onUpdateStoryField('title', event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Subtitle</label>
            <input
              value={story.subtitle ?? ''}
              onChange={(event) => onUpdateStoryField('subtitle', normalizeOptional(event.target.value))}
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Badge</label>
            <input
              value={story.badge ?? ''}
              onChange={(event) => onUpdateStoryField('badge', normalizeOptional(event.target.value))}
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Description</label>
            <textarea
              value={story.description ?? ''}
              onChange={(event) => onUpdateStoryField('description', normalizeOptional(event.target.value))}
              className="min-h-[90px] w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Published At</label>
            <input
              value={story.publishedAt ?? ''}
              onChange={(event) => onUpdateStoryField('publishedAt', normalizeOptional(event.target.value))}
              placeholder="2024-05-01T12:00:00Z"
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Background Music</label>
            <input
              value={story.backgroundMusic ?? ''}
              onChange={(event) => onUpdateStoryField('backgroundMusic', normalizeOptional(event.target.value))}
              placeholder="/audio/story.mp3"
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
