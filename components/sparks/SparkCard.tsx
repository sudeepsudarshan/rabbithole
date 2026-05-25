'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SparkCard as SparkCardType } from '@/types/spark';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface SparkCardProps {
  spark: SparkCardType;
  isActive?: boolean;
}

export default function SparkCard({ spark, isActive = false }: SparkCardProps) {
  return (
    <article
      className={cn(
        'relative w-full h-full flex flex-col bg-ink-50 overflow-hidden',
        isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      aria-hidden={!isActive}
    >
      {/* Accent gradient */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: spark.accentColor }}
      />

      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${spark.accentColor} 0%, transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col h-full p-6 pt-7">
        {/* Template label */}
        <div className="mb-4">
          <span
            className="font-mono text-[0.65rem] uppercase tracking-wider"
            style={{ color: spark.accentColor }}
          >
            {spark.templateLabel}
          </span>
        </div>

        {/* Hook title */}
        <h2 className="font-serif italic text-xl leading-tight text-paper mb-6">
          {spark.title}
        </h2>

        {/* Exchange */}
        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Question */}
          <div className="flex justify-end">
            <div
              className="rounded-lg rounded-tr-sm px-4 py-3 max-w-[85%]"
              style={{ background: `${spark.accentColor}20`, border: `1px solid ${spark.accentColor}30` }}
            >
              <p className="text-sm text-paper font-sans">{spark.question}</p>
            </div>
          </div>

          {/* Answer */}
          <div className="flex justify-start">
            <div className="rounded-lg rounded-tl-sm px-4 py-3 max-w-[92%] bg-ink-100 border border-border">
              <p className="text-sm font-serif italic text-paper leading-relaxed">
                {spark.answer}
              </p>
            </div>
          </div>
        </div>

        {/* Hook line */}
        <div className="mt-5 pt-4 border-t border-border">
          <p className="text-xs text-paper-muted font-sans italic leading-relaxed mb-4">
            "{spark.hookLine}"
          </p>

          {/* CTA */}
          {spark.episodeSlug && (
            <Link href={`/episodes/${spark.episodeSlug}`}>
              <Button
                variant="primary"
                size="sm"
                className="w-full gap-2 justify-center"
                style={{ background: spark.accentColor, color: '#0F0E0C' }}
              >
                Go Deeper
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
