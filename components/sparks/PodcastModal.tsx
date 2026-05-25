'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Play, SkipForward, Loader2, RotateCcw } from 'lucide-react';
import { SparkCard } from '@/types/spark';
import { cn } from '@/lib/utils';

interface PodcastTurn {
  host: 'Ray' | 'Sage';
  text: string;
}

interface PodcastModalProps {
  spark: SparkCard;
  open: boolean;
  onClose: () => void;
}

const HOST_CONFIG = {
  Ray: {
    label: 'Ray',
    role: 'The Curious One',
    color: '#C9A84C',
    bg: 'bg-gold-faint',
    border: 'border-gold/30',
    emoji: '🎙',
  },
  Sage: {
    label: 'Sage',
    role: 'The Deep Diver',
    color: '',
    bg: 'bg-ink-100',
    border: 'border-border',
    emoji: '🧠',
  },
};

export default function PodcastModal({ spark, open, onClose }: PodcastModalProps) {
  const [turns, setTurns] = useState<PodcastTurn[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  const sageBorder = { borderColor: `${spark.accentColor}40` };
  const sageBg = { background: `${spark.accentColor}12` };

  const fetchPodcast = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTurns([]);
    setVisibleCount(0);
    setAutoPlay(false);

    try {
      const res = await fetch('/api/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: spark.title,
          question: spark.question,
          answer: spark.answer,
          templateLabel: spark.templateLabel,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate podcast');
      const data = await res.json();
      setTurns(data.turns || []);
      setVisibleCount(1);
      setAutoPlay(true);
    } catch {
      setError('Couldn\'t generate the podcast. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [spark]);

  useEffect(() => {
    if (open && turns.length === 0 && !loading && !error) {
      fetchPodcast();
    }
  }, [open, turns.length, loading, error, fetchPodcast]);

  // Auto-advance turns
  useEffect(() => {
    if (!autoPlay || visibleCount >= turns.length) {
      if (visibleCount >= turns.length && turns.length > 0) setAutoPlay(false);
      return;
    }
    const timer = setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 1, turns.length));
    }, 7000);
    return () => clearTimeout(timer);
  }, [autoPlay, visibleCount, turns.length]);

  const handleNext = () => {
    if (visibleCount < turns.length) {
      setVisibleCount((prev) => prev + 1);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="podcast-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="podcast-modal"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-[61] max-h-[90vh] flex flex-col bg-ink-50 border-t border-border rounded-t-3xl overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-start gap-3 px-5 pt-2 pb-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-gold-faint border border-gold/30 flex items-center justify-center flex-shrink-0">
                <Mic className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[0.6rem] uppercase tracking-wider text-paper-faint mb-0.5">
                  {spark.templateLabel}
                </p>
                <h2 className="font-serif italic text-sm text-paper leading-snug line-clamp-2">
                  {spark.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-paper-faint hover:text-paper transition-colors"
                aria-label="Close podcast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hosts bar */}
            <div className="flex gap-3 px-5 py-3 border-b border-border">
              {(['Ray', 'Sage'] as const).map((host) => (
                <div key={host} className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm border"
                    style={
                      host === 'Sage'
                        ? { ...sageBg, ...sageBorder }
                        : undefined
                    }
                  >
                    {HOST_CONFIG[host].emoji}
                  </div>
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-wider text-gold leading-none">
                      {HOST_CONFIG[host].label}
                    </p>
                    <p className="text-[0.6rem] text-paper-faint leading-none">
                      {HOST_CONFIG[host].role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {loading && (
                <div className="flex flex-col items-center gap-3 py-12">
                  <Loader2 className="w-6 h-6 text-gold animate-spin" />
                  <p className="text-sm text-paper-faint font-serif italic">
                    Generating your podcast episode…
                  </p>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center gap-3 py-12">
                  <p className="text-sm text-paper-muted text-center">{error}</p>
                  <button
                    onClick={fetchPodcast}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-faint border border-gold/30 text-gold text-sm font-medium hover:bg-gold/20 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Try again
                  </button>
                </div>
              )}

              {/* Turns */}
              <AnimatePresence>
                {turns.slice(0, visibleCount).map((turn, i) => {
                  const isRay = turn.host === 'Ray';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className={cn('flex gap-3', isRay ? 'flex-row' : 'flex-row-reverse')}
                    >
                      {/* Avatar */}
                      <div
                        className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-sm border flex-shrink-0 mt-1'
                        )}
                        style={!isRay ? { ...sageBg, ...sageBorder } : undefined}
                      >
                        {HOST_CONFIG[turn.host].emoji}
                      </div>

                      {/* Bubble */}
                      <div
                        className={cn(
                          'flex-1 rounded-2xl px-4 py-3 border max-w-[85%]',
                          isRay
                            ? 'rounded-tl-sm bg-gold-faint border-gold/20'
                            : 'rounded-tr-sm'
                        )}
                        style={!isRay ? { ...sageBg, ...sageBorder } : undefined}
                      >
                        <p
                          className={cn(
                            'text-[0.6rem] uppercase tracking-wider font-mono mb-1',
                            isRay ? 'text-gold' : 'text-paper-faint'
                          )}
                          style={!isRay ? { color: spark.accentColor } : undefined}
                        >
                          {turn.host}
                        </p>
                        <p className="text-sm font-serif italic text-paper leading-relaxed">
                          {turn.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Controls */}
            {turns.length > 0 && (
              <div className="px-5 py-4 border-t border-border flex items-center gap-3">
                <div className="flex-1 h-1 bg-ink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-500"
                    style={{ width: `${(visibleCount / turns.length) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-[0.6rem] text-paper-faint">
                  {visibleCount}/{turns.length}
                </span>
                {visibleCount < turns.length ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold text-ink text-xs font-medium hover:bg-gold-bright transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Next
                  </button>
                ) : (
                  <button
                    onClick={fetchPodcast}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold/30 text-gold text-xs font-medium hover:bg-gold-faint transition-all"
                  >
                    <SkipForward className="w-3 h-3" />
                    New episode
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
