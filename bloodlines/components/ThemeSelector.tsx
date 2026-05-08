import { X, Check } from 'lucide-react';
import { Theme } from '../types';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onClose: () => void;
}

const themes = [
  {
    id: 'bloodlines' as Theme,
    name: 'Bloodlines',
    description: 'Deep red palette for royal lineages',
    colors: {
      primary: '#dc2626',
      accent: '#ef4444',
      surface: '#1a1625'
    }
  },
  {
    id: 'forest' as Theme,
    name: 'Family Forest',
    description: 'Natural green tones for family trees',
    colors: {
      primary: '#059669',
      accent: '#10b981',
      surface: '#0f1e17'
    }
  },
  {
    id: 'ocean' as Theme,
    name: 'Ocean Deep',
    description: 'Calming blue waters',
    colors: {
      primary: '#0284c7',
      accent: '#0ea5e9',
      surface: '#0c1a25'
    }
  },
  {
    id: 'sunset' as Theme,
    name: 'Sunset Heritage',
    description: 'Warm orange and amber hues',
    colors: {
      primary: '#ea580c',
      accent: '#f97316',
      surface: '#1f1410'
    }
  },
  {
    id: 'royal' as Theme,
    name: 'Royal Purple',
    description: 'Regal purple for noble families',
    colors: {
      primary: '#7c3aed',
      accent: '#8b5cf6',
      surface: '#18132b'
    }
  }
];

export default function ThemeSelector({ currentTheme, onThemeChange, onClose }: ThemeSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-dark border border-border rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-surface-dark z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Choose Your Theme</h2>
            <p className="text-sm text-muted">Customize the look and feel of your family tree</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-muted" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => {
                onThemeChange(theme.id);
                onClose();
              }}
              className={`relative p-6 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                currentTheme === theme.id
                  ? 'border-primary shadow-lg shadow-primary/20'
                  : 'border-border hover:border-border-light'
              }`}
              style={{
                background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.primary}15 100%)`
              }}
            >
              {currentTheme === theme.id && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}

              <h3 className="text-lg font-semibold text-white mb-2">{theme.name}</h3>
              <p className="text-sm text-muted-dark mb-4">{theme.description}</p>

              <div className="flex gap-2">
                <div className="w-12 h-12 rounded-lg border-2 border-white/20" style={{ backgroundColor: theme.colors.primary }} />
                <div className="w-12 h-12 rounded-lg border-2 border-white/20" style={{ backgroundColor: theme.colors.accent }} />
                <div className="w-12 h-12 rounded-lg border-2 border-white/20" style={{ backgroundColor: theme.colors.surface }} />
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-border bg-surface/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">More themes and customization coming soon!</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
