interface JsonEditorPanelProps {
  rawJson: string;
  rawDirty: boolean;
  onJsonChange: (next: string) => void;
  onApplyJson: () => void;
  onSyncJson: () => void;
  validationErrors: string[];
}

export function JsonEditorPanel({
  rawJson,
  rawDirty,
  onJsonChange,
  onApplyJson,
  onSyncJson,
  validationErrors,
}: JsonEditorPanelProps) {
  return (
    <div className="rounded-3xl border border-white/5 bg-elevated/70 p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">JSON Editor</h2>
        {rawDirty && <span className="text-xs uppercase tracking-[0.2em] text-amber-200">Unsaved JSON</span>}
      </div>
      <textarea
        value={rawJson}
        onChange={(event) => onJsonChange(event.target.value)}
        className="mt-4 min-h-[420px] w-full rounded-2xl border border-white/10 bg-surface/60 px-4 py-3 font-mono text-xs text-white"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onApplyJson}
          className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-surface shadow-soft hover:bg-accentStrong"
        >
          Apply JSON
        </button>
        <button
          type="button"
          onClick={onSyncJson}
          className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:border-accent"
        >
          Sync from form
        </button>
      </div>
      {validationErrors.length > 0 && (
        <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-xs text-red-200">
          <p className="font-semibold uppercase tracking-[0.2em]">Validation errors</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {validationErrors.map((error, idx) => (
              <li key={`${error}-${idx}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
