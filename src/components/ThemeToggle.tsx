import { ThemeName } from '../types/story';
import { THEMES, themeLabels } from '../theme/themes';

interface ThemeToggleProps {
  value: ThemeName;
  onChange: (theme: ThemeName) => void;
}

export function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  return (
    <div className="control-bar">
      <span className="font-semibold uppercase tracking-[0.18em] text-accent">Theme</span>
      <div className="flex gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() => onChange(theme)}
            className={`rounded-full px-3 py-1 font-semibold transition ${
              value === theme ? 'bg-accent text-surface shadow-soft' : 'bg-surface text-muted hover:text-white'
            }`}
          >
            {themeLabels[theme]}
          </button>
        ))}
      </div>
    </div>
  );
}
