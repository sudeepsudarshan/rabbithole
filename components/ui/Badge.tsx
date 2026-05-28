import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'accent' | 'muted' | 'rust' | 'mustard' | 'sage' | 'rose' | 'sky' | 'plum';
  accentColor?: string;
}

// Semantic accent configs — each maps to one CSS variable accent
const SEMANTIC_VARIANTS: Record<string, { bg: string; text: string; border: string }> = {
  rust:    { bg: 'rgba(201,88,42,0.12)',  text: 'var(--accent-rust)',    border: 'rgba(201,88,42,0.30)'  },
  mustard: { bg: 'rgba(212,164,55,0.12)', text: 'var(--accent-mustard)', border: 'rgba(212,164,55,0.30)' },
  sage:    { bg: 'rgba(111,139,93,0.12)', text: 'var(--accent-sage)',    border: 'rgba(111,139,93,0.30)' },
  rose:    { bg: 'rgba(208,138,135,0.12)',text: 'var(--accent-rose)',    border: 'rgba(208,138,135,0.30)'},
  sky:     { bg: 'rgba(122,156,176,0.12)',text: 'var(--accent-sky)',     border: 'rgba(122,156,176,0.30)'},
  plum:    { bg: 'rgba(142,107,142,0.12)',text: 'var(--accent-plum)',    border: 'rgba(142,107,142,0.30)'},
  muted:   { bg: 'rgba(138,126,104,0.10)',text: 'var(--ink-muted)',      border: 'rgba(138,126,104,0.25)'},
};

export default function Badge({
  className,
  variant = 'muted',
  accentColor,
  style,
  children,
  ...props
}: BadgeProps) {
  // Free-form accent color (per-spark hex)
  const accentStyle =
    variant === 'accent' && accentColor
      ? {
          backgroundColor: `${accentColor}1F`,  // ~12%
          color: accentColor,
          borderColor: `${accentColor}4D`,       // ~30%
          ...style,
        }
      : variant !== 'accent' && SEMANTIC_VARIANTS[variant]
      ? {
          backgroundColor: SEMANTIC_VARIANTS[variant].bg,
          color: SEMANTIC_VARIANTS[variant].text,
          borderColor: SEMANTIC_VARIANTS[variant].border,
          ...style,
        }
      : style;

  return (
    <span
      className={cn(
        // Base: manga-panel badge — sharp radius, mono label font
        'inline-flex items-center rounded-sm px-2.5 py-0.5',
        'font-mono text-[0.6875rem] leading-none tracking-wide',
        'border',
        className
      )}
      style={accentStyle}
      {...props}
    >
      {children}
    </span>
  );
}
