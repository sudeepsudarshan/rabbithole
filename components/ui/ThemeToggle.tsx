'use client';

import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useUIStore();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all',
        'text-paper-muted hover:text-paper hover:bg-white/5',
        className
      )}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-gold" />
        ) : (
          <Moon className="w-4 h-4 text-gold" />
        )}
      </div>
      <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>

      {/* Toggle pill */}
      <div className="ml-auto w-10 h-5 rounded-full bg-ink-100 border border-border relative flex-shrink-0">
        <div
          className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full bg-gold transition-all duration-200',
            theme === 'dark' ? 'left-0.5' : 'left-[1.375rem]'
          )}
        />
      </div>
    </button>
  );
}
