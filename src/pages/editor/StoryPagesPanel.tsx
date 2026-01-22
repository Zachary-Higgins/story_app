import type { ActionLink, MediaAsset, StoryConfig, StoryPage, TimelineEntry } from '../../types/story';
import {
  createActionTemplate,
  createMediaTemplate,
  createTimelineTemplate,
  moveItem,
  normalizeOptional,
} from './helpers';

interface StoryPagesPanelProps {
  story: StoryConfig;
  onAddPage: () => void;
  onMovePage: (from: number, to: number) => void;
  onDeletePage: (pageIndex: number) => void;
  onUpdatePageField: <K extends keyof StoryPage>(pageIndex: number, key: K, value: StoryPage[K]) => void;
  onUpdatePageBody: (pageIndex: number, body: string[]) => void;
  onUpdatePageActions: (pageIndex: number, actions: ActionLink[] | undefined) => void;
  onUpdatePageTimeline: (pageIndex: number, timeline: TimelineEntry[] | undefined) => void;
  onUpdatePageMedia: (pageIndex: number, key: 'background' | 'foreground', value?: MediaAsset) => void;
}

export function StoryPagesPanel({
  story,
  onAddPage,
  onMovePage,
  onDeletePage,
  onUpdatePageField,
  onUpdatePageBody,
  onUpdatePageActions,
  onUpdatePageTimeline,
  onUpdatePageMedia,
}: StoryPagesPanelProps) {
  const updateBodyEntry = (pageIndex: number, entryIndex: number, value: string) => {
    const body = [...story.pages[pageIndex].body];
    body[entryIndex] = value;
    onUpdatePageBody(pageIndex, body);
  };

  const addBodyEntry = (pageIndex: number) => {
    const body = [...story.pages[pageIndex].body, ''];
    onUpdatePageBody(pageIndex, body);
  };

  const moveBodyEntry = (pageIndex: number, from: number, to: number) => {
    const body = moveItem(story.pages[pageIndex].body, from, to);
    onUpdatePageBody(pageIndex, body);
  };

  const removeBodyEntry = (pageIndex: number, entryIndex: number) => {
    const body = [...story.pages[pageIndex].body];
    body.splice(entryIndex, 1);
    onUpdatePageBody(pageIndex, body);
  };

  const updateActionEntry = (pageIndex: number, entryIndex: number, key: keyof ActionLink, value: string) => {
    const actions = [...(story.pages[pageIndex].actions ?? [])];
    const current = actions[entryIndex] ?? createActionTemplate();
    actions[entryIndex] = { ...current, [key]: value };
    onUpdatePageActions(pageIndex, actions);
  };

  const addActionEntry = (pageIndex: number) => {
    const actions = [...(story.pages[pageIndex].actions ?? []), createActionTemplate()];
    onUpdatePageActions(pageIndex, actions);
  };

  const moveActionEntry = (pageIndex: number, from: number, to: number) => {
    const actions = moveItem(story.pages[pageIndex].actions ?? [], from, to);
    onUpdatePageActions(pageIndex, actions);
  };

  const removeActionEntry = (pageIndex: number, entryIndex: number) => {
    const actions = [...(story.pages[pageIndex].actions ?? [])];
    actions.splice(entryIndex, 1);
    onUpdatePageActions(pageIndex, actions);
  };

  const updateTimelineEntry = (pageIndex: number, entryIndex: number, key: keyof TimelineEntry, value: string) => {
    const timeline = [...(story.pages[pageIndex].timeline ?? [])];
    const current = timeline[entryIndex] ?? createTimelineTemplate();
    timeline[entryIndex] = { ...current, [key]: value };
    onUpdatePageTimeline(pageIndex, timeline);
  };

  const addTimelineEntry = (pageIndex: number) => {
    const timeline = [...(story.pages[pageIndex].timeline ?? []), createTimelineTemplate()];
    onUpdatePageTimeline(pageIndex, timeline);
  };

  const moveTimelineEntry = (pageIndex: number, from: number, to: number) => {
    const timeline = moveItem(story.pages[pageIndex].timeline ?? [], from, to);
    onUpdatePageTimeline(pageIndex, timeline);
  };

  const removeTimelineEntry = (pageIndex: number, entryIndex: number) => {
    const timeline = [...(story.pages[pageIndex].timeline ?? [])];
    timeline.splice(entryIndex, 1);
    onUpdatePageTimeline(pageIndex, timeline);
  };

  const updateMediaField = (
    pageIndex: number,
    mediaKey: 'background' | 'foreground',
    key: keyof MediaAsset,
    value: string | boolean | undefined
  ) => {
    const page = story.pages[pageIndex];
    const current = page[mediaKey] ?? createMediaTemplate();
    const next = { ...current, [key]: value } as MediaAsset;
    onUpdatePageMedia(pageIndex, mediaKey, next);
  };

  const toggleMedia = (pageIndex: number, mediaKey: 'background' | 'foreground') => {
    const page = story.pages[pageIndex];
    if (page[mediaKey]) {
      onUpdatePageMedia(pageIndex, mediaKey, undefined);
      return;
    }
    onUpdatePageMedia(pageIndex, mediaKey, createMediaTemplate());
  };

  const renderMediaEditor = (page: StoryPage, pageIndex: number, mediaKey: 'background' | 'foreground', label: string) => {
    const media = page[mediaKey];
    return (
      <div className="rounded-2xl border border-white/5 bg-surface/40 p-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</h4>
          <button
            type="button"
            onClick={() => toggleMedia(pageIndex, mediaKey)}
            className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"
          >
            {media ? 'Remove' : 'Add'}
          </button>
        </div>

        {!media && <p className="mt-3 text-xs text-muted">No {label.toLowerCase()} media.</p>}

        {media && (
          <div className="mt-3 space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Type</label>
              <select
                value={media.type}
                onChange={(event) => updateMediaField(pageIndex, mediaKey, 'type', event.target.value as MediaAsset['type'])}
                className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Source</label>
              <input
                value={media.src}
                onChange={(event) => updateMediaField(pageIndex, mediaKey, 'src', event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Alt</label>
              <input
                value={media.alt ?? ''}
                onChange={(event) => updateMediaField(pageIndex, mediaKey, 'alt', normalizeOptional(event.target.value))}
                className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
              />
            </div>
            {media.type === 'video' && (
              <div className="flex flex-wrap gap-4 text-xs text-muted">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={media.autoPlay ?? false}
                    onChange={(event) =>
                      updateMediaField(pageIndex, mediaKey, 'autoPlay', event.target.checked ? true : undefined)
                    }
                  />
                  Autoplay
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={media.loop ?? false}
                    onChange={(event) =>
                      updateMediaField(pageIndex, mediaKey, 'loop', event.target.checked ? true : undefined)
                    }
                  />
                  Loop
                </label>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-elevated/70 p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Story Pages</h2>
        <button
          type="button"
          onClick={onAddPage}
          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-accent"
        >
          Add Page
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {story.pages.map((page, index) => (
          <div
            key={page.id}
            id={`editor-page-${index}`}
            className="rounded-2xl border border-white/5 bg-surface/40 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Page {index + 1}</p>
                <p className="text-xs text-muted">{page.layout} layout</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onMovePage(index, index - 1)}
                  disabled={index === 0}
                  className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70 disabled:opacity-40"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => onMovePage(index, index + 1)}
                  disabled={index === story.pages.length - 1}
                  className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70 disabled:opacity-40"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePage(index)}
                  className="rounded-md border border-red-400/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-200"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Id</label>
                <input
                  value={page.id}
                  onChange={(event) => onUpdatePageField(index, 'id', event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Layout</label>
                <select
                  value={page.layout}
                  onChange={(event) => onUpdatePageField(index, 'layout', event.target.value as StoryPage['layout'])}
                  className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                >
                  <option value="hero">Hero</option>
                  <option value="split">Split</option>
                  <option value="timeline">Timeline</option>
                  <option value="immersive">Immersive</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Title</label>
                <input
                  value={page.title}
                  onChange={(event) => onUpdatePageField(index, 'title', event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Kicker</label>
                <input
                  value={page.kicker ?? ''}
                  onChange={(event) => onUpdatePageField(index, 'kicker', normalizeOptional(event.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Transition</label>
                <select
                  value={page.transition ?? 'fade'}
                  onChange={(event) => onUpdatePageField(index, 'transition', event.target.value as StoryPage['transition'])}
                  className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                >
                  <option value="fade">Fade</option>
                  <option value="slide-up">Slide up</option>
                  <option value="slide-left">Slide left</option>
                  <option value="zoom">Zoom</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Emphasis</label>
                <input
                  value={page.emphasis ?? ''}
                  onChange={(event) => onUpdatePageField(index, 'emphasis', normalizeOptional(event.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Body</h4>
                  <button
                    type="button"
                    onClick={() => addBodyEntry(index)}
                    className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"
                  >
                    Add paragraph
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {page.body.map((line, bodyIndex) => (
                    <div key={`${page.id}-body-${bodyIndex}`} className="rounded-xl border border-white/5 p-3">
                      <textarea
                        value={line}
                        onChange={(event) => updateBodyEntry(index, bodyIndex, event.target.value)}
                        className="min-h-[80px] w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => moveBodyEntry(index, bodyIndex, bodyIndex - 1)}
                          disabled={bodyIndex === 0}
                          className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70 disabled:opacity-40"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBodyEntry(index, bodyIndex, bodyIndex + 1)}
                          disabled={bodyIndex === page.body.length - 1}
                          className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70 disabled:opacity-40"
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBodyEntry(index, bodyIndex)}
                          className="rounded-md border border-red-400/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {page.body.length === 0 && <p className="text-xs text-muted">No body paragraphs yet.</p>}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Actions</h4>
                  <button
                    type="button"
                    onClick={() => addActionEntry(index)}
                    className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"
                  >
                    Add action
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {(page.actions ?? []).map((action, actionIndex) => (
                    <div key={`${page.id}-action-${actionIndex}`} className="rounded-xl border border-white/5 p-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          value={action.label}
                          onChange={(event) => updateActionEntry(index, actionIndex, 'label', event.target.value)}
                          placeholder="Label"
                          className="rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                        />
                        <input
                          value={action.href}
                          onChange={(event) => updateActionEntry(index, actionIndex, 'href', event.target.value)}
                          placeholder="/destination"
                          className="rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => moveActionEntry(index, actionIndex, actionIndex - 1)}
                          disabled={actionIndex === 0}
                          className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70 disabled:opacity-40"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          onClick={() => moveActionEntry(index, actionIndex, actionIndex + 1)}
                          disabled={actionIndex === (page.actions ?? []).length - 1}
                          className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70 disabled:opacity-40"
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          onClick={() => removeActionEntry(index, actionIndex)}
                          className="rounded-md border border-red-400/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {(page.actions ?? []).length === 0 && <p className="text-xs text-muted">No actions yet.</p>}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Timeline</h4>
                  <button
                    type="button"
                    onClick={() => addTimelineEntry(index)}
                    className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"
                  >
                    Add entry
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {(page.timeline ?? []).map((entry, entryIndex) => (
                    <div key={`${page.id}-timeline-${entryIndex}`} className="rounded-xl border border-white/5 p-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          value={entry.title}
                          onChange={(event) => updateTimelineEntry(index, entryIndex, 'title', event.target.value)}
                          placeholder="Title"
                          className="rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                        />
                        <input
                          value={entry.subtitle ?? ''}
                          onChange={(event) =>
                            updateTimelineEntry(index, entryIndex, 'subtitle', normalizeOptional(event.target.value) ?? '')
                          }
                          placeholder="Subtitle"
                          className="rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <textarea
                        value={entry.description}
                        onChange={(event) => updateTimelineEntry(index, entryIndex, 'description', event.target.value)}
                        placeholder="Description"
                        className="mt-3 min-h-[70px] w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                      />
                      <input
                        value={entry.marker ?? ''}
                        onChange={(event) =>
                          updateTimelineEntry(index, entryIndex, 'marker', normalizeOptional(event.target.value) ?? '')
                        }
                        placeholder="Marker"
                        className="mt-3 w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => moveTimelineEntry(index, entryIndex, entryIndex - 1)}
                          disabled={entryIndex === 0}
                          className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70 disabled:opacity-40"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          onClick={() => moveTimelineEntry(index, entryIndex, entryIndex + 1)}
                          disabled={entryIndex === (page.timeline ?? []).length - 1}
                          className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70 disabled:opacity-40"
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTimelineEntry(index, entryIndex)}
                          className="rounded-md border border-red-400/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {(page.timeline ?? []).length === 0 && <p className="text-xs text-muted">No timeline entries yet.</p>}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {renderMediaEditor(page, index, 'background', 'Background')}
              {renderMediaEditor(page, index, 'foreground', 'Foreground')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
