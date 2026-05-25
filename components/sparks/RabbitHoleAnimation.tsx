'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface RabbitHoleAnimationProps {
  active: boolean;
  onComplete: () => void;
}

// SVG rabbit silhouette
function RabbitSVG() {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-20 drop-shadow-2xl"
    >
      {/* Left ear */}
      <ellipse cx="25" cy="22" rx="9" ry="22" fill="#C9A84C" transform="rotate(-10 25 22)" />
      <ellipse cx="25" cy="22" rx="5" ry="17" fill="#DFC068" transform="rotate(-10 25 22)" />
      {/* Right ear */}
      <ellipse cx="55" cy="20" rx="9" ry="22" fill="#C9A84C" transform="rotate(10 55 20)" />
      <ellipse cx="55" cy="20" rx="5" ry="17" fill="#DFC068" transform="rotate(10 55 20)" />
      {/* Head */}
      <ellipse cx="40" cy="45" rx="22" ry="20" fill="#C9A84C" />
      {/* Eyes */}
      <circle cx="33" cy="42" r="3.5" fill="#0F0E0C" />
      <circle cx="47" cy="42" r="3.5" fill="#0F0E0C" />
      <circle cx="34" cy="41" r="1.2" fill="white" />
      <circle cx="48" cy="41" r="1.2" fill="white" />
      {/* Nose */}
      <ellipse cx="40" cy="50" rx="3" ry="2" fill="#E24B4A" />
      {/* Body */}
      <ellipse cx="40" cy="72" rx="20" ry="18" fill="#C9A84C" />
      {/* Front paws */}
      <ellipse cx="24" cy="80" rx="7" ry="5" fill="#C9A84C" />
      <ellipse cx="56" cy="80" rx="7" ry="5" fill="#C9A84C" />
      {/* Tail */}
      <circle cx="60" cy="68" r="6" fill="#F5F0E8" />
    </svg>
  );
}

export default function RabbitHoleAnimation({ active, onComplete }: RabbitHoleAnimationProps) {
  const shouldReduceMotion = useReducedMotion();
  const calledRef = useRef(false);

  useEffect(() => {
    if (!active) {
      calledRef.current = false;
      return;
    }

    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    // Call onComplete after animation duration
    const timer = setTimeout(() => {
      if (!calledRef.current) {
        calledRef.current = true;
        onComplete();
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [active, shouldReduceMotion, onComplete]);

  if (shouldReduceMotion) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="rabbit-hole-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-end overflow-hidden pointer-events-none"
          style={{ background: 'rgba(15, 14, 12, 0.92)' }}
        >
          {/* Concentric pulse rings from the hole */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute bottom-[15%] w-20 h-10 rounded-full border border-gold/30"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 2, 3.5], opacity: [0, 0.5, 0] }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* The hole */}
          <motion.div
            className="absolute bottom-[10%] rounded-full"
            style={{
              background: 'radial-gradient(ellipse, #000 40%, #1A1814 70%, transparent 100%)',
              border: '2px solid rgba(201,168,76,0.4)',
            }}
            initial={{ width: 0, height: 0 }}
            animate={{ width: 120, height: 60 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          />

          {/* Rabbit */}
          <motion.div
            className="absolute bottom-[18%] flex flex-col items-center"
            initial={{ y: 0, scale: 1, opacity: 1, rotate: 0 }}
            animate={{
              y: [0, -20, -8, 40],
              scale: [1, 1.05, 1, 0.15],
              opacity: [1, 1, 1, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 0.85,
              times: [0, 0.2, 0.5, 1],
              ease: ['easeOut', 'easeInOut', 'easeIn'],
            }}
          >
            <RabbitSVG />
          </motion.div>

          {/* "Down the rabbit hole..." text */}
          <motion.p
            className="absolute top-[40%] font-serif italic text-gold text-xl tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
            transition={{ duration: 0.85, times: [0, 0.2, 0.7, 1] }}
          >
            Down the rabbit hole…
          </motion.p>

          {/* Hole expanding to fill screen */}
          <motion.div
            className="absolute bottom-[10%] rounded-full bg-ink"
            initial={{ width: 0, height: 0 }}
            animate={{ width: 4000, height: 4000 }}
            transition={{ duration: 0.35, delay: 0.65, ease: 'easeIn' }}
            style={{ transformOrigin: 'center bottom' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
