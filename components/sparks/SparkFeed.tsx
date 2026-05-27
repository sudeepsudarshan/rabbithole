'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { SparkCard as SparkCardType } from '@/types/spark';
import { useSwipe } from '@/hooks/useSwipe';
import SparkCard from './SparkCard';
import RabbitHoleAnimation from './RabbitHoleAnimation';
import { type PanelTab } from './SparkPanel';

interface SparkFeedProps {
  sparks: SparkCardType[];
  infinite?: boolean;
  onReshuffle?: () => void;
  onOpenTemplatePicker?: () => void;
  selectedTemplateIds?: string[];
  onOpenPanel?: (sparkId: string, tab: PanelTab) => void;
}

export default function SparkFeed({
  sparks,
  infinite = false,
  onReshuffle,
  onOpenTemplatePicker,
  selectedTemplateIds = [],
  onOpenPanel,
}: SparkFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [animating, setAnimating] = useState(false);
  const [pendingNext, setPendingNext] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const wheelLock = useRef(false);

  // Reset index when sparks array changes (filter/reshuffle)
  const prevLengthRef = useRef(sparks.length);
  useEffect(() => {
    if (sparks.length !== prevLengthRef.current) {
      setCurrentIndex(0);
      prevLengthRef.current = sparks.length;
    }
  }, [sparks]);

  // ── Navigation ────────────────────────────────────────────────────
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

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
        enter: (d: string) => ({ y: d === 'up' ? '100%' : '-100%' }),
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
  if (!spark) return null;

  return (
    <>
      <div
        className="relative h-[100svh] w-full overflow-hidden bg-black touch-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={handleWheel}
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={`${currentIndex}-${spark.id}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <SparkCard
              spark={spark}
              isActive
              onOpenTemplatePicker={onOpenTemplatePicker}
              selectedTemplateIds={selectedTemplateIds}
              onOpenPanel={onOpenPanel}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <RabbitHoleAnimation active={animating} onComplete={handleAnimationComplete} />
    </>
  );
}
