'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { SPARKS, getSparkById } from '@/lib/sparks';
import { useUIStore } from '@/store/uiStore';
import SparkFeed from './SparkFeed';
import TemplatePickerSheet from './TemplatePickerSheet';
import SparkPanel, { type PanelTab, type PanelState, defaultPanelState } from './SparkPanel';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MAX_CACHE = 10;

interface SparkFeedHomeProps {
  overrideSparks?: import('@/types/spark').SparkCard[];
}

export default function SparkFeedHome({ overrideSparks }: SparkFeedHomeProps = {}) {
  const { setSparkPanelOpen } = useUIStore();
  const [seed, setSeed] = useState(0);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Panel state
  const [panelOpen, setPanelOpen] = useState(false);

  const openPanel = useCallback((open: boolean) => {
    setPanelOpen(open);
    setSparkPanelOpen(open);
  }, [setSparkPanelOpen]);
  const [activePanelSparkId, setActivePanelSparkId] = useState<string | null>(null);
  const [activePanelTab, setActivePanelTab] = useState<PanelTab>('deeper');

  // Session cache — persists state per spark while the page is mounted
  const panelCache = useRef(new Map<string, PanelState>());

  // Re-shuffle when seed or filter changes
  const sparks = useMemo(() => {
    const base = overrideSparks ?? SPARKS;
    const pool = selectedTemplateIds.length
      ? base.filter((s) => selectedTemplateIds.includes(s.templateId))
      : base;
    // Always need at least 1 spark
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

  // Open the unified panel on a specific tab for a specific spark
  const handleOpenPanel = useCallback((sparkId: string, tab: PanelTab) => {
    // Seed initial state in cache if missing
    if (!panelCache.current.has(sparkId)) {
      const fresh = defaultPanelState(tab);
      panelCache.current.set(sparkId, fresh);
      // LRU: drop oldest if over limit
      if (panelCache.current.size > MAX_CACHE) {
        const firstKey = panelCache.current.keys().next().value;
        if (firstKey) panelCache.current.delete(firstKey);
      }
    }
    setActivePanelSparkId(sparkId);
    setActivePanelTab(tab);
    openPanel(true);
  }, [openPanel]);

  const activeSpark = activePanelSparkId ? getSparkById(activePanelSparkId) ?? null : null;

  return (
    <>
      <SparkFeed
        sparks={sparks}
        infinite
        onReshuffle={handleReshuffle}
        onOpenTemplatePicker={() => setPickerOpen(true)}
        selectedTemplateIds={selectedTemplateIds}
        onOpenPanel={handleOpenPanel}
      />
      <TemplatePickerSheet
        open={pickerOpen}
        selectedIds={selectedTemplateIds}
        onToggle={handleToggleTemplate}
        onClearAll={handleClearAll}
        onClose={() => setPickerOpen(false)}
      />
      <SparkPanel
        spark={activeSpark}
        open={panelOpen}
        initialTab={activePanelTab}
        panelCache={panelCache}
        onClose={() => openPanel(false)}
      />
    </>
  );
}
