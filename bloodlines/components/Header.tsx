import { Search, Palette } from 'lucide-react';
import { Theme } from '../types';

interface HeaderProps {
  onThemeClick: () => void;
  currentTheme: Theme;
}

export default function Header({ onThemeClick, currentTheme }: HeaderProps) {
  return (
    <header className="h-20 border-b border-border bg-surface-dark px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">B</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wider">BLOODLINES</h1>
            <p className="text-xs text-accent">Royal lineage lab</p>
          </div>
        </div>

        <nav className="hidden md:flex gap-6 ml-8">
          <a href="#" className="text-sm text-muted hover:text-white transition-colors">Product</a>
          <a href="#" className="text-sm text-muted hover:text-white transition-colors">Family</a>
          <a href="#" className="text-sm text-muted hover:text-white transition-colors">Explore</a>
          <a href="#" className="text-sm text-muted hover:text-white transition-colors">Marketplace</a>
          <a href="#" className="text-sm text-muted hover:text-white transition-colors">Pricing</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden md:inline-flex px-4 py-2 text-sm text-muted hover:text-white transition-colors items-center gap-2">
          <Search className="w-4 h-4" />
          SEARCH
        </button>
        <button
          onClick={onThemeClick}
          className="px-4 py-2 text-sm bg-surface hover:bg-surface-light rounded-lg transition-colors flex items-center gap-2 border border-border"
        >
          <Palette className="w-4 h-4" />
          Theme
        </button>
        <button className="hidden md:inline-flex px-4 py-2 text-sm text-muted hover:text-white border border-border rounded-lg transition-colors">
          Sign in
        </button>
        <button className="px-6 py-2 text-sm bg-primary hover:bg-primary-light text-white rounded-lg transition-colors">
          Sign up
        </button>
      </div>
    </header>
  );
}
