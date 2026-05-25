import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'muted' | 'accent';
  accentColor?: string;
}

export default function Badge({
  className,
  variant = 'muted',
  accentColor,
  style,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    gold: 'bg-gold-faint text-gold border border-gold/20',
    muted: 'bg-white/5 text-paper-muted border border-white/10',
    accent: 'border',
  };

  const accentStyle =
    variant === 'accent' && accentColor
      ? {
          backgroundColor: `${accentColor}20`,
          color: accentColor,
          borderColor: `${accentColor}40`,
          ...style,
        }
      : style;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[0.65rem] leading-none font-normal uppercase tracking-wide',
        variants[variant],
        className
      )}
      style={accentStyle}
      {...props}
    >
      {children}
    </span>
  );
}
