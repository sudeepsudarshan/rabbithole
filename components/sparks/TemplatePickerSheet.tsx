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
            className="fixed inset-0 z-[70] backdrop-blur-sm"
            style={{ background: 'var(--bg-overlay)' }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="tpicker-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[71] rounded-t-3xl overflow-hidden"
            style={{
              background: 'var(--bg-elevated)',
              borderTop: '1px solid var(--border-hairline)',
              paddingBottom: 'env(safe-area-inset-bottom)',
              maxHeight: '88vh',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--ink-faint)' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-2 pb-3 flex-shrink-0">
              <div>
                <h2 className="font-serif italic text-base leading-snug" style={{ color: 'var(--ink-primary)' }}>
                  Filter by template
                </h2>
                <p className="text-[0.65rem] font-mono mt-0.5" style={{ color: 'var(--ink-muted)' }}>
                  {allSelected ? 'Showing all · randomised' : `${selectedIds.length} selected · tap again to toggle`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 transition-colors"
                style={{ color: 'var(--ink-muted)' }}
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
                      : ''
                  )}
                  style={!allSelected ? {
                    background: 'var(--state-hover)',
                    borderColor: 'var(--border-hairline)',
                    color: 'var(--ink-secondary)',
                  } : undefined}
                >
                  <Shuffle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium flex-1 text-left">All templates · randomised</span>
                  {allSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                </button>
              </div>

              <div className="mx-5 mb-2" style={{ borderTop: '1px solid var(--border-hairline)' }} />

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
                          : { borderColor: 'var(--border-hairline)', background: 'var(--state-hover)' }
                      }
                    >
                      {/* Row header — tap to expand/select */}
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-left"
                        onClick={() => handleRowTap(t.id)}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors"
                          style={{ background: isActive ? t.accentColor : 'var(--ink-faint)' }}
                        />
                        <span
                          className="text-[0.82rem] font-semibold flex-1 transition-colors"
                          style={{ color: isActive ? t.accentColor : 'var(--ink-primary)' }}
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
                            <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--ink-faint)' }} />
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
                            <div className="px-4 pb-3 pt-0"
                              style={{ borderTop: '1px solid var(--border-hairline)' }}>
                              <p className="text-[0.73rem] font-sans leading-relaxed pt-2.5 mb-3"
                                style={{ color: 'var(--ink-muted)' }}>
                                {t.description}
                              </p>
                              <button
                                onClick={() => { onToggle(t.id); }}
                                className="text-[0.65rem] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all"
                                style={
                                  isActive
                                    ? { color: t.accentColor, borderColor: `${t.accentColor}40`, background: `${t.accentColor}15` }
                                    : { color: 'var(--ink-secondary)', borderColor: 'var(--border-hairline)', background: 'transparent' }
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
