import { cn } from '@/lib/utils';

interface SparkDotsProps {
  count: number;
  current: number;
  onSelect: (index: number) => void;
}

export default function SparkDots({ count, current, onSelect }: SparkDotsProps) {
  return (
    <div className="flex items-center gap-2" role="tablist" aria-label="Spark navigation">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          role="tab"
          aria-selected={i === current}
          aria-label={`Spark ${i + 1}`}
          className={cn(
            'transition-all duration-300 rounded-full',
            i === current
              ? 'w-6 h-1.5 bg-gold'
              : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
          )}
        />
      ))}
    </div>
  );
}
