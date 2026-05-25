'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SparkCard as SparkCardType } from '@/types/spark';
import { useSwipe } from '@/hooks/useSwipe';
import SparkCard from './SparkCard';
import SparkDots from './SparkDots';
import RabbitHoleAnimation from './RabbitHoleAnimation';

interface SparkFeedProps {
  sparks: SparkCardType[];
  className?: string;
  infinite?: boolean;
  onReshuffle?: () => void;
}

export default function SparkFeed({ sparks, className, infinite = false, onReshuffle }: SparkFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [animating, setAnimating] = useState(false);
  const [pendingNext, setPendingNext] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Called when rabbit hole animation finishes
  const handleAnimationComplete = useCallback(() => {
    setAnimating(false);
    if (pendingNext) {
      setPendingNext(false);
      if (infinite && currentIndex >= sparks.length - 1) {
        onReshuffle?.();
        setCurrentIndex(0);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, sparks.length - 1));
      }
    }
  }, [pendingNext, infinite, currentIndex, sparks.length, onReshuffle]);

  const goNext = useCallback(() => {
    if (animating) return;
    if (!infinite && currentIndex >= sparks.length - 1) return;

    setDirection('up');

    if (shouldReduceMotion) {
      if (infinite && currentIndex >= sparks.length - 1) {
        onReshuffle?.();
        setCurrentIndex(0);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, sparks.length - 1));
      }
      return;
    }

    // Trigger rabbit hole animation, then advance
    setAnimating(true);
    setPendingNext(true);
  }, [animating, currentIndex, sparks.length, infinite, shouldReduceMotion, onReshuffle]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection('down');
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const { onTouchStart, onTouchEnd } = useSwipe(goNext, goPrev);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  const variants = shouldReduceMotion
    ? { enter: {}, center: {}, exit: {} }
    : {
        enter: (d: string) => ({
          y: d === 'up' ? '100%' : '-100%',
          opacity: 0,
        }),
        center: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 30,
          },
        },
        exit: (d: string) => ({
          y: d === 'up' ? '-100%' : '100%',
          opacity: 0,
          transition: { duration: 0.2 },
        }),
      };

  const atEnd = !infinite && currentIndex >= sparks.length - 1;

  return (
    <>
      <div
        className={className}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Card area */}
        <div className="relative overflow-hidden flex-1 rounded-2xl border border-border bg-ink-50">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <SparkCard spark={sparks[currentIndex]} isActive />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between px-1">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="p-2 text-paper-faint hover:text-paper disabled:opacity-30 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Previous spark"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <SparkDots
            count={sparks.length}
            current={currentIndex}
            onSelect={(i) => {
              setDirection(i > currentIndex ? 'up' : 'down');
              setCurrentIndex(i);
            }}
          />

          <button
            onClick={goNext}
            disabled={atEnd && !infinite}
            className="p-2 text-paper-faint hover:text-paper disabled:opacity-30 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Next spark"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Template name display */}
        <div className="mt-2 text-center">
          <span className="font-mono text-[0.65rem] text-paper-faint">
            {sparks[currentIndex].templateLabel}
          </span>
        </div>
      </div>

      {/* Rabbit hole transition animation */}
      <RabbitHoleAnimation active={animating} onComplete={handleAnimationComplete} />
    </>
  );
}
