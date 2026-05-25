'use client';

import { useMemo, useState, useCallback } from 'react';
import { SPARKS } from '@/lib/sparks';
import SparkFeed from './SparkFeed';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SparkFeedHome() {
  const [seed, setSeed] = useState(0);

  const sparks = useMemo(() => shuffle(SPARKS), [seed]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReshuffle = useCallback(() => {
    setSeed((s) => s + 1);
  }, []);

  return (
    <div className="h-[100svh] w-full flex flex-col p-3 pt-3">
      {/* Subtle header hint */}
      <div className="flex items-center justify-between px-2 pb-2">
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-paper-faint/60">
          Sparks · swipe up to explore
        </p>
        <p className="font-mono text-[0.6rem] text-paper-faint/40">
          {SPARKS.length} topics
        </p>
      </div>

      <SparkFeed
        sparks={sparks}
        className="flex-1 flex flex-col"
        infinite
        onReshuffle={handleReshuffle}
      />
    </div>
  );
}
