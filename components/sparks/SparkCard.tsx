'use client';

import Image from 'next/image';
import { Mic, MessageCircle, BookOpen, ChevronUp, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { SparkCard as SparkCardType } from '@/types/spark';
import { cn } from '@/lib/utils';
import { type PanelTab } from './SparkPanel';
import { getPersonaForTemplate } from '@/lib/personas';

interface SparkCardProps {
  spark: SparkCardType;
  isActive?: boolean;
  onOpenTemplatePicker?: () => void;
  selectedTemplateIds?: string[];
  onOpenPanel?: (sparkId: string, tab: PanelTab) => void;
}

const ACTIONS: { icon: React.ElementType; label: string; tab: PanelTab }[] = [
  { icon: BookOpen, label: 'Deeper', tab: 'deeper' },
  { icon: MessageCircle, label: 'Ask', tab: 'ask' },
  { icon: Mic, label: 'Podcast', tab: 'podcast' },
];

export default function SparkCard({
  spark,
  isActive = false,
  onOpenTemplatePicker,
  selectedTemplateIds = [],
  onOpenPanel,
}: SparkCardProps) {
  const templateName = spark.templateLabel.split(' · ')[0];
  const isFiltered = selectedTemplateIds.length > 0;
  const persona = getPersonaForTemplate(spark.templateId);

  return (
    <article
      className={cn(
        'relative w-full h-full flex flex-col overflow-hidden',
        !isActive && 'pointer-events-none'
      )}
      style={{ background: 'var(--bg-elevated)' }}
      aria-hidden={!isActive}
    >
      {/* ── Image section — fills remaining space above content ───── */}
      <div className="relative flex-1 min-h-0">
        <Image
          src={spark.heroImage}
          alt=""
          fill
          className="object-cover saturate-[0.88] contrast-[0.96]"
          priority={isActive}
          sizes="100vw"
        />

        {/* Warm paper tint overlay */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-[0.07] pointer-events-none"
          style={{ background: 'var(--bg-page)' }}
        />

        {/* Gradient at image bottom */}
        <div
          className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--bg-elevated), transparent)' }}
        />

        {/* Swipe hint — top-center overlay */}
        <div className="absolute top-2 inset-x-0 flex flex-col items-center gap-0.5 pointer-events-none">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ChevronUp className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.5)' }} />
          </motion.div>
          <span
            className="font-mono uppercase"
            style={{ fontSize: '0.46rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)' }}
          >
            swipe up
          </span>
        </div>
      </div>

      {/* ── Content section ───────────────────────────────────────── */}
      <div className="flex-shrink-0 flex flex-col px-5 pt-3 pb-1.5 overflow-hidden">
        {/* Template badge + host row */}
        <div className="flex items-center gap-2 flex-wrap mb-2.5">
          <button
            onClick={onOpenTemplatePicker}
            className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[0.6rem] font-mono uppercase tracking-wider border transition-all active:scale-95"
            style={{
              color: spark.accentColor,
              borderColor: `${spark.accentColor}55`,
              background: `${spark.accentColor}18`,
            }}
            aria-label="Open template filter"
          >
            {isFiltered ? (
              <ChevronDown className="w-2.5 h-2.5 flex-shrink-0" />
            ) : (
              <SlidersHorizontal className="w-2.5 h-2.5 flex-shrink-0" />
            )}
            {templateName}
            {isFiltered && (
              <span
                className="ml-0.5 px-1 rounded text-[0.48rem] font-bold"
                style={{ background: `${spark.accentColor}35` }}
              >
                {selectedTemplateIds.length}
              </span>
            )}
          </button>

          {persona && (
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-[0.48rem] font-bold flex-shrink-0"
                style={{ background: `${spark.accentColor}25`, color: spark.accentColor }}
              >
                {persona.name.charAt(0)}
              </div>
              <span
                className="text-[0.58rem] font-mono uppercase tracking-wider"
                style={{ color: 'var(--ink-muted)' }}
              >
                {persona.name}
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2
          className="font-serif italic leading-[1.22] mb-2 flex-shrink-0"
          style={{ fontSize: '1.22rem', color: 'var(--ink-primary)' }}
        >
          {spark.title}
        </h2>

        {/* Answer */}
        <p
          className="font-serif italic leading-relaxed line-clamp-3 flex-shrink-0"
          style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)' }}
        >
          {spark.answer}
        </p>

        {/* Hook line */}
        <p
          className="mt-2 leading-snug line-clamp-2 flex-shrink-0"
          style={{ fontSize: '0.76rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}
        >
          {spark.hookLine}
        </p>
      </div>

      {/* ── Bottom pill-button row ─────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex items-center justify-center gap-2 px-4"
        style={{
          background: 'var(--bg-elevated)',
          height: '56px',
        }}
      >
        {ACTIONS.map(({ icon: Icon, label, tab }) => (
          <button
            key={tab}
            onClick={() => onOpenPanel?.(spark.id, tab)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full transition-all active:scale-95"
            style={{
              border: '1px solid var(--border-hairline)',
              background: 'var(--bg-elevated)',
            }}
            aria-label={label}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--ink-muted)' }} />
            <span className="font-sans text-[0.7rem] font-medium" style={{ color: 'var(--ink-secondary)' }}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </article>
  );
}
