'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavHistory } from '@/lib/useReturnPath';
import { cn } from '@/lib/utils';

interface BackLinkProps {
  /** Hard fallback path when no history is available (e.g. "/templates") */
  fallback: string;
  /** Label used when falling back to the default path */
  fallbackLabel: string;
  className?: string;
}

/** Map a prior path to a human-readable "← …" label. */
function labelForPath(prev: string): string {
  if (prev === '/') return 'Home';
  if (prev === '/templates') return 'All templates';
  if (prev.startsWith('/templates/')) return 'Back to template';
  if (prev === '/episodes') return 'All episodes';
  if (prev.startsWith('/episodes/')) return 'Back to episode';
  if (prev === '/sparks' || prev === '/') return 'Sparks';
  if (prev === '/explore') return 'Explore';
  if (prev === '/dive') return 'Dive';
  return 'Back';
}

export default function BackLink({ fallback, fallbackLabel, className }: BackLinkProps) {
  const pathname = usePathname();
  const getReturnPath = useNavHistory((s) => s.getReturnPath);

  const returnPath = getReturnPath(pathname, fallback);
  const isDefault = returnPath === fallback;
  const label = isDefault ? fallbackLabel : labelForPath(returnPath);

  return (
    <Link
      href={returnPath}
      className={cn(
        'inline-flex items-center gap-1 text-sm font-sans',
        'text-ink-muted hover:text-ink-primary transition-colors duration-150',
        className
      )}
    >
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </Link>
  );
}
