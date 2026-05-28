'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChapterNavProps {
  currentChapter: number;
  totalChapters: number;
  prevTitle?: string;
  nextTitle?: string;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

export default function ChapterNav({
  currentChapter,
  totalChapters,
  prevTitle,
  nextTitle,
  onPrev,
  onNext,
  className,
}: ChapterNavProps) {
  return (
    <div
      className={cn('grid grid-cols-3 items-center py-5 gap-2', className)}
      style={{ borderTop: '1px solid var(--border-hairline)' }}
    >
      {/* Previous */}
      <button
        onClick={onPrev}
        disabled={currentChapter <= 1}
        className={cn(
          'flex flex-col gap-0.5 text-left transition-colors disabled:opacity-30',
          currentChapter > 1 && 'hover:text-[var(--ink-primary)]'
        )}
        style={{ color: 'var(--ink-secondary)' }}
      >
        <span className="flex items-center gap-1 font-mono text-[0.6rem] tracking-wider" style={{ color: 'var(--ink-faint)' }}>
          <ChevronLeft className="w-3 h-3" />
          Ch.{currentChapter - 1}
        </span>
        {prevTitle && (
          <span className="text-[0.72rem] font-sans leading-snug">
            {truncate(prevTitle, 28)}
          </span>
        )}
      </button>

      {/* Counter */}
      <div className="text-center">
        <span className="font-mono text-[0.6rem]" style={{ color: 'var(--ink-faint)' }}>
          Chapter {currentChapter} of {totalChapters}
        </span>
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={currentChapter >= totalChapters}
        className={cn(
          'flex flex-col gap-0.5 text-right items-end transition-colors disabled:opacity-30',
          currentChapter < totalChapters && 'hover:text-[var(--ink-primary)]'
        )}
        style={{ color: 'var(--ink-secondary)' }}
      >
        <span className="flex items-center gap-1 font-mono text-[0.6rem] tracking-wider" style={{ color: 'var(--ink-faint)' }}>
          Ch.{currentChapter + 1}
          <ChevronRight className="w-3 h-3" />
        </span>
        {nextTitle && (
          <span className="text-[0.72rem] font-sans leading-snug">
            {truncate(nextTitle, 28)}
          </span>
        )}
      </button>
    </div>
  );
}
