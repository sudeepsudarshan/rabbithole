'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rabbit, Sparkles, LayoutList, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';

const NAV_LINKS = [
  { href: '/feed', label: 'Feed', icon: Sparkles },
  { href: '/curate', label: 'Curate', icon: LayoutList },
];

export default function NavBar() {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  return (
    <>
      {/* Desktop Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-ink/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="Down the Rabbit Hole with AI — Home"
          >
            <div className="w-7 h-7 rounded-full bg-gold-faint border border-gold/30 flex items-center justify-center group-hover:border-gold/60 transition-colors">
              <Rabbit className="w-4 h-4 text-gold" />
            </div>
            <span className="font-serif italic text-sm text-paper-muted group-hover:text-paper transition-colors hidden sm:block">
              Down the Rabbit Hole
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-4 py-1.5 text-sm font-sans font-medium rounded-md transition-all duration-150',
                    active
                      ? 'text-gold bg-gold-faint'
                      : 'text-paper-muted hover:text-paper hover:bg-white/5'
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-paper-muted hover:text-paper transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-ink-50 px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    active
                      ? 'text-gold bg-gold-faint'
                      : 'text-paper-muted hover:text-paper hover:bg-white/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-ink/95 backdrop-blur-md safe-bottom"
        aria-label="Mobile navigation"
      >
        <div className="flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium transition-all min-h-[44px]',
                  active ? 'text-gold' : 'text-paper-faint hover:text-paper-muted'
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
