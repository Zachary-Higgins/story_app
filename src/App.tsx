import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { StoryMeta, loadStoryConfig, storyRegistry, toStoryMeta } from './data/stories';
import { LandingPage } from './pages/LandingPage';
import { StoryView } from './pages/StoryView';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const [stories, setStories] = useState<StoryMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const loaded = await Promise.all(
          storyRegistry.map(async (reg) => {
            try {
              const { config, configPath } = await loadStoryConfig(reg);
              return toStoryMeta(reg, config, configPath);
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
