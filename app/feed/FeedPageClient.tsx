'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import SparkFeedHome from '@/components/sparks/SparkFeedHome';
import { SPARKS } from '@/lib/sparks';

interface CurationPrefs {
  topics: string[];
  registers: string[];
  lenses: string[];
  timestamp: number;
}

function getCuration(): CurationPrefs | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('dtrh-curation');
    return raw ? (JSON.parse(raw) as CurationPrefs) : null;
  } catch {
    return null;
  }
}

export default function FeedPageClient() {
  const params = useSearchParams();
  const mode = params.get('mode') ?? 'browse';

  // For curated mode, filter sparks by user preferences
  const filteredSparks = useMemo(() => {
    if (mode !== 'curated') return SPARKS;
    const prefs = getCuration();
    if (!prefs) return SPARKS;

    return SPARKS.filter(spark => {
      const topicMatch = prefs.topics.length === 0 || (spark.topicId && prefs.topics.includes(spark.topicId));
      const registerMatch = prefs.registers.length === 0 || (spark.registers ?? []).some(r => prefs.registers.includes(r));
      const lensMatch = prefs.lenses.length === 0 || prefs.lenses.includes(spark.templateId);
      return topicMatch || registerMatch || lensMatch;
    });
  }, [mode]);

  return <SparkFeedHome overrideSparks={filteredSparks.length > 0 ? filteredSparks : SPARKS} />;
}
