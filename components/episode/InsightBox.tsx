import { InsightBox as InsightBoxType } from '@/types/episode';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

interface InsightBoxProps {
  insight: InsightBoxType;
  className?: string;
}

export default function InsightBox({ insight, className }: InsightBoxProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gold/20 bg-gold-faint p-5',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-gold shrink-0" />
        <span className="font-mono text-[0.65rem] text-gold uppercase tracking-wide">
          {insight.label}
        </span>
      </div>
      <p className="font-serif italic text-sm text-paper leading-relaxed">
        {insight.text}
      </p>
    </div>
  );
}
