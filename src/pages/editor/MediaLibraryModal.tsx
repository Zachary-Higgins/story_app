import { useEffect, useMemo, useState } from 'react';
import { withBasePath } from '../../utils/basePath';
import { InfoTip } from './InfoTip';

export type MediaLibraryType = 'image' | 'video' | 'audio';

interface MediaFile {
  name: string;
  path: string;
  size: number;
  updatedAt: number;
}

interface MediaLibraryModalProps {
  open: boolean;
  types: MediaLibraryType[];
  initialType: MediaLibraryType;
  onSelect: (path: string, type: MediaLibraryType) => void;
  onClose: () => void;
}

export function MediaLibraryModal({ open, types, initialType, onSelect, onClose }: MediaLibraryModalProps) {
  const [activeType, setActiveType] = useState<MediaLibraryType>(initialType);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const typeOptions = useMemo(() => Array.from(new Set(types)), [types]);
  const filteredFiles = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return files;
    return files.filter((file) => file.name.toLowerCase().includes(term));
  }, [files, query]);

  useEffect(() => {
    if (open) {
      setActiveType(initialType);
    }
  }, [open, initialType]);

  useEffect(() => {
    if (!open) return;
    void loadFiles(activeType);
  }, [open, activeType]);

  const loadFiles = async (type: MediaLibraryType) => {
    setIsLoading(true);
    setNotice(null);
    try {
      const res = await fetch(withBasePath(`/__story-editor/media?type=${type}`));
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to load files.');
      }
      const payload = (await res.json()) as { files?: MediaFile[] };
      setFiles(payload.files ?? []);
    } catch (err) {
      setNotice((err as Error).message);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!open) return;
    setIsUploading(true);
    setNotice(null);
    try {
      const data = await readFileAsDataUrl(file);
      const res = await fetch(withBasePath(`/__story-editor/media?type=${activeType}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, data }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? 'Failed to upload file.');
      }
      await loadFiles(activeType);
    } catch (err) {
      setNotice((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (file: MediaFile) => {
    if (!open) return;
    setNotice(null);
    try {
      const res = await fetch(withBasePath(`/__story-editor/media?type=${activeType}&name=${encodeURIComponent(file.name)}`), {
        method: 'DELETE',
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? 'Failed to delete file.');
      }
      await loadFiles(activeType);
    } catch (err) {
      setNotice((err as Error).message);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length === 0) return;
    await uploadFile(event.dataTransfer.files[0]);
  };

  const handleBrowse = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
    event.target.value = '';
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-surface/95 p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Media Library</p>
            <h2 className="text-xl font-semibold text-white">Manage {activeType} files</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 hover:text-white"
          >
            Close
          </button>
        </div>

        {typeOptions.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {typeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  activeType === type ? 'bg-accent text-surface shadow-soft' : 'border border-white/10 text-white/70'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-elevated/50 p-6 text-center text-sm text-muted" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Upload
            <InfoTip text="Drag a file in or browse to upload into the current media folder." />
          </p>
          <p>Drag & drop a file here to upload to {activeType}.</p>
          <label className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white">
            Browse files
            <input type="file" className="hidden" accept={acceptForType(activeType)} onChange={handleBrowse} />
          </label>
          {isUploading && <p className="mt-2 text-xs text-muted">Uploading...</p>}
        </div>

        {notice && <p className="mt-3 text-sm text-amber-200">{notice}</p>}

        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                Search
                <InfoTip text="Filter files by name." />
              </label>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by file name..."
                className="w-full max-w-sm rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-sm text-white focus:border-accent/60 focus:outline-none"
              />
            </div>
            <span className="text-xs text-muted">{filteredFiles.length} files</span>
          </div>
          {isLoading && <p className="text-sm text-muted">Loading files...</p>}
          {!isLoading && filteredFiles.length === 0 && <p className="text-sm text-muted">No files found.</p>}
          {!isLoading && filteredFiles.length > 0 && (
            <div className="mt-4 max-h-[50vh] overflow-y-auto pr-2">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredFiles.map((file) => (
                  <div key={file.name} className="rounded-2xl border border-white/10 bg-elevated/60 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                    <button
                      type="button"
                      onClick={() => deleteFile(file)}
                      className="rounded-full border border-red-400/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mt-3 overflow-hidden rounded-xl border border-white/5 bg-surface/60">
                    {activeType === 'image' && (
                      <img src={withBasePath(file.path)} alt={file.name} className="h-24 w-full object-cover" />
                    )}
                    {activeType === 'video' && (
                      <video src={withBasePath(file.path)} className="h-24 w-full object-cover" muted playsInline />
                    )}
                    {activeType === 'audio' && (
                      <audio src={withBasePath(file.path)} controls className="w-full" />
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                    <span>{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => onSelect(file.path, activeType)}
                      className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70 hover:text-white"
                    >
                      Use file
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

function acceptForType(type: MediaLibraryType) {
  if (type === 'image') return 'image/*';
  if (type === 'video') return 'video/*';
  return 'audio/*';
}
