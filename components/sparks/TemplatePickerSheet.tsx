'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shuffle, Check, ChevronDown } from 'lucide-react';
import { SPARKS } from '@/lib/sparks';
import { cn } from '@/lib/utils';

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  '09': 'Reveals the disturbing physical reality hiding inside ordinary things. Your body is stranger than you think, and "normal" is a comfortable lie.',
  '05': 'Traces how tiny, random moments cascade into history. The world\'s biggest events all started somewhere absurdly small.',
  '20': 'AI turns the spotlight back on you. Questions about machines that are really questions about what it means to have a mind.',
  '04': 'Autopsies the famous "facts" that were never true. Where do myths come from, and why do smart people keep believing them?',
  '11': 'Real government operations stranger than any fiction. These actually happened. Most people still don\'t know.',
  '01': 'Start with one innocent question, end somewhere completely unexpected. The rabbit hole guarantee — every single time.',
  '14': 'Mathematics and logic that your intuition gets completely wrong. Provably. These will bother you for days.',
  '15': 'Creatures that make humans look unimpressive. Nature\'s most extreme, bizarre, and terrifying designs.',
};

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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Derive templates inside the component to avoid module-level initialization order issues
  const TEMPLATES = useMemo(
    () =>
      Array.from(
        new Map(
          SPARKS.map((s) => [
            s.templateId,
            {
              id: s.templateId,
              name: s.templateLabel.split(' · ')[0],
              accentColor: s.accentColor,
            },
          ])
        ).values()
      ).map((t) => ({
        ...t,
        description: TEMPLATE_DESCRIPTIONS[t.id] ?? '',
      })),
    []
  );

  const handleRowTap = (id: string) => {
    // First tap on collapsed = expand to show description
    // Second tap (or tap on already-expanded) = select/deselect
    if (expandedId !== id) {
      setExpandedId(id);
    } else {
      onToggle(id);
    }
  };

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
            className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="tpicker-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[71] bg-[#0e0e0e] border-t border-white/10 rounded-t-3xl overflow-hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)', maxHeight: '88vh' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-2 pb-3 flex-shrink-0">
              <div>
                <h2 className="font-serif italic text-white text-base leading-snug">
                  Filter by template
                </h2>
                <p className="text-white/40 text-[0.65rem] font-mono mt-0.5">
                  {allSelected ? 'Showing all · randomised' : `${selectedIds.length} selected · tap again to toggle`}
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

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(88vh - 100px)' }}>
              {/* All / randomised row */}
              <div className="px-4 pb-2">
                <button
                  onClick={() => { onClearAll(); setExpandedId(null); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all',
                    allSelected
                      ? 'bg-gold/15 border-gold/40 text-gold'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                  )}
                >
                  <Shuffle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium flex-1 text-left">All templates · randomised</span>
                  {allSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                </button>
              </div>

              <div className="mx-5 border-t border-white/8 mb-2" />

              {/* Template list — full width with expandable descriptions */}
              <div className="px-4 pb-6 space-y-1.5">
                {TEMPLATES.map((t) => {
                  const isActive = selectedIds.includes(t.id);
                  const isExpanded = expandedId === t.id;

                  return (
                    <div
                      key={t.id}
                      className="rounded-xl overflow-hidden border transition-all"
                      style={
                        isActive
                          ? { borderColor: `${t.accentColor}55`, background: `${t.accentColor}12` }
                          : { borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }
                      }
                    >
                      {/* Row header — tap to expand/select */}
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-left"
                        onClick={() => handleRowTap(t.id)}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors"
                          style={{ background: isActive ? t.accentColor : 'rgba(255,255,255,0.25)' }}
                        />
                        <span
                          className="text-[0.82rem] font-semibold flex-1 transition-colors"
                          style={{ color: isActive ? t.accentColor : 'rgba(255,255,255,0.75)' }}
                        >
                          {t.name}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isActive && (
                            <Check className="w-3.5 h-3.5" style={{ color: t.accentColor }} />
                          )}
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.18 }}
                          >
                            <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                          </motion.div>
                        </div>
                      </button>

                      {/* Expandable description */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            key="desc"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-3 pt-0 border-t border-white/6">
                              <p className="text-[0.73rem] text-white/50 font-sans leading-relaxed pt-2.5 mb-3">
                                {t.description}
                              </p>
                              <button
                                onClick={() => { onToggle(t.id); }}
                                className="text-[0.65rem] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all"
                                style={
                                  isActive
                                    ? { color: t.accentColor, borderColor: `${t.accentColor}40`, background: `${t.accentColor}15` }
                                    : { color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.15)', background: 'transparent' }
                                }
                              >
                                {isActive ? '✓ Selected — tap to remove' : 'Add to filter'}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
