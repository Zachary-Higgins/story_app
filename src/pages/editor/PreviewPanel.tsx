import type { StoryConfig, StoryPage } from '../../types/story';
import { HeroSection } from '../../components/sections/HeroSection';
import { SplitSection } from '../../components/sections/SplitSection';
import { TimelineSection } from '../../components/sections/TimelineSection';
import { ImmersiveSection } from '../../components/sections/ImmersiveSection';

function renderPreviewSection(page: StoryPage, index: number) {
  switch (page.layout) {
    case 'hero':
      return <HeroSection key={page.id} page={page} index={index} />;
    case 'split':
      return <SplitSection key={page.id} page={page} index={index} flip={index % 2 === 1} />;
    case 'timeline':
      return <TimelineSection key={page.id} page={page} index={index} />;
    case 'immersive':
      return <ImmersiveSection key={page.id} page={page} index={index} />;
    default:
      return null;
  }
}

interface PreviewPanelProps {
  story: StoryConfig | null;
  pages: StoryPage[];
}

export function PreviewPanel({ story, pages }: PreviewPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Live Preview</h2>
        {story && <span className="text-xs text-muted">{story.pages.length} sections</span>}
      </div>
      {!story && <p className="text-sm text-muted">Load a story to preview.</p>}
      {story && pages.map((page, index) => renderPreviewSection(page, index))}
    </div>
  );
}
