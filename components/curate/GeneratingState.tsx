'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const STATUS_LINES = [
  'Gathering your topics…',
  'Tuning the emotional register…',
  'Filtering the noise…',
  'Assembling your rabbit hole…',
];

export default function GeneratingState() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % STATUS_LINES.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-6"
      style={{ background: 'var(--bg-page)' }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        className="font-serif text-4xl select-none"
        style={{ color: 'var(--accent-rust)' }}
        aria-hidden
      >
        ✦
      </motion.div>

      <p
        key={idx}
        className="font-serif italic text-base"
        style={{ color: 'var(--ink-secondary)' }}
      >
        {STATUS_LINES[idx]}
      </p>
    </div>
  );
}
