import type { Citation, StoryConfig, ThemeName } from '../../types/story';
import { THEMES, themeLabels } from '../../theme/themes';
import { createCitationTemplate, normalizeOptional } from './helpers';
import { InfoTip } from './InfoTip';

interface StoryDetailsPanelProps {
  story: StoryConfig | null;
  selectedId: string;
  onUpdateStoryField: <K extends keyof StoryConfig>(key: K, value: StoryConfig[K]) => void;
  onPickAudio: () => void;
}

export function StoryDetailsPanel({ story, selectedId, onUpdateStoryField, onPickAudio }: StoryDetailsPanelProps) {
  const updateCitation = (index: number, key: keyof Citation, value: string) => {
    if (!story) return;
    const citations = [...(story.citations ?? [])];
    const current = citations[index] ?? createCitationTemplate();
    citations[index] = { ...current, [key]: value };
    onUpdateStoryField('citations', citations.length ? citations : undefined);
  };

  const addCitation = () => {
    if (!story) return;
    const citations = [...(story.citations ?? []), createCitationTemplate()];
    onUpdateStoryField('citations', citations);
  };

  const removeCitation = (index: number) => {
    if (!story) return;
    const citations = [...(story.citations ?? [])];
    citations.splice(index, 1);
    onUpdateStoryField('citations', citations.length ? citations : undefined);
  };

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
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Theme
              <InfoTip text="Select the visual theme for this story." />
            </label>
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
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Title
              <InfoTip text="Main story title shown on the landing page and story header." />
            </label>
            <input
              value={story.title}
              onChange={(event) => onUpdateStoryField('title', event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Subtitle
              <InfoTip text="Optional supporting line displayed under the story title." />
            </label>
            <input
              value={story.subtitle ?? ''}
              onChange={(event) => onUpdateStoryField('subtitle', normalizeOptional(event.target.value))}
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Badge
              <InfoTip text="Optional badge shown on story cards (e.g., Draft, New)." />
            </label>
            <input
              value={story.badge ?? ''}
              onChange={(event) => onUpdateStoryField('badge', normalizeOptional(event.target.value))}
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Description
              <InfoTip text="Short summary used on the landing page and previews." />
            </label>
            <textarea
              value={story.description ?? ''}
              onChange={(event) => onUpdateStoryField('description', normalizeOptional(event.target.value))}
              className="min-h-[90px] w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Published At
              <InfoTip text="ISO 8601 timestamp for sorting and display." />
            </label>
            <input
              value={story.publishedAt ?? ''}
              onChange={(event) => onUpdateStoryField('publishedAt', normalizeOptional(event.target.value))}
              placeholder="2024-05-01T12:00:00Z"
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Background Music
              <InfoTip text="Optional audio track path under /content/audio." />
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                value={story.backgroundMusic ?? ''}
                onChange={(event) => onUpdateStoryField('backgroundMusic', normalizeOptional(event.target.value))}
                placeholder="/audio/story.mp3"
                className="flex-1 min-w-[220px] rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={onPickAudio}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/70"
              >
                Browse
              </button>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                Citations
                <InfoTip text="Story-level sources that apply across sections." />
              </label>
              <button
                type="button"
                onClick={addCitation}
                className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"
              >
                Add citation
              </button>
            </div>
            <div className="space-y-2">
              {(story.citations ?? []).map((citation, index) => (
                <div key={`${citation.label}-${index}`} className="grid gap-2 md:grid-cols-[1fr_1.2fr_auto]">
                  <input
                    value={citation.label}
                    onChange={(event) => updateCitation(index, 'label', event.target.value)}
                    placeholder="Label"
                    className="rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                  />
                  <input
                    value={citation.url}
                    onChange={(event) => updateCitation(index, 'url', event.target.value)}
                    placeholder="https://example.com"
                    className="rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeCitation(index)}
                    className="rounded-md border border-red-400/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {(story.citations ?? []).length === 0 && (
                <p className="text-xs text-muted">No story-level citations yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
