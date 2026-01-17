import { MediaAsset } from '../types/story';

interface MediaProps {
  media?: MediaAsset;
  className?: string;
}

export function Media({ media, className = '' }: MediaProps) {
  if (!media) return null;
  if (media.type === 'video') {
    return (
      <video
        className={`h-full w-full object-cover ${className}`}
        src={media.src}
        autoPlay={media.autoPlay ?? true}
        loop={media.loop ?? true}
        muted
        playsInline
        aria-label={media.alt ?? 'Video background'}
      />
    );
  }
  return <img className={`h-full w-full object-cover ${className}`} src={media.src} alt={media.alt ?? ''} />;
}
