'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { Sparkles, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
  const shouldReduce = useReducedMotion();

  const fadeUp = shouldReduce
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <section className="relative min-h-[90svh] flex items-center justify-center overflow-hidden px-6 py-20">
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Eyebrow — the editorial ornament */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="h-px w-10 bg-[var(--ink-faint)]" />
          <span className="font-mono text-[0.6875rem] text-ink-muted tracking-widest">
            AI curiosity platform
          </span>
          <div className="h-px w-10 bg-[var(--ink-faint)]" />
        </motion.div>

        {/* Main headline — upright Playfair, not italic */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
          className="font-serif leading-none mb-6 text-ink-primary"
          style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', letterSpacing: '-0.02em' }}
        >
          Down the
          <br />
          <span style={{ color: 'var(--accent-rust)' }}>Rabbit Hole</span>
          <br />
          with AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
          className="font-sans text-lg text-ink-secondary max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Start with any question. Go somewhere you never expected.
          A curiosity-driven podcast where every conversation digs deeper.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          <Link href="/sparks">
            <Button variant="primary" size="lg" className="gap-2.5 w-full sm:w-auto">
              <Sparkles className="w-4 h-4" />
              Start with a Spark
            </Button>
          </Link>
          <Link href="/templates">
            <Button variant="ghost" size="lg" className="gap-2.5 w-full sm:w-auto">
              <BookOpen className="w-4 h-4" />
              Browse Templates
            </Button>
          </Link>
        </motion.div>

        {/* Stats — chapter ornament style */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.4 }}
          className="flex items-center justify-center gap-10 md:gap-16"
        >
          {[
            { value: '20', label: 'Templates' },
            { value: '3', label: 'Formats' },
            { value: '∞', label: 'Rabbit Holes' },
          ].map(({ value, label }, i) => (
            <>
              {i > 0 && <div key={`divider-${i}`} className="h-6 w-px bg-[var(--border-hairline)]" />}
              <div key={label} className="text-center">
                <div className="font-serif text-2xl text-accent-rust mb-0.5">{value}</div>
                <div className="font-mono text-[0.6875rem] text-ink-muted tracking-wide">{label}</div>
              </div>
            </>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
