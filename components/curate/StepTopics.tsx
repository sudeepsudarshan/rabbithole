'use client';

import { TOPICS } from '@/lib/topics';
import CloudPicker from './CloudPicker';

interface StepTopicsProps {
  selected: string[];
  onToggle: (id: string) => void;
  onSkip: () => void;
}

const ITEMS = TOPICS.map(t => ({ id: t.id, label: t.name, description: t.description }));

export default function StepTopics({ selected, onToggle, onSkip }: StepTopicsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-2xl leading-tight mb-1" style={{ color: 'var(--ink-primary)' }}>
          What&rsquo;s calling you today?
        </h2>
        <p className="font-sans text-sm" style={{ color: 'var(--ink-muted)' }}>
          Pick 2–8 topics. We&rsquo;ll pull from the best sources for each.
        </p>
      </div>

      <CloudPicker items={ITEMS} selected={selected} onToggle={onToggle} min={2} max={8} />

      {selected.length < 2 && (
        <button
          onClick={onSkip}
          className="self-start font-mono text-[0.65rem] tracking-widest uppercase transition-colors hover:text-[var(--ink-primary)]"
          style={{ color: 'var(--ink-faint)' }}
        >
          Skip — surprise me
        </button>
      )}
    </div>
  );
}
