'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { SparkCard as SparkCardType } from '@/types/spark';
import { cn } from '@/lib/utils';
import { useSwipe } from '@/hooks/useSwipe';
import SparkCard from './SparkCard';
import RabbitHoleAnimation from './RabbitHoleAnimation';

interface SparkFeedProps {
  sparks: SparkCardType[];
  infinite?: boolean;
  onReshuffle?: () => void;
}

export default function SparkFeed({ sparks, infinite = false, onReshuffle }: SparkFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [animating, setAnimating] = useState(false);
  const [pendingNext, setPendingNext] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const wheelLock = useRef(false);

  // ── Navigation helpers ────────────────────────────────────────────
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
    setAnimating(true);
    setPendingNext(true);
  }, [animating, currentIndex, sparks.length, infinite, shouldReduceMotion, onReshuffle]);

  const goPrev = useCallback(() => {
    if (animating) return;
    if (currentIndex > 0) {
      setDirection('down');
      setCurrentIndex((prev) => prev - 1);
    }
  }, [animating, currentIndex]);

  // ── Input handlers ────────────────────────────────────────────────
  const { onTouchStart, onTouchEnd } = useSwipe(goNext, goPrev);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  // Wheel (desktop)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (wheelLock.current || Math.abs(e.deltaY) < 30) return;
      wheelLock.current = true;
      setTimeout(() => { wheelLock.current = false; }, 850);
      if (e.deltaY > 0) goNext();
      else goPrev();
    },
    [goNext, goPrev]
  );

  // ── Animation variants ────────────────────────────────────────────
  const variants: Variants | undefined = shouldReduceMotion
    ? undefined
    : {
        enter: (d: string) => ({
          y: d === 'up' ? '100%' : '-100%',
        }),
        center: {
          y: 0,
          transition: { type: 'spring' as const, stiffness: 380, damping: 36 },
        },
        exit: (d: string) => ({
          y: d === 'up' ? '-5%' : '5%',
          opacity: 0,
          scale: 0.97,
          transition: { duration: 0.18, ease: 'easeIn' as const },
        }),
      };

  const spark = sparks[currentIndex];

  return (
    <>
      <div
        className="relative h-[100svh] w-full overflow-hidden bg-black touch-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={handleWheel}
      >
        {/* ── Stories-style progress bars ──────────────────────────── */}
        <div
          className="absolute inset-x-0 z-20 flex gap-1.5 px-4"
          style={{ top: 'max(12px, env(safe-area-inset-top))' }}
        >
          {sparks.map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full overflow-hidden"
              style={{ height: '2.5px', background: 'rgba(255,255,255,0.18)' }}
            >
              <div
                className={cn(
                  'h-full rounded-full',
                  i < currentIndex ? 'w-full' : i === currentIndex ? 'w-full' : 'w-0'
                )}
                style={{
                  background:
                    i < currentIndex
                      ? 'rgba(255,255,255,0.65)'
                      : i === currentIndex
                      ? spark.accentColor
                      : 'transparent',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Spark cards ───────────────────────────────────────────── */}
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
            <SparkCard spark={spark} isActive />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rabbit-hole transition overlay */}
      <RabbitHoleAnimation active={animating} onComplete={handleAnimationComplete} />
    </>
  );
}
