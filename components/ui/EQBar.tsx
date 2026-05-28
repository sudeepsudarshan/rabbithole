import { cn } from '@/lib/utils';

interface EQBarProps {
  score: number;
  className?: string;
  showLabel?: boolean;
}

export default function EQBar({ score, className, showLabel = true }: EQBarProps) {
  // Map score to an accent color intensity — higher = richer
  const barColor =
    score >= 90
      ? 'var(--accent-rust)'
      : score >= 75
      ? 'var(--accent-mustard)'
      : 'var(--ink-muted)';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="flex-1 h-0.5 rounded-full overflow-hidden"
        style={{ background: 'var(--border-hairline)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: barColor }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-[0.65rem] text-ink-muted shrink-0">
          EQ {score}
        </span>
      )}
    </div>
  );
}
