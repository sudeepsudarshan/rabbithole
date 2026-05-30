'use client';

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

const FONT_SIZES = ['text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
const MARGINS = ['mr-2', 'mr-3', 'mr-4', 'mr-2', 'mr-3'];

export interface CloudPickerItem {
  id: string;
  label: string;
  description?: string;
  accentColor?: string;
}

interface CloudPickerProps {
  items: CloudPickerItem[];
  selected: string[];
  onToggle: (id: string) => void;
  min?: number;
  max?: number;
}

export default function CloudPicker({ items, selected, onToggle, max }: CloudPickerProps) {
  return (
    <div className="flex flex-wrap gap-y-3">
      {items.map(item => {
        const h = hashId(item.id);
        const fontSize = FONT_SIZES[h % FONT_SIZES.length];
        const margin = MARGINS[h % MARGINS.length];
        const isSelected = selected.includes(item.id);
        const atMax = max !== undefined && selected.length >= max && !isSelected;

        return (
          <button
            key={item.id}
            onClick={() => !atMax && onToggle(item.id)}
            className={[
              fontSize,
              margin,
              'font-serif italic leading-tight px-3 py-1.5 rounded-full border transition-all duration-150',
              isSelected ? 'scale-105' : 'scale-100',
              atMax ? 'opacity-40 cursor-default' : 'cursor-pointer hover:opacity-90',
            ].join(' ')}
            style={{
              borderColor: isSelected ? 'var(--ink-primary)' : 'var(--border-hairline)',
              background: isSelected && item.accentColor
                ? `${item.accentColor}20`
                : isSelected
                ? 'var(--bg-elevated)'
                : 'transparent',
              color: isSelected ? 'var(--ink-primary)' : 'var(--ink-secondary)',
            }}
            aria-pressed={isSelected}
            disabled={atMax}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
