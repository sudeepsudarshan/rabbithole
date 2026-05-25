'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Mic, MessageCircle } from 'lucide-react';
import { SparkCard as SparkCardType } from '@/types/spark';
import { cn } from '@/lib/utils';
import PodcastModal from './PodcastModal';
import AskModal from './AskModal';

interface SparkCardProps {
  spark: SparkCardType;
  isActive?: boolean;
}

export default function SparkCard({ spark, isActive = false }: SparkCardProps) {
  const [podcastOpen, setPodcastOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);

  return (
    <>
      <article
        className={cn(
          'relative w-full h-full flex flex-col overflow-hidden',
          isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden={!isActive}
      >
        {/* Hero image — full bleed */}
        <div className="absolute inset-0">
          <Image
            src={spark.heroImage}
            alt=""
            fill
            className="object-cover"
            priority={isActive}
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/30" />

        {/* Accent gradient bar at top */}
        <div
          className="absolute inset-x-0 top-0 h-1 z-10"
          style={{ background: spark.accentColor }}
        />

        {/* Background accent glow */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none z-[1]"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${spark.accentColor} 0%, transparent 60%)`,
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-6 pt-7">
          {/* Template label */}
          <div className="mb-3">
            <span
              className="font-mono text-[0.65rem] uppercase tracking-wider"
              style={{ color: spark.accentColor }}
            >
              {spark.templateLabel}
            </span>
          </div>

          {/* Hook title */}
          <h2 className="font-serif italic text-xl leading-tight text-paper mb-5 drop-shadow-lg">
            {spark.title}
          </h2>

          {/* Exchange */}
          <div className="flex-1 space-y-3 overflow-hidden">
            {/* Question */}
            <div className="flex justify-end">
              <div
                className="rounded-lg rounded-tr-sm px-4 py-3 max-w-[85%] backdrop-blur-sm"
                style={{
                  background: `${spark.accentColor}25`,
                  border: `1px solid ${spark.accentColor}35`,
                }}
              >
                <p className="text-sm text-paper font-sans">{spark.question}</p>
              </div>
            </div>

            {/* Answer */}
            <div className="flex justify-start">
              <div className="rounded-lg rounded-tl-sm px-4 py-3 max-w-[92%] bg-ink/70 backdrop-blur-sm border border-white/10">
                <p className="text-sm font-serif italic text-paper leading-relaxed">
                  {spark.answer}
                </p>
              </div>
            </div>
          </div>

          {/* Hook line + CTAs */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-paper/70 font-sans italic leading-relaxed mb-4">
              &ldquo;{spark.hookLine}&rdquo;
            </p>

            {/* Action buttons */}
            <div className="flex gap-2">
              {spark.episodeSlug && (
                <Link href={`/episodes/${spark.episodeSlug}`} className="flex-1">
                  <button
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-ink transition-all hover:opacity-90 active:scale-95"
                    style={{ background: spark.accentColor }}
                  >
                    Go Deeper
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              )}

              <button
                onClick={() => setPodcastOpen(true)}
                className={cn(
                  'flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:opacity-90 active:scale-95',
                  'bg-ink/60 backdrop-blur-sm border border-white/15 text-paper',
                  !spark.episodeSlug && 'flex-1'
                )}
                title="Start a Podcast"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Podcast</span>
              </button>

              <button
                onClick={() => setAskOpen(true)}
                className={cn(
                  'flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:opacity-90 active:scale-95',
                  'bg-ink/60 backdrop-blur-sm border border-white/15 text-paper',
                  !spark.episodeSlug && 'flex-1'
                )}
                title="Ask a question"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </div>
          </div>
        </div>
      </article>

      <PodcastModal spark={spark} open={podcastOpen} onClose={() => setPodcastOpen(false)} />
      <AskModal spark={spark} open={askOpen} onClose={() => setAskOpen(false)} />
    </>
  );
}
