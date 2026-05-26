'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mic, MessageCircle, BookOpen, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { SparkCard as SparkCardType } from '@/types/spark';
import { cn } from '@/lib/utils';
import PodcastModal from './PodcastModal';
import AskModal from './AskModal';

interface SparkCardProps {
  spark: SparkCardType;
  isActive?: boolean;
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  accentColor,
  href,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  accentColor: string;
  href?: string;
}) {
  const content = (
    <div className="flex flex-col items-center gap-[5px]">
      <div
        className="w-[50px] h-[50px] rounded-full flex items-center justify-center border"
        style={{
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(255,255,255,0.18)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <Icon className="w-[22px] h-[22px] text-white" />
      </div>
      <span className="text-[0.55rem] text-white/60 font-mono uppercase tracking-widest">
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

export default function SparkCard({ spark, isActive = false }: SparkCardProps) {
  const [podcastOpen, setPodcastOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);

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

        {/* Multi-stop gradient overlay — image visible at top, heavy black at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.75) 38%, rgba(0,0,0,0.25) 62%, rgba(0,0,0,0.08) 100%)',
          }}
        />

        {/* Accent colour bloom at bottom edge */}
        <div
          className="absolute bottom-0 inset-x-0 h-[45%] pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${spark.accentColor}28 0%, transparent 100%)`,
          }}
        />

        {/* ── Right-side action column ─────────────────────────────── */}
        {/* Positioned using safe-area-inset-bottom so it clears the iOS home bar */}
        <div
          className="absolute right-4 flex flex-col gap-6 items-center z-10"
          style={{ bottom: 'calc(max(96px, env(safe-area-inset-bottom) + 80px))' }}
        >
          <ActionBtn
            icon={Mic}
            label="Podcast"
            onClick={() => setPodcastOpen(true)}
            accentColor={spark.accentColor}
          />
          <ActionBtn
            icon={MessageCircle}
            label="Ask"
            onClick={() => setAskOpen(true)}
            accentColor={spark.accentColor}
          />
          {spark.episodeSlug && (
            <ActionBtn
              icon={BookOpen}
              label="Deeper"
              href={`/episodes/${spark.episodeSlug}`}
              accentColor={spark.accentColor}
            />
          )}
        </div>

        {/* ── Bottom content overlay ───────────────────────────────── */}
        {/* right padding leaves room for the action column */}
        <div
          className="absolute inset-x-0 px-5 pr-[76px] z-10"
          style={{ bottom: 'calc(max(56px, env(safe-area-inset-bottom) + 44px))' }}
        >
          {/* Template badge */}
          <span
            className="inline-flex items-center px-2.5 py-[3px] rounded-full text-[0.6rem] font-mono uppercase tracking-wider border mb-3"
            style={{
              color: spark.accentColor,
              borderColor: `${spark.accentColor}55`,
              background: `${spark.accentColor}18`,
            }}
          >
            {spark.templateLabel}
          </span>

          {/* Title */}
          <h2
            className="font-serif italic text-[1.4rem] leading-[1.25] text-white mb-2.5"
            style={{ textShadow: '0 2px 14px rgba(0,0,0,0.7)' }}
          >
            {spark.title}
          </h2>

          {/* Answer — show 3 lines on short phones, 4 on taller ones */}
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
