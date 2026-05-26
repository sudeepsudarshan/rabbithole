'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Shuffle, Check } from 'lucide-react';
import { SPARKS } from '@/lib/sparks';
import { cn } from '@/lib/utils';

// Derive unique templates from SPARKS
const TEMPLATES = Array.from(
  new Map(
    SPARKS.map((s) => [
      s.templateId,
      {
        id: s.templateId,
        // "Body Horror · Template 09" → "Body Horror"
        name: s.templateLabel.split(' · ')[0],
        accentColor: s.accentColor,
      },
    ])
  ).values()
);

interface TemplatePickerSheetProps {
  open: boolean;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export default function TemplatePickerSheet({
  open,
  selectedIds,
  onToggle,
  onClearAll,
  onClose,
}: TemplatePickerSheetProps) {
  const allSelected = selectedIds.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="tpicker-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="tpicker-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[71] bg-[#111] border-t border-white/10 rounded-t-3xl overflow-hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-2 pb-4">
              <div>
                <h2 className="font-serif italic text-white text-base leading-snug">
                  Filter by template
                </h2>
                <p className="text-white/40 text-[0.65rem] font-mono mt-0.5">
                  {allSelected
                    ? 'Showing all · randomised'
                    : `${selectedIds.length} selected`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/40 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* All / randomised row */}
            <div className="px-4 pb-3">
              <button
                onClick={onClearAll}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all',
                  allSelected
                    ? 'bg-gold/15 border-gold/40 text-gold'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/8'
                )}
              >
                <Shuffle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium flex-1 text-left">
                  All templates · randomised
                </span>
                {allSelected && <Check className="w-4 h-4 flex-shrink-0" />}
              </button>
            </div>

            {/* Divider */}
            <div className="mx-5 border-t border-white/8 mb-3" />

            {/* Template grid */}
            <div className="px-4 pb-6 grid grid-cols-2 gap-2">
              {TEMPLATES.map((t) => {
                const active = selectedIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => onToggle(t.id)}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-3 rounded-xl border text-left transition-all active:scale-95',
                      active
                        ? 'border-opacity-60'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/8'
                    )}
                    style={
                      active
                        ? {
                            background: `${t.accentColor}18`,
                            borderColor: `${t.accentColor}60`,
                            color: t.accentColor,
                          }
                        : undefined
                    }
                  >
                    {/* Colour dot */}
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: active ? t.accentColor : 'rgba(255,255,255,0.25)' }}
                    />
                    <span className="text-[0.75rem] font-medium leading-tight flex-1">
                      {t.name}
                    </span>
                    {active && (
                      <Check
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: t.accentColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
