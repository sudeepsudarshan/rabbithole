'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Rabbit,
  Sparkles,
  LayoutGrid,
  BookOpen,
  MessageCircle,
  Compass,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';

const NAV_LINKS = [
  { href: '/', label: 'Sparks', icon: Sparkles, exact: true },
  { href: '/templates', label: 'Templates', icon: LayoutGrid, exact: false },
  { href: '/episodes', label: 'Episodes', icon: BookOpen, exact: false },
  { href: '/dive', label: 'Dive', icon: MessageCircle, exact: false },
  { href: '/explore', label: 'Explore', icon: Compass, exact: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, theme, toggleTheme } = useUIStore();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Floating rabbit button — top-left, respects iOS notch */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={cn(
          'fixed left-4 z-50 w-11 h-11 rounded-full',
          'bg-[var(--bg-elevated)] border border-hairline hover:border-ink-line',
          'flex items-center justify-center',
          'transition-colors duration-150',
          'group'
        )}
        style={{ top: 'max(16px, env(safe-area-inset-top) + 8px)' }}
        aria-label="Open navigation"
      >
        <Rabbit className="w-4 h-4 text-accent-rust" />
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col"
              style={{
                background: 'var(--bg-elevated)',
                borderRight: '1px solid var(--border-hairline)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid var(--border-hairline)' }}
              >
                <Link
                  href="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2.5 group"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: 'var(--state-hover)',
                      border: '1px solid var(--border-hairline)',
                    }}
                  >
                    <Rabbit className="w-4 h-4 text-accent-rust" />
                  </div>
                  <div>
                    <p className="font-serif text-sm text-ink-primary leading-none">Down the</p>
                    <p className="font-serif text-sm text-accent-rust leading-none">Rabbit Hole</p>
                  </div>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-ink-muted hover:text-ink-primary transition-colors rounded-md hover:bg-[var(--state-hover)]"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
                  const active = isActive(href, exact);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-sans transition-colors duration-150',
                        active
                          ? 'text-ink-primary bg-[var(--state-active)] border border-hairline'
                          : 'text-ink-secondary hover:text-ink-primary hover:bg-[var(--state-hover)]'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0',
                          active ? 'text-accent-rust' : 'text-ink-muted'
                        )}
                      />
                      {label}
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-rust" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom: editorial Day/Night toggle + version */}
              <div
                className="px-5 py-4 space-y-3"
                style={{ borderTop: '1px solid var(--border-hairline)' }}
              >
                {/* Day · Night toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 w-full group"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                >
                  <span
                    className="font-mono text-[0.625rem] tracking-widest transition-colors duration-300"
                    style={{ color: theme === 'light' ? 'var(--ink-primary)' : 'var(--ink-faint)' }}
                  >
                    Day
                  </span>

                  {/* Track */}
                  <span
                    className="relative flex-1 h-px"
                    style={{ background: 'var(--border-hairline)' }}
                  >
                    {/* Sliding dot */}
                    <motion.span
                      className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent-rust"
                      animate={{ left: theme === 'dark' ? '100%' : '0%' }}
                      style={{ translateX: theme === 'dark' ? '-100%' : '0%' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    />
                  </span>

                  <span
                    className="font-mono text-[0.625rem] tracking-widest transition-colors duration-300"
                    style={{ color: theme === 'dark' ? 'var(--ink-primary)' : 'var(--ink-faint)' }}
                  >
                    Night
                  </span>
                </button>

                <p className="font-mono text-[0.6rem] text-ink-faint">
                  Down the Rabbit Hole · v0.1
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
