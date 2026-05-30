'use client';

import CloudPicker, { type CloudPickerItem } from './CloudPicker';
import { PERSONAS, TEMPLATE_LENS } from '@/lib/personas';

interface StepLensesProps {
  selected: string[];
  onToggle: (id: string) => void;
}

const LENS_ITEMS: CloudPickerItem[] = Object.values(PERSONAS).map(p => ({
  id: p.id,
  label: `${p.mark} ${p.displayName}`,
  description: p.tagline,
}));

// Pre-compute template IDs per lens for display
const LENS_TEMPLATES: Record<string, string[]> = {};
for (const [templateId, lensId] of Object.entries(TEMPLATE_LENS)) {
  if (!LENS_TEMPLATES[lensId]) LENS_TEMPLATES[lensId] = [];
  LENS_TEMPLATES[lensId].push(templateId);
}

export default function StepLenses({ selected, onToggle }: StepLensesProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-2xl leading-tight mb-1" style={{ color: 'var(--ink-primary)' }}>
          Who do you want telling these stories?
        </h2>
        <p className="font-sans text-sm" style={{ color: 'var(--ink-muted)' }}>
          Pick 2–6 Lenses. Each one sees the world differently.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {Object.values(PERSONAS).map(p => {
          const isSelected = selected.includes(p.id);
          const atMax = selected.length >= 6 && !isSelected;
          return (
            <button
              key={p.id}
              onClick={() => !atMax && onToggle(p.id)}
              className={[
                'text-left px-4 py-3 rounded-xl border transition-all duration-150',
                isSelected ? 'scale-[1.01]' : 'scale-100',
                atMax ? 'opacity-40 cursor-default' : 'cursor-pointer',
              ].join(' ')}
              style={{
                borderColor: isSelected ? 'var(--ink-primary)' : 'var(--border-hairline)',
                background: isSelected ? 'var(--bg-elevated)' : 'transparent',
              }}
              aria-pressed={isSelected}
              disabled={atMax}
            >
              <div className="flex items-baseline gap-2 mb-0.5">
                <span
                  className="font-mono text-[0.6rem] tracking-wider uppercase"
                  style={{ color: 'var(--ink-faint)' }}
                >
                  {p.mark}
                </span>
                <span className="font-serif italic text-base" style={{ color: 'var(--ink-primary)' }}>
                  {p.displayName}
                </span>
              </div>
              <p className="font-sans text-[0.78rem]" style={{ color: 'var(--ink-muted)' }}>
                {p.tagline}
              </p>
              {LENS_TEMPLATES[p.id] && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.bestFor.map(tag => (
                    <span
                      key={tag}
                      className="font-mono text-[0.55rem] tracking-wide uppercase px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--bg-page)', color: 'var(--ink-faint)', border: '1px solid var(--border-hairline)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Also show cloud view for quick selection */}
      <div className="pt-2">
        <p className="font-mono text-[0.58rem] tracking-widest uppercase mb-3" style={{ color: 'var(--ink-faint)' }}>
          Or pick from cloud
        </p>
        <CloudPicker items={LENS_ITEMS} selected={selected} onToggle={onToggle} min={2} max={6} />
      </div>
    </div>
  );
}
