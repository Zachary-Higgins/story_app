import type { StoryPage } from '../../types/story';

interface EditorTocProps {
  pages: StoryPage[];
  hasStory: boolean;
}

export function EditorToc({ pages, hasStory }: EditorTocProps) {
  if (!hasStory) return null;

  return (
    <aside className="rounded-3xl border border-white/5 bg-elevated/70 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Table of Contents</p>
      <div className="mt-4 space-y-2 text-sm">
        <a href="#editor-story-details" className="block text-white/80 hover:text-white">
          Story details
        </a>
        <a href="#editor-story-pages" className="block text-white/80 hover:text-white">
          Pages
        </a>
      </div>
      <div className="mt-4 border-t border-white/5 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Sections</p>
        <div className="mt-2 space-y-2 text-sm">
          {pages.map((page, index) => (
            <a key={page.id} href={`#editor-page-${index}`} className="block text-white/70 hover:text-white">
              {index + 1}. {page.title || page.id}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
