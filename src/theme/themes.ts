import { ThemeName } from '../types/story';

export const THEMES: ThemeName[] = ['dark-cinematic', 'light-editorial', 'bold-gradient'];

export const themeLabels: Record<ThemeName, string> = {
  'dark-cinematic': 'Dark Cinematic',
  'light-editorial': 'Light Editorial',
  'bold-gradient': 'Bold Gradient',
};

export function applyTheme(theme: ThemeName) {
  const html = document.documentElement;
  html.dataset.theme = theme;
}
