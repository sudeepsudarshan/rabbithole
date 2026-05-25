import { cn } from '@/lib/utils';

interface EQBarProps {
  score: number;
  className?: string;
  showLabel?: boolean;
}

export default function EQBar({ score, className, showLabel = true }: EQBarProps) {
  const getColor = (score: number) => {
    if (score >= 90) return 'bg-gold-bright';
    if (score >= 80) return 'bg-gold';
    if (score >= 70) return 'bg-gold-dim';
    return 'bg-paper-faint';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', getColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      {showLabel && (
        <span className="font-mono text-[0.65rem] text-gold shrink-0">
          EQ {score}
        </span>
      )}
    </div>
  );
}
