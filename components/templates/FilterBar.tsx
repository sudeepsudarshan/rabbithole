'use client';

import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'high-engagement', label: 'Top Engagement' },
  { value: 'short', label: 'Under 15 min' },
  { value: 'history', label: 'History' },
  { value: 'science', label: 'Science' },
  { value: 'philosophy', label: 'Philosophy' },
  { value: 'comedy', label: 'Comedy' },
];

export default function FilterBar() {
  const { activeFilter, setActiveFilter } = useUIStore();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="Filter templates">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setActiveFilter(value)}
          role="tab"
          aria-selected={activeFilter === value}
          className={cn(
            'shrink-0 px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-colors duration-150 whitespace-nowrap min-h-[44px]',
            activeFilter === value
              ? 'bg-accent-rust text-elevated border border-transparent'
              : 'bg-transparent text-ink-muted border border-hairline hover:border-ink-line hover:text-ink-primary hover:bg-[var(--state-hover)]'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
