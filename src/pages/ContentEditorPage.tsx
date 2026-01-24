import { useCallback, useEffect, useMemo, useState } from 'react';
import { withBasePath } from '../utils/basePath';
import { aboutConfigSchema, homeConfigSchema } from '../contentSchema';

interface ContentEditorPageProps {
  file: 'home.json' | 'about.json';
  title: string;
  description: string;
}

type NoticeTone = 'info' | 'success' | 'error';

type EditorTab = 'gui' | 'json';

interface HomeContent {
  navTitle: string;
  description?: string;
  hero: {
    kicker: string;
    title: string;
    body: string;
    tags: string[];
    image: string;
    imageAlt: string;
    note: string;
  };
}

interface AboutSection {
  title: string;
  content?: string;
  items?: string[];
  tags?: string[];
}

interface AboutContent {
  kicker: string;
  title: string;
  description?: string;
  sections: AboutSection[];
  cta?: string;
}

export function ContentEditorPage({ file, title, description }: ContentEditorPageProps) {
  const isDev = import.meta.env.DEV;
  const [rawJson, setRawJson] = useState('');
  const [lastSavedJson, setLastSavedJson] = useState('');
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState<{ tone: NoticeTone; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>('gui');
  const [contentData, setContentData] = useState<HomeContent | AboutContent | null>(null);

  const isHome = file === 'home.json';

  const loadContent = useCallback(async () => {
    setNotice(null);
    try {
      const res = await fetch(withBasePath(`/__story-editor/content?file=${file}`));
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to load content file.');
      }
      const payload = await res.json();
      const validated = isHome ? homeConfigSchema.safeParse(payload) : aboutConfigSchema.safeParse(payload);
      if (!validated.success) {
        throw new Error('Content file failed validation.');
      }
      const formatted = JSON.stringify(payload, null, 2);
      setRawJson(formatted);
      setLastSavedJson(formatted);
      setDirty(false);
      setContentData(payload as HomeContent | AboutContent);
    } catch (err) {
      setNotice({ tone: 'error', message: (err as Error).message });
      setContentData(null);
    }
  }, [file, isHome]);

  useEffect(() => {
    if (!isDev) return;
    setContentData(null);
    void loadContent();
  }, [isDev, file, loadContent]);

  const saveContent = async () => {
    setIsSaving(true);
    setNotice(null);
    try {
      const parsed = JSON.parse(rawJson);
      const res = await fetch(withBasePath(`/__story-editor/content?file=${file}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed, null, 2),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to save content file.');
      }
      const formatted = JSON.stringify(parsed, null, 2);
      setRawJson(formatted);
      setLastSavedJson(formatted);
      setDirty(false);
      setNotice({ tone: 'success', message: `${file} saved.` });
    } catch (err) {
      setNotice({ tone: 'error', message: (err as Error).message });
    } finally {
      setIsSaving(false);
    }
  };

  const applyJsonToGui = () => {
    try {
      const parsed = JSON.parse(rawJson);
      const validated = isHome ? homeConfigSchema.safeParse(parsed) : aboutConfigSchema.safeParse(parsed);
      if (!validated.success) {
        setNotice({ tone: 'error', message: 'JSON failed validation.' });
        return;
      }
      setContentData(parsed as HomeContent | AboutContent);
      setNotice({ tone: 'success', message: 'JSON applied to editor.' });
    } catch {
      setNotice({ tone: 'error', message: 'Invalid JSON.' });
    }
  };

  const updateFromGui = (next: HomeContent | AboutContent) => {
    const formatted = JSON.stringify(next, null, 2);
    setContentData(next);
    setRawJson(formatted);
    setDirty(formatted !== lastSavedJson);
  };

  const handleJsonChange = (next: string) => {
    setRawJson(next);
    setDirty(next !== lastSavedJson);
  };

  if (!isDev) {
    return (
      <div className="rounded-3xl bg-elevated/70 p-6 text-muted">
        The editor is only available in dev mode.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/5 bg-elevated/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Site Content</p>
            <h1 className="text-2xl font-semibold text-white">{title}</h1>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadContent}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/70"
              disabled={isSaving}
            >
              Reload
            </button>
            <button
              type="button"
              onClick={saveContent}
              className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold uppercase tracking-wide text-surface"
              disabled={isSaving || !dirty}
            >
              Save
            </button>
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

        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/5 bg-elevated/70 p-2">
          <button
            type="button"
            onClick={() => setActiveTab('gui')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              activeTab === 'gui' ? 'bg-accent text-surface shadow-soft' : 'text-white/70 hover:text-white'
            }`}
          >
            GUI Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              activeTab === 'json' ? 'bg-accent text-surface shadow-soft' : 'text-white/70 hover:text-white'
            }`}
          >
            JSON
          </button>
        </div>

        {activeTab === 'gui' && (
          <div className="mt-6">
            {contentData && isHome && (
              <HomeEditor data={normalizeHomeContent(contentData as HomeContent)} onChange={updateFromGui} />
            )}
            {contentData && !isHome && (
              <AboutEditor data={normalizeAboutContent(contentData as AboutContent)} onChange={updateFromGui} />
            )}
            {!contentData && <p className="text-sm text-muted">Unable to load content.</p>}
          </div>
        )}

        {activeTab === 'json' && (
          <div className="mt-6 space-y-3">
            <textarea
              value={rawJson}
              onChange={(event) => handleJsonChange(event.target.value)}
              className="min-h-[420px] w-full rounded-2xl border border-white/10 bg-surface/60 px-4 py-3 font-mono text-xs text-white"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={applyJsonToGui}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/70"
              >
                Apply JSON to GUI
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface HomeEditorProps {
  data: HomeContent;
  onChange: (next: HomeContent) => void;
}

function HomeEditor({ data, onChange }: HomeEditorProps) {
  const tagValue = useMemo(() => data.hero.tags.join(', '), [data.hero.tags]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Nav title</label>
          <input
            value={data.navTitle}
            onChange={(event) => onChange({ ...data, navTitle: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Description</label>
          <input
            value={data.description ?? ''}
            onChange={(event) => onChange({ ...data, description: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-surface/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Hero</p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Kicker</label>
            <input
              value={data.hero.kicker}
              onChange={(event) => onChange({ ...data, hero: { ...data.hero, kicker: event.target.value } })}
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Title</label>
            <input
              value={data.hero.title}
              onChange={(event) => onChange({ ...data, hero: { ...data.hero, title: event.target.value } })}
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Body</label>
            <textarea
              value={data.hero.body}
              onChange={(event) => onChange({ ...data, hero: { ...data.hero, body: event.target.value } })}
              className="min-h-[120px] w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Tags</label>
            <input
              value={tagValue}
              onChange={(event) =>
                onChange({
                  ...data,
                  hero: { ...data.hero, tags: splitComma(event.target.value) },
                })
              }
              placeholder="Tag one, tag two"
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Image</label>
            <input
              value={data.hero.image}
              onChange={(event) => onChange({ ...data, hero: { ...data.hero, image: event.target.value } })}
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Image alt</label>
            <input
              value={data.hero.imageAlt}
              onChange={(event) => onChange({ ...data, hero: { ...data.hero, imageAlt: event.target.value } })}
              className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Note</label>
            <textarea
              value={data.hero.note}
              onChange={(event) => onChange({ ...data, hero: { ...data.hero, note: event.target.value } })}
              className="min-h-[90px] w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface AboutEditorProps {
  data: AboutContent;
  onChange: (next: AboutContent) => void;
}

function AboutEditor({ data, onChange }: AboutEditorProps) {
  const addSection = () => {
    onChange({
      ...data,
      sections: [...data.sections, { title: 'New section', content: '' }],
    });
  };

  const updateSection = (index: number, next: AboutSection) => {
    const sections = data.sections.map((section, idx) => (idx === index ? next : section));
    onChange({ ...data, sections });
  };

  const removeSection = (index: number) => {
    const sections = data.sections.filter((_, idx) => idx !== index);
    onChange({ ...data, sections });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Kicker</label>
          <input
            value={data.kicker}
            onChange={(event) => onChange({ ...data, kicker: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Title</label>
          <input
            value={data.title}
            onChange={(event) => onChange({ ...data, title: event.target.value })}
            className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Description</label>
          <textarea
            value={data.description ?? ''}
            onChange={(event) => onChange({ ...data, description: event.target.value })}
            className="min-h-[90px] w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">CTA</label>
          <textarea
            value={data.cta ?? ''}
            onChange={(event) => onChange({ ...data, cta: event.target.value })}
            className="min-h-[90px] w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-surface/40 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Sections</p>
          <button
            type="button"
            onClick={addSection}
            className="rounded-md border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"
          >
            Add section
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {data.sections.map((section, index) => (
            <div key={`${section.title}-${index}`} className="rounded-xl border border-white/5 bg-surface/60 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">Section {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="rounded-md border border-red-400/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-200"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Title</label>
                  <input
                    value={section.title}
                    onChange={(event) => updateSection(index, { ...section, title: event.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Tags</label>
                  <input
                    value={(section.tags ?? []).join(', ')}
                    onChange={(event) =>
                      updateSection(index, { ...section, tags: splitComma(event.target.value) || undefined })
                    }
                    placeholder="Tag one, tag two"
                    className="w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Content</label>
                  <textarea
                    value={section.content ?? ''}
                    onChange={(event) => updateSection(index, { ...section, content: event.target.value })}
                    className="min-h-[90px] w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Items</label>
                  <textarea
                    value={(section.items ?? []).join('\n')}
                    onChange={(event) =>
                      updateSection(index, { ...section, items: splitLines(event.target.value) || undefined })
                    }
                    placeholder="One item per line"
                    className="min-h-[90px] w-full rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>
            </div>
          ))}
          {data.sections.length === 0 && <p className="text-xs text-muted">No sections yet.</p>}
        </div>
      </div>
    </div>
  );
}

function splitComma(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeHomeContent(content: HomeContent): HomeContent {
  return {
    navTitle: content.navTitle ?? '',
    description: content.description ?? '',
    hero: {
      kicker: content.hero?.kicker ?? '',
      title: content.hero?.title ?? '',
      body: content.hero?.body ?? '',
      tags: content.hero?.tags ?? [],
      image: content.hero?.image ?? '',
      imageAlt: content.hero?.imageAlt ?? '',
      note: content.hero?.note ?? '',
    },
  };
}

function normalizeAboutContent(content: AboutContent): AboutContent {
  return {
    kicker: content.kicker ?? '',
    title: content.title ?? '',
    description: content.description ?? '',
    sections: content.sections ?? [],
    cta: content.cta ?? '',
  };
}
