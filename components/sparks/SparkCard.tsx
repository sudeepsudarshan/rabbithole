'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mic, MessageCircle, BookOpen, ChevronUp, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { SparkCard as SparkCardType } from '@/types/spark';
import { cn } from '@/lib/utils';
import PodcastModal from './PodcastModal';
import AskModal from './AskModal';

interface SparkCardProps {
  spark: SparkCardType;
  isActive?: boolean;
  onOpenTemplatePicker?: () => void;
  selectedTemplateIds?: string[];
}

// 25% smaller than original 50px = 38px circle, 17px icon
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
    <div className="flex flex-col items-center gap-[4px]">
      <div
        className="w-[38px] h-[38px] rounded-full flex items-center justify-center border"
        style={{
          background: 'rgba(0,0,0,0.50)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderColor: 'rgba(255,255,255,0.20)',
        }}
      >
        <Icon className="w-[17px] h-[17px] text-white" />
      </div>
      <span className="text-[0.48rem] text-white/55 font-mono uppercase tracking-widest leading-none">
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
}: SparkCardProps) {
  const [podcastOpen, setPodcastOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);

  // Deeper always links somewhere — episode if available, else the template page
  const deeperHref = spark.episodeSlug
    ? `/episodes/${spark.episodeSlug}`
    : `/templates/${spark.templateId}`;

  // Template badge label — add filter indicator if templates are selected
  const templateName = spark.templateLabel.split(' · ')[0];
  const isFiltered = selectedTemplateIds.length > 0;

  return (
    <>
      <article
        className={cn(
          'relative w-full h-full overflow-hidden bg-black',
          !isActive && 'pointer-events-none'
        )}
        aria-hidden={!isActive}
      >
        {/* Full-bleed hero image */}
        <div className="absolute inset-0">
          <Image
            src={spark.heroImage}
            alt=""
            fill
            className="object-cover"
            priority={isActive}
            sizes="100vw"
          />
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.22) 62%, rgba(0,0,0,0.08) 100%)',
          }}
        />

        {/* Accent colour bloom at bottom */}
        <div
          className="absolute bottom-0 inset-x-0 h-[45%] pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${spark.accentColor}26 0%, transparent 100%)`,
          }}
        />

        {/* ── Top-right action column (25% smaller, moved up) ───────── */}
        <div
          className="absolute right-3 flex flex-col gap-4 items-center z-10"
          style={{ top: 'calc(max(56px, env(safe-area-inset-top) + 44px))' }}
        >
          <ActionBtn icon={Mic} label="Podcast" onClick={() => setPodcastOpen(true)} />
          <ActionBtn icon={MessageCircle} label="Ask" onClick={() => setAskOpen(true)} />
          <ActionBtn icon={BookOpen} label="Deeper" href={deeperHref} />
        </div>

        {/* ── Bottom content overlay ───────────────────────────────── */}
        <div
          className="absolute inset-x-0 px-5 pr-[64px] z-10"
          style={{ bottom: 'calc(max(56px, env(safe-area-inset-bottom) + 44px))' }}
        >
          {/* Template badge — tappable button to open picker */}
          <button
            onClick={onOpenTemplatePicker}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full',
              'text-[0.6rem] font-mono uppercase tracking-wider border mb-3',
              'transition-all active:scale-95',
              'hover:opacity-90'
            )}
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

          {/* Title */}
          <h2
            className="font-serif italic text-[1.4rem] leading-[1.25] text-white mb-2.5"
            style={{ textShadow: '0 2px 14px rgba(0,0,0,0.7)' }}
          >
            {spark.title}
          </h2>

          {/* Answer */}
          <p className="text-[0.83rem] text-white/75 font-serif italic leading-relaxed line-clamp-3 sm:line-clamp-4">
            {spark.answer}
          </p>
        </div>

        {/* ── Swipe-up hint ─────────────────────────────────────────── */}
        <div
          className="absolute inset-x-0 flex flex-col items-center gap-0.5 z-10"
          style={{ bottom: 'calc(max(14px, env(safe-area-inset-bottom) + 6px))' }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ChevronUp className="w-[18px] h-[18px] text-white/30" />
          </motion.div>
          <span className="text-[0.5rem] text-white/25 font-mono uppercase tracking-[0.18em]">
            swipe up
          </span>
        </div>
      </article>

      <PodcastModal spark={spark} open={podcastOpen} onClose={() => setPodcastOpen(false)} />
      <AskModal spark={spark} open={askOpen} onClose={() => setAskOpen(false)} />
    </>
  );
}
