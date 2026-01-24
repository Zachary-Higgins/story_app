export type EditorTab = 'editor' | 'json' | 'preview';

interface EditorTabsProps {
  activeTab: EditorTab;
  onChange: (tab: EditorTab) => void;
}

export function EditorTabs({ activeTab, onChange }: EditorTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/5 bg-elevated/70 p-2">
      <button
        type="button"
        onClick={() => onChange('editor')}
        className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
          activeTab === 'editor' ? 'bg-accent text-surface shadow-soft' : 'text-white/70 hover:text-white'
        }`}
      >
        Interactive Editor
      </button>
      <button
        type="button"
        onClick={() => onChange('json')}
        className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
          activeTab === 'json' ? 'bg-accent text-surface shadow-soft' : 'text-white/70 hover:text-white'
        }`}
      >
        JSON
      </button>
      <button
        type="button"
        onClick={() => onChange('preview')}
        className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
          activeTab === 'preview' ? 'bg-accent text-surface shadow-soft' : 'text-white/70 hover:text-white'
        }`}
      >
        Live Preview
      </button>
    </div>
  );
}
