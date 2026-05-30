'use client';

import CloudPicker, { type CloudPickerItem } from './CloudPicker';

interface StepEmotionsProps {
  selected: string[];
  onToggle: (id: string) => void;
}

const EMOTION_ITEMS: CloudPickerItem[] = [
  { id: 'awe',               label: 'Awe',               description: 'The universe is bigger than I thought',         accentColor: '#5B8C6E' },
  { id: 'surprise',          label: 'Surprise',           description: 'I had no idea',                                accentColor: '#C9A94A' },
  { id: 'delight',           label: 'Delight',            description: 'This is fun, clever, or funny',               accentColor: '#D4537E' },
  { id: 'inspiration',       label: 'Inspiration',        description: 'Someone did something extraordinary',          accentColor: '#C9582A' },
  { id: 'education',         label: 'Education',          description: 'I understand something I didn\'t before',      accentColor: '#4A7FA5' },
  { id: 'warmth',            label: 'Warmth',             description: 'This is tender or human',                      accentColor: '#D4537E' },
  { id: 'earned-discomfort', label: 'Earned Discomfort',  description: 'Uncomfortable but worth knowing',              accentColor: '#7B5EA7' },
];

export default function StepEmotions({ selected, onToggle }: StepEmotionsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-2xl leading-tight mb-1" style={{ color: 'var(--ink-primary)' }}>
          How do you want to feel?
        </h2>
        <p className="font-sans text-sm" style={{ color: 'var(--ink-muted)' }}>
          Pick 1–5. We filter out the doom and tailor the tone.
        </p>
      </div>

      <CloudPicker items={EMOTION_ITEMS} selected={selected} onToggle={onToggle} min={1} max={5} />
    </div>
  );
}
