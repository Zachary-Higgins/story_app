import { Navigate, Route, Routes } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { stories } from './data/stories';
import { LandingPage } from './pages/LandingPage';
import { StoryView } from './pages/StoryView';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  return (
    <div className="relative min-h-screen bg-surface text-text">
      <Navigation stories={stories} />
      <main className="relative min-h-screen px-4 pb-16 pt-10 pl-16 md:px-10 md:pl-80">
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
