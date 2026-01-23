export type ThemeName = 'dark-cinematic' | 'light-editorial' | 'bold-gradient';

export type MediaType = 'image' | 'video';

export interface MediaAsset {
  type: MediaType;
  src: string;
  alt?: string;
  loop?: boolean;
  autoPlay?: boolean;
}

export type TransitionStyle = 'fade' | 'slide-up' | 'slide-left' | 'zoom';

export type LayoutType = 'hero' | 'split' | 'timeline' | 'immersive';

export interface ActionLink {
  label: string;
  href: string;
}

export interface Citation {
  label: string;
  url: string;
}

export interface TimelineEntry {
  title: string;
  subtitle?: string;
  description: string;
  marker?: string;
}

export interface StoryPage {
  id: string;
  title: string;
  kicker?: string;
  body: string[];
  layout: LayoutType;
  transition?: TransitionStyle;
  background?: MediaAsset;
  foreground?: MediaAsset;
  actions?: ActionLink[];
  timeline?: TimelineEntry[];
  emphasis?: string;
  citations?: Citation[];
}

export interface StoryConfig {
  theme: ThemeName;
  title: string;
  subtitle?: string;
  description?: string;
  publishedAt?: string;
  backgroundMusic?: string;
  badge?: string;
  citations?: Citation[];
  pages: StoryPage[];
}
