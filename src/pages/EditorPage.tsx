import { useEffect, useMemo, useState } from 'react';
import type { ActionLink, MediaAsset, StoryConfig, StoryPage, TimelineEntry } from '../types/story';
import { storyConfigSchema } from '../storySchema';
import { applyTheme } from '../theme/themes';
import { withBasePath } from '../utils/basePath';
import { EditorTabs, type EditorTab } from './editor/EditorTabs';
import { StoryDetailsPanel } from './editor/StoryDetailsPanel';
import { StoryPagesPanel } from './editor/StoryPagesPanel';
import { JsonEditorPanel } from './editor/JsonEditorPanel';
import { PreviewPanel } from './editor/PreviewPanel';
import { EditorToc } from './editor/EditorToc';
import { MediaLibraryModal, type MediaLibraryType } from './editor/MediaLibraryModal';
import { STORY_ID_PATTERN, createPageTemplate, createStoryTemplate, moveItem } from './editor/helpers';

interface StoryIndexEntry {
  id: string;
  configPath: string;
}

type NoticeTone = 'info' | 'success' | 'error';

export function EditorPage() {
  const isDev = import.meta.env.DEV;
  const [stories, setStories] = useState<StoryIndexEntry[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [story, setStory] = useState<StoryConfig | null>(null);
  const [rawJson, setRawJson] = useState('');
  const [rawDirty, setRawDirty] = useState(false);
  const [notice, setNotice] = useState<{ tone: NoticeTone; message: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [newStoryId, setNewStoryId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>('editor');
  const [mediaPicker, setMediaPicker] = useState<{
    open: boolean;
    types: MediaLibraryType[];
    activeType: MediaLibraryType;
    onSelect: (path: string, type: MediaLibraryType) => void;
  } | null>(null);

  const previewPages = useMemo(() => story?.pages ?? [], [story]);

  useEffect(() => {
    if (!isDev) return;
    void loadIndex();
  }, [isDev]);

  useEffect(() => {
    if (story?.theme) {
      applyTheme(story.theme);
    }
  }, [story?.theme]);

  const applyStoryUpdate = (next: StoryConfig) => {
    setStory(next);
    setRawJson(JSON.stringify(next, null, 2));
    setRawDirty(false);
    setValidationErrors([]);
  };

  const loadIndex = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(withBasePath('/__story-editor/index'));
      if (!res.ok) {
        throw new Error('Failed to load story index.');
      }
      const payload = (await res.json()) as { stories: StoryIndexEntry[] };
      setStories(payload.stories ?? []);
      if (payload.stories?.length) {
        const nextId = selectedId || payload.stories[0].id;
        setSelectedId(nextId);
        await loadStory(nextId);
      } else {
        setStory(null);
        setSelectedId('');
      }
    } catch (err) {
      setNotice({ tone: 'error', message: (err as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStory = async (id: string) => {
    if (!id) return;
    setIsLoading(true);
    setNotice(null);
    try {
      const res = await fetch(withBasePath(`/__story-editor/story?id=${encodeURIComponent(id)}`));
      if (!res.ok) {
        throw new Error('Failed to load story.');
      }
      const payload = await res.json();
      const parsed = storyConfigSchema.safeParse(payload);
      if (!parsed.success) {
        setValidationErrors(parsed.error.errors.map((entry) => entry.message));
        throw new Error('Story config failed validation.');
      }
      applyStoryUpdate(parsed.data);
    } catch (err) {
      setNotice({ tone: 'error', message: (err as Error).message });
    } finally {
      setIsLoading(false);
    }
  };


  const saveStoryToId = async (id: string, payload: StoryConfig) => {
    setIsSaving(true);
    setNotice(null);
    try {
      const res = await fetch(withBasePath(`/__story-editor/story?id=${encodeURIComponent(id)}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload, null, 2),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to save story.');
      }
      setNotice({ tone: 'success', message: 'Story saved.' });
      return true;
    } catch (err) {
      setNotice({ tone: 'error', message: (err as Error).message });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleStorySelect = async (id: string) => {
    setSelectedId(id);
    await loadStory(id);
  };

  const handleCreateStory = async () => {
    const trimmed = newStoryId.trim();
    if (!trimmed) {
      setNotice({ tone: 'error', message: 'Enter a story id.' });
      return;
    }
    if (!STORY_ID_PATTERN.test(trimmed)) {
      setNotice({ tone: 'error', message: 'Story id must be alphanumeric, dash, or underscore.' });
      return;
    }
    const template = createStoryTemplate(trimmed);
    const saved = await saveStoryToId(trimmed, template);
    if (saved) {
      setNewStoryId('');
      await loadIndex();
      await handleStorySelect(trimmed);
    }
  };

  const handleDeleteStory = async () => {
    if (!selectedId) return;
    const confirmed = window.confirm(`Delete story "${selectedId}"? This cannot be undone.`);
    if (!confirmed) return;
    setIsSaving(true);
    setNotice(null);
    try {
      const res = await fetch(withBasePath(`/__story-editor/story?id=${encodeURIComponent(selectedId)}`), {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to delete story.');
      }
      setNotice({ tone: 'success', message: 'Story deleted.' });
      await loadIndex();
    } catch (err) {
      setNotice({ tone: 'error', message: (err as Error).message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveStory = async () => {
    if (!story || !selectedId) return;
    if (rawDirty) {
      setNotice({ tone: 'info', message: 'Apply the JSON edits before saving.' });
      return;
    }
    await saveStoryToId(selectedId, story);
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(rawJson);
      const validated = storyConfigSchema.safeParse(parsed);
      if (!validated.success) {
        setValidationErrors(validated.error.errors.map((entry) => entry.message));
        setNotice({ tone: 'error', message: 'Story config failed validation.' });
        return;
      }
      applyStoryUpdate(validated.data);
      setNotice({ tone: 'success', message: 'JSON applied.' });
    } catch {
      setNotice({ tone: 'error', message: 'Invalid JSON.' });
    }
  };

  const handleSyncJson = () => {
    if (!story) return;
    applyStoryUpdate(story);
    setNotice({ tone: 'success', message: 'JSON synced from form.' });
  };

  const handleJsonChange = (next: string) => {
    setRawJson(next);
    setRawDirty(true);
  };


  const updateStoryField = <K extends keyof StoryConfig>(key: K, value: StoryConfig[K]) => {
    if (!story) return;
    applyStoryUpdate({ ...story, [key]: value });
  };

  const updatePage = (pageIndex: number, nextPage: StoryPage) => {
    if (!story) return;
    const nextPages = story.pages.map((page, idx) => (idx === pageIndex ? nextPage : page));
    applyStoryUpdate({ ...story, pages: nextPages });
  };

  const updatePageField = <K extends keyof StoryPage>(pageIndex: number, key: K, value: StoryPage[K]) => {
    if (!story) return;
    const page = story.pages[pageIndex];
    updatePage(pageIndex, { ...page, [key]: value });
  };

  const setPageBody = (pageIndex: number, body: string[]) => {
    updatePageField(pageIndex, 'body', body);
  };

  const setPageActions = (pageIndex: number, actions: ActionLink[] | undefined) => {
    updatePageField(pageIndex, 'actions', actions && actions.length ? actions : undefined);
  };

  const setPageTimeline = (pageIndex: number, timeline: TimelineEntry[] | undefined) => {
    updatePageField(pageIndex, 'timeline', timeline && timeline.length ? timeline : undefined);
  };

  const setPageMedia = (pageIndex: number, key: 'background' | 'foreground', value?: MediaAsset) => {
    updatePageField(pageIndex, key, value);
  };

  const addPage = () => {
    if (!story) return;
    const nextIndex = story.pages.length + 1;
    const nextPage = createPageTemplate(nextIndex);
    applyStoryUpdate({ ...story, pages: [...story.pages, nextPage] });
  };

  const movePage = (from: number, to: number) => {
    if (!story) return;
    applyStoryUpdate({ ...story, pages: moveItem(story.pages, from, to) });
  };

  const deletePage = (pageIndex: number) => {
    if (!story) return;
    const confirmed = window.confirm(`Delete page ${pageIndex + 1}?`);
    if (!confirmed) return;
    const nextPages = story.pages.filter((_, idx) => idx !== pageIndex);
    applyStoryUpdate({ ...story, pages: nextPages });
  };

  const openMediaPicker = (types: MediaLibraryType[], activeType: MediaLibraryType, onSelect: (path: string, type: MediaLibraryType) => void) => {
    setMediaPicker({ open: true, types, activeType, onSelect });
  };

  const closeMediaPicker = () => {
    setMediaPicker((prev) => (prev ? { ...prev, open: false } : prev));
  };

  if (!isDev) {
    return (
      <div className="rounded-3xl bg-elevated/70 p-6 text-muted">
        The editor is only available in dev mode.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/5 bg-elevated/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Story Editor</p>
            <h1 className="font-display text-2xl text-white">Dev Mode Workspace</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => loadIndex()}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-accent"
              disabled={isLoading}
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleSaveStory}
              className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-surface shadow-soft hover:bg-accentStrong disabled:opacity-50"
              disabled={!story || isSaving || rawDirty}
            >
              Save Story
            </button>
            <button
              type="button"
              onClick={handleDeleteStory}
              className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-200 hover:border-red-400/70"
              disabled={!selectedId || isSaving}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Story</label>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedId}
                onChange={(event) => handleStorySelect(event.target.value)}
                className="flex-1 min-w-[220px] rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
              >
                <option value="">Select a story</option>
                {stories.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.id}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => loadStory(selectedId)}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-accent"
                disabled={!selectedId || isLoading}
              >
                Load
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">New Story</label>
            <div className="flex flex-wrap gap-2">
              <input
                value={newStoryId}
                onChange={(event) => setNewStoryId(event.target.value)}
                placeholder="new-story-id"
                className="flex-1 min-w-[180px] rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCreateStory}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-accent"
              >
                Create
              </button>
            </div>
          </div>
        </div>

        {notice && (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
              notice.tone === 'success'
                ? 'border-emerald-400/40 text-emerald-200'
                : notice.tone === 'error'
                ? 'border-red-400/40 text-red-200'
                : 'border-white/10 text-muted'
            }`}
          >
            {notice.message}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <EditorTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'editor' && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div className="space-y-6">
              <div id="editor-story-details">
                <StoryDetailsPanel
                  story={story}
                  selectedId={selectedId}
                  onUpdateStoryField={updateStoryField}
                  onPickAudio={() =>
                    openMediaPicker(['audio'], 'audio', (path) => updateStoryField('backgroundMusic', path))
                  }
                />
              </div>
              {story && (
                <div id="editor-story-pages">
                  <StoryPagesPanel
                    story={story}
                    onAddPage={addPage}
                    onMovePage={movePage}
                    onDeletePage={deletePage}
                    onUpdatePageField={updatePageField}
                    onUpdatePageBody={setPageBody}
                    onUpdatePageActions={setPageActions}
                    onUpdatePageTimeline={setPageTimeline}
                    onUpdatePageMedia={setPageMedia}
                    onOpenMediaPicker={(pageIndex, key, type) =>
                      openMediaPicker(['image', 'video'], type, (path, selectedType) => {
                        if (!story) return;
                        const page = story.pages[pageIndex];
                        const current = page[key] ?? { type: selectedType, src: path, alt: '' };
                        const next = { ...current, type: selectedType, src: path };
                        setPageMedia(pageIndex, key, next);
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="lg:sticky lg:top-24">
              <EditorToc pages={story?.pages ?? []} hasStory={Boolean(story)} />
            </div>
          </div>
        )}

        {activeTab === 'json' && story && (
          <JsonEditorPanel
            rawJson={rawJson}
            rawDirty={rawDirty}
            onJsonChange={handleJsonChange}
            onApplyJson={handleApplyJson}
            onSyncJson={handleSyncJson}
            validationErrors={validationErrors}
          />
        )}

        {activeTab === 'json' && !story && (
          <div className="rounded-3xl border border-white/5 bg-elevated/70 p-6 text-sm text-muted">
            Load a story to edit its JSON.
          </div>
        )}

        {activeTab === 'preview' && <PreviewPanel story={story} pages={previewPages} />}
      </div>

      {mediaPicker && (
        <MediaLibraryModal
          open={mediaPicker.open}
          types={mediaPicker.types}
          initialType={mediaPicker.activeType}
          onSelect={(path, type) => {
            mediaPicker.onSelect(path, type);
            closeMediaPicker();
          }}
          onClose={closeMediaPicker}
        />
      )}
    </div>
  );
}
