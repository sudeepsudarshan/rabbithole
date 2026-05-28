'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'quiet';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'ghost', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = [
      'inline-flex items-center justify-center',
      'font-sans font-medium rounded-md',
      'transition-colors duration-150',
      'disabled:opacity-40 disabled:pointer-events-none',
      'min-h-[44px]',
    ].join(' ');

    const variants = {
      // The one high-emphasis action per view
      primary: [
        'bg-accent-rust text-elevated',
        'hover:opacity-90 active:opacity-80',
        'disabled:bg-ink-faint disabled:text-page',
      ].join(' '),

      // Default — most actions use this
      ghost: [
        'bg-transparent text-ink-primary',
        'border border-hairline',
        'hover:border-ink-line hover:bg-[var(--state-hover)]',
        'active:bg-[var(--state-active)]',
      ].join(' '),

      // Tertiary — back links, inline nav, text-only
      quiet: [
        'bg-transparent border-none',
        'text-ink-secondary hover:text-ink-primary',
        'min-h-0',
      ].join(' '),
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[0.75rem] tracking-wide',
      md: 'px-5 py-2.5 text-[0.75rem] tracking-wide',
      lg: 'px-8 py-3.5 text-sm',
    };

    // Quiet variant ignores size padding
    const sizeClass = variant === 'quiet' ? 'px-0 py-0 text-[0.75rem]' : sizes[size];

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizeClass, className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
