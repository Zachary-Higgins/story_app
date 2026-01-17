import { useEffect, useRef, useState } from 'react';
import { withBasePath } from '../utils/basePath';

interface AudioControllerProps {
  src?: string;
}

// Modern browsers block autoplay with sound. Strategy: start muted and begin playback, then auto-unmute on the
// first user interaction (click/tap/keypress). If that still fails, the button remains available to toggle sound.
export function AudioController({ src }: AudioControllerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setMuted] = useState(true);
  const [isReady, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolvedSrc = src ? withBasePath(src) : '';

  // Create and clean up audio element when source changes
  useEffect(() => {
    if (!resolvedSrc) return undefined;
    const el = new Audio(resolvedSrc);
    el.loop = true;
    el.preload = 'auto';
    el.volume = 0.6;
    el.muted = true; // allow autoplay while muted
    audioRef.current = el;

    const onCanPlay = () => setReady(true);
    const onError = () => setError('Audio failed to load.');
    el.addEventListener('canplaythrough', onCanPlay);
    el.addEventListener('error', onError);

    // Try to start playback muted; ignore failures (user can click to start)
    el.play().catch(() => {
      // keep muted and paused; user click will retry
    });

    // Arm a one-time listener to unmute on the first user interaction
    const handleFirstInteraction = () => setMuted(false);
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      el.pause();
      el.src = '';
      el.removeEventListener('canplaythrough', onCanPlay);
      el.removeEventListener('error', onError);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      audioRef.current = null;
      setReady(false);
      setError(null);
      setMuted(true);
    };
  }, [resolvedSrc]);

  // Toggle mute/unmute and ensure playback on unmute
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    setError(null);
    el.muted = isMuted;
    if (!isMuted) {
      el.play().catch(() => {
        setMuted(true);
        setError('Click again to enable audio (interaction required).');
      });
    }
  }, [isMuted]);

  if (!resolvedSrc) return null;

  const label = isMuted ? 'Sound on' : 'Sound off';

  return (
    <div className="control-bar">
      <span className="font-semibold uppercase tracking-[0.18em] text-accent">Audio</span>
      <button
        onClick={() => setMuted((prev) => !prev)}
        disabled={!isReady && !error}
        className={`rounded-full px-3 py-1 font-semibold transition ${
          isMuted ? 'bg-surface text-muted hover:text-white' : 'bg-accent text-surface shadow-soft'
        } ${isReady || error ? '' : 'opacity-60'}`}
      >
        {label}
      </button>
      {error && <span className="text-[11px] text-accent">{error}</span>}
      {!error && !isReady && <span className="text-[11px] text-muted">Loading…</span>}
    </div>
  );
}
