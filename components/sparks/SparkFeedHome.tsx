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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sparks = useMemo(() => shuffle(SPARKS), [seed]);
  const handleReshuffle = useCallback(() => setSeed((s) => s + 1), []);

  return (
    <SparkFeed sparks={sparks} infinite onReshuffle={handleReshuffle} />
  );
}
