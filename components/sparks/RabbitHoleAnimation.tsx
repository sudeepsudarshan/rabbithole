'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface RabbitHoleAnimationProps {
  active: boolean;
  onComplete: () => void;
}

function RabbitSVG() {
  return (
    <svg
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-20 h-24 drop-shadow-2xl"
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
    const timer = setTimeout(() => {
      if (!calledRef.current) {
        calledRef.current = true;
        onComplete();
      }
    }, 1350);
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
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[100] overflow-hidden pointer-events-none flex items-center justify-center"
          style={{ background: 'rgba(15, 14, 12, 0.93)' }}
        >
          {/*
           * All children are positioned absolutely relative to the screen centre
           * using left/top 50% + Framer Motion x/y offsets.
           * We NEVER mix Tailwind -translate-x-1/2 with Framer Motion y animations —
           * that overwrites the transform and breaks horizontal centering.
           */}

          {/* "Down the rabbit hole…" text — sits 120px above centre */}
          <motion.p
            className="absolute font-serif italic text-xl tracking-wide whitespace-nowrap"
            style={{
              left: '50%',
              top: '50%',
              color: '#C9A84C',
            }}
            initial={{ opacity: 0, x: '-50%', y: '-340%' }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: '-50%',
              y: ['-340%', '-320%', '-320%', '-360%'],
            }}
            transition={{ duration: 1.275, times: [0, 0.15, 0.7, 1] }}
          >
            Down the rabbit hole…
          </motion.p>

          {/* Concentric pulse rings — centred at hole (80px below centre) */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '50%',
                width: 80,
                height: 40,
                border: '1px solid rgba(201,168,76,0.3)',
              }}
              initial={{ scale: 0.5, opacity: 0, x: '-50%', y: 60 }}
              animate={{
                scale: [0.5, 2, 3.5],
                opacity: [0, 0.5, 0],
                x: '-50%',
                y: 60,
              }}
              transition={{
                duration: 1.2,
                delay: i * 0.225,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* The hole ellipse — 80px below centre */}
          <motion.div
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '50%',
              background: 'radial-gradient(ellipse, #000 40%, #1A1814 70%, transparent 100%)',
              border: '2px solid rgba(201,168,76,0.4)',
            }}
            initial={{ width: 0, height: 0, x: '-50%', y: 60 }}
            animate={{ width: 140, height: 70, x: '-50%', y: 60 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          />

          {/* Rabbit — 160px above centre, dives down into hole */}
          <motion.div
            className="absolute"
            style={{ left: '50%', top: '50%' }}
            initial={{ x: '-50%', y: '-200%', scale: 1, opacity: 1, rotate: 0 }}
            animate={{
              x: '-50%',
              y: ['-200%', '-220%', '-190%', '60px'],
              scale: [1, 1.08, 1, 0.12],
              opacity: [1, 1, 1, 0],
              rotate: [0, -6, 6, 0],
            }}
            transition={{
              duration: 1.275,
              times: [0, 0.2, 0.5, 1],
            }}
          >
            <RabbitSVG />
          </motion.div>

          {/* Hole expanding to fill screen — starts from centre */}
          <motion.div
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '50%',
              background: '#0F0E0C',
            }}
            initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
            animate={{ width: 4000, height: 4000, x: '-50%', y: '-50%' }}
            transition={{ duration: 0.45, delay: 0.975, ease: 'easeIn' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
