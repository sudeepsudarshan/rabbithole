'use client';

import Image from 'next/image';
import Link from 'next/link';
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

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  href,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const content = (
    <div className="flex flex-col items-center gap-[3px]">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center border"
        style={{
          background: 'rgba(0,0,0,0.48)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderColor: 'rgba(255,255,255,0.22)',
        }}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-[0.45rem] text-white/60 font-mono uppercase tracking-widest leading-none">
        {label}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block active:scale-90 transition-transform duration-100">
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="block active:scale-90 transition-transform duration-100"
      aria-label={label}
    >
      {content}
    </button>
  );
}

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
      {/* ── Image section (top ~56%) ──────────────────────────────── */}
      <div className="relative flex-shrink-0" style={{ height: '56%' }}>
        <Image
          src={spark.heroImage}
          alt=""
          fill
          className="object-cover saturate-[0.88] contrast-[0.96]"
          priority={isActive}
          sizes="100vw"
        />

        {/* Warm paper tint overlay — editorial print feel */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-[0.07] pointer-events-none"
          style={{ background: 'var(--bg-page)' }}
        />

        {/* Gradient at image bottom — bleeds into content area */}
        <div
          className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--bg-elevated), transparent)' }}
        />

        {/* Action column — top-right on image */}
        <div className="absolute top-3 right-3 flex flex-col gap-3 items-center z-10">
          <ActionBtn
            icon={Mic}
            label="Podcast"
            onClick={() => onOpenPanel?.(spark.id, 'podcast')}
          />
          <ActionBtn
            icon={MessageCircle}
            label="Ask"
            onClick={() => onOpenPanel?.(spark.id, 'ask')}
          />
          <ActionBtn icon={BookOpen} label="Deeper" onClick={() => onOpenPanel?.(spark.id, 'deeper')} />
        </div>
      </div>

      {/* ── Content section (bottom ~44%) ────────────────────────── */}
      <div className="flex-1 flex flex-col px-5 pt-3 pb-2 overflow-hidden">
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

        {/* Spacer + swipe hint */}
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-0.5 pb-0.5">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ChevronUp className="w-4 h-4" style={{ color: 'var(--ink-faint)' }} />
          </motion.div>
          <span
            className="font-mono uppercase"
            style={{ fontSize: '0.46rem', letterSpacing: '0.18em', color: 'var(--ink-faint)' }}
          >
            swipe up
          </span>
        </div>
      </div>
    </article>
  );
}
