'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, BookOpen, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/', label: 'Home', icon: Home, exact: true },
  { href: '/feed', label: 'Feed', icon: Sparkles, exact: false },
  { href: '/saved', label: 'Saved', icon: BookOpen, exact: false },
  { href: '/dive', label: 'Ask AI', icon: MessageCircle, exact: false },
];

// Paths where the bottom nav should be hidden (full-screen experiences)
const HIDDEN_PATHS = ['/sparks', '/feed'];

export default function BottomNav() {
  const pathname = usePathname();

  if (HIDDEN_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return null;
  }

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden flex items-stretch"
      style={{
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-hairline)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-label="Main navigation"
    >
      {ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors',
              active ? 'text-[var(--accent-rust)]' : 'text-[var(--ink-muted)]'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="w-5 h-5" />
            <span className="font-mono text-[0.52rem] uppercase tracking-widest leading-none">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
