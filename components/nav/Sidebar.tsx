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
import ThemeToggle from '@/components/ui/ThemeToggle';

const NAV_LINKS = [
  { href: '/', label: 'Sparks', icon: Sparkles, exact: true },
  { href: '/templates', label: 'Templates', icon: LayoutGrid, exact: false },
  { href: '/episodes', label: 'Episodes', icon: BookOpen, exact: false },
  { href: '/dive', label: 'Dive', icon: MessageCircle, exact: false },
  { href: '/explore', label: 'Explore', icon: Compass, exact: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Floating rabbit button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={cn(
          'fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full',
          'bg-ink border border-gold/40 hover:border-gold/80',
          'flex items-center justify-center shadow-lg',
          'transition-all duration-200 hover:scale-110 active:scale-95',
          'group'
        )}
        aria-label="Open navigation"
      >
        <Rabbit className="w-5 h-5 text-gold group-hover:text-gold-bright transition-colors" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full border border-gold/20 animate-ping" />
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
              className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-ink-50 border-r border-border flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <Link
                  href="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gold-faint border border-gold/30 flex items-center justify-center group-hover:border-gold/60 transition-colors">
                    <Rabbit className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-serif italic text-sm text-paper leading-none">Down the</p>
                    <p className="font-serif italic text-sm text-gold leading-none">Rabbit Hole</p>
                  </div>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-paper-faint hover:text-paper transition-colors rounded-lg hover:bg-white/5"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
                  const active = isActive(href, exact);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                        active
                          ? 'text-gold bg-gold-faint border border-gold/20'
                          : 'text-paper-muted hover:text-paper hover:bg-white/5'
                      )}
                    >
                      <Icon className={cn('w-4 h-4', active ? 'text-gold' : 'text-paper-faint')} />
                      {label}
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom section */}
              <div className="px-3 py-4 border-t border-border space-y-1">
                <ThemeToggle />
                <p className="px-4 pt-2 text-[0.6rem] font-mono text-paper-faint/60 uppercase tracking-wider">
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
