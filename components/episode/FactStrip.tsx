import { FactItem } from '@/types/episode';
import { cn } from '@/lib/utils';

interface FactStripProps {
  facts: [FactItem, FactItem, FactItem];
  className?: string;
}

export default function FactStrip({ facts, className }: FactStripProps) {
  return (
    <div className={cn('grid grid-cols-3 border border-hairline rounded-lg overflow-hidden', className)}>
      {facts.map((fact, i) => (
        <div
          key={i}
          className={cn(
            'px-4 py-4 text-center',
            i < facts.length - 1 && 'border-r border-hairline'
          )}
        >
          <div className="font-serif text-2xl font-bold text-accent-mustard mb-1 leading-none">
            {fact.value}
          </div>
          <div className="font-mono text-[0.65rem] text-ink-muted leading-tight">
            {fact.label}
          </div>
        </div>
      ))}
    </div>
  );
}
