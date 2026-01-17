import { MediaAsset } from '../types/story';
import { useEffect, useRef } from 'react';

interface MediaProps {
  media?: MediaAsset;
  className?: string;
}

export function Media({ media, className = '' }: MediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (media?.type === 'video' && videoRef.current) {
      // Force play after mount
      videoRef.current.play().catch(err => {
        console.log('Video autoplay prevented:', err);
      });
    }
  }, [media]);

  if (!media) return null;
  
  if (media.type === 'video') {
    return (
      <video
        ref={videoRef}
        className={`h-full w-full object-cover ${className}`}
        src={media.src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label={media.alt ?? 'Video background'}
      />
    );
  }
  
  return <img className={`h-full w-full object-cover ${className}`} src={media.src} alt={media.alt ?? ''} />;
}
