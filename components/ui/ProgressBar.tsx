'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export default function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'sm',
  className,
  ...props
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const heights = {
    sm: 'h-1',
    md: 'h-2',
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      <div
        className={cn(
          'w-full bg-white/10 rounded-full overflow-hidden',
          heights[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="mt-1 text-xs font-mono text-paper-faint">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}
