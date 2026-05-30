'use client';

import { useMemo, useState, useCallback } from 'react';
import { SPARKS } from '@/lib/sparks';
import SparkFeed from './SparkFeed';
import TemplatePickerSheet from './TemplatePickerSheet';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface SparkFeedHomeProps {
  overrideSparks?: import('@/types/spark').SparkCard[];
}

export default function SparkFeedHome({ overrideSparks }: SparkFeedHomeProps = {}) {
  const [seed, setSeed] = useState(0);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const sparks = useMemo(() => {
    const base = overrideSparks ?? SPARKS;
    const pool = selectedTemplateIds.length
      ? base.filter((s) => selectedTemplateIds.includes(s.templateId))
      : base;
    return shuffle(pool.length ? pool : base);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, selectedTemplateIds, overrideSparks]);

  const handleReshuffle = useCallback(() => setSeed((s) => s + 1), []);

  const handleToggleTemplate = useCallback((id: string) => {
    setSelectedTemplateIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setSeed((s) => s + 1);
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedTemplateIds([]);
    setSeed((s) => s + 1);
  }, []);

  return (
    <>
      <SparkFeed
        sparks={sparks}
        infinite
        onReshuffle={handleReshuffle}
        onOpenTemplatePicker={() => setPickerOpen(true)}
        selectedTemplateIds={selectedTemplateIds}
      />
      <TemplatePickerSheet
        open={pickerOpen}
        selectedIds={selectedTemplateIds}
        onToggle={handleToggleTemplate}
        onClearAll={handleClearAll}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
}
