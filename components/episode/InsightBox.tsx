import { InsightBox as InsightBoxType } from '@/types/episode';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface InsightBoxProps {
  insight: InsightBoxType;
  className?: string;
}

export default function InsightBox({ insight, className }: InsightBoxProps) {
  return (
    <div
      className={cn('rounded-lg px-5 py-4', className)}
      style={{
        background: 'var(--bg-sunken)',
        border: '1px solid var(--border-hairline)',
        borderLeft: '4px solid var(--accent-mustard)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Quote className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent-mustard)' }} />
        <span className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: 'var(--accent-mustard)' }}>
          Commentary
        </span>
        <span className="font-mono text-[0.6rem] tracking-wide" style={{ color: 'var(--ink-faint)' }}>
          · {insight.label}
        </span>
      </div>
      <p className="font-serif italic text-sm text-ink-primary leading-relaxed">
        {insight.text}
      </p>
    </div>
  );
}
