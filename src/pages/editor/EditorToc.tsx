import type { StoryPage } from '../../types/story';

interface EditorTocProps {
  pages: StoryPage[];
  hasStory: boolean;
}

const scrollToId = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export function EditorToc({ pages, hasStory }: EditorTocProps) {
  return (
    <aside className="rounded-3xl border border-white/5 bg-elevated/70 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Table of Contents</p>
      <div className="mt-4 space-y-2 text-sm">
        {hasStory && (
          <button
            type="button"
            onClick={() => scrollToId('editor-story-details')}
            className="block text-left text-white/80 hover:text-white"
          >
            Story details
          </button>
        )}
        {hasStory && (
          <button
            type="button"
            onClick={() => scrollToId('editor-story-pages')}
            className="block text-left text-white/80 hover:text-white"
          >
            Pages
          </button>
        )}
      </div>
      {hasStory && (
        <div className="mt-4 border-t border-white/5 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Sections</p>
          <div className="mt-2 space-y-2 text-sm">
            {pages.map((page, index) => (
              <button
                key={page.id}
                type="button"
                onClick={() => scrollToId(`editor-page-${index}`)}
                className="block text-left text-white/70 hover:text-white"
              >
                {index + 1}. {page.title || page.id}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
