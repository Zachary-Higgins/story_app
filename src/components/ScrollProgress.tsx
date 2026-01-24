import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      const pct = height > 0 ? Math.min(1, scrollTop / height) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full bg-surface/60">
      <div
        className="h-full bg-gradient-to-r from-accent to-accentStrong shadow-lg transition-[width]"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
