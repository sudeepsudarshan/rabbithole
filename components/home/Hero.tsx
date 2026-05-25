'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { Sparkles, BookOpen, Rabbit } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
  const shouldReduce = useReducedMotion();

  const fadeUp = shouldReduce
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <section className="relative min-h-[90svh] flex items-center justify-center overflow-hidden px-6 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="h-px w-12 bg-gold/30" />
          <span className="font-mono text-[0.72rem] text-gold uppercase tracking-widest">
            AI Podcast Platform
          </span>
          <div className="h-px w-12 bg-gold/30" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          className="font-serif italic leading-none mb-6"
          style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
        >
          <span className="text-paper">Down the</span>
          <br />
          <span className="text-gold-gradient">Rabbit Hole</span>
          <br />
          <span className="text-paper font-normal">with AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
          className="font-sans text-lg text-paper-muted max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Start with any question. Go somewhere you never expected.
          A curiosity-driven podcast where every conversation digs deeper.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href="/sparks">
            <Button variant="primary" size="lg" className="gap-2.5 w-full sm:w-auto">
              <Sparkles className="w-4 h-4" />
              Start with a Spark
            </Button>
          </Link>
          <Link href="/templates">
            <Button variant="ghost" size="lg" className="gap-2.5 w-full sm:w-auto">
              Browse Templates
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 }}
          className="flex items-center justify-center gap-8 md:gap-12"
        >
          {[
            { value: '20', label: 'Templates' },
            { value: '3', label: 'Formats' },
            { value: '∞', label: 'Rabbit Holes' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-serif text-2xl text-gold mb-0.5">{value}</div>
              <div className="font-mono text-[0.65rem] text-paper-faint uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
