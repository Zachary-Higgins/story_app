import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { StoryMeta } from './data/stories';
import { LandingPage } from './pages/LandingPage';
import { StoryView } from './pages/StoryView';
import { AboutPage } from './pages/AboutPage';
import { storyConfigSchema } from './storySchema';
import { withBasePath } from './utils/basePath';

const storyRegistry = [
  { id: 'voyage-of-light', configPath: '/stories/voyage-of-light.json' },
  { id: 'tides-of-the-blue', configPath: '/stories/tides-of-the-blue.json' },
];

export default function App() {
  const [stories, setStories] = useState<StoryMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const loaded = await Promise.all(
          storyRegistry.map(async (reg) => {
            try {
              const configPath = withBasePath(reg.configPath);
              const res = await fetch(configPath);
              const raw = await res.json();
              const parsed = storyConfigSchema.safeParse(raw);
              if (parsed.success) {
                const config = parsed.data;
                // Extract cover from first page's foreground or background
                const firstPage = config.pages?.[0];
                const coverSrc = firstPage?.foreground?.src || firstPage?.background?.src || '';
                return {
                  id: reg.id,
                  title: config.title,
                  subtitle: config.subtitle,
                  description: config.description || config.subtitle || config.title,
                  theme: config.theme,
                  cover: withBasePath(coverSrc),
                  configPath,
                  badge: config.badge,
                  publishedAt: config.publishedAt || new Date().toISOString(),
                } as StoryMeta;
              }
            } catch (e) {
              console.error(`Failed to load story ${reg.id}:`, e);
            }
            return null;
          })
        );
        const validStories = loaded.filter((s) => s !== null) as StoryMeta[];
        // Sort by publishedAt, newest first
        validStories.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        setStories(validStories);
      } catch (e) {
        console.error('Failed to load stories:', e);
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-surface text-text flex items-center justify-center">
        <div className="text-muted">Loading stories...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-surface text-text">
      <Navigation stories={stories} />
      <main className="relative min-h-screen px-4 pb-16 pt-10 pl-4 md:px-10 md:pl-80">
        <Routes>
          <Route path="/" element={<LandingPage stories={stories} />} />
          <Route path="/story/:id" element={<StoryView />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
