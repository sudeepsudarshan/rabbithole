'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ChapterNavProps {
  currentChapter: number;
  totalChapters: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export default function ChapterNav({ currentChapter, totalChapters, onPrev, onNext, className }: ChapterNavProps) {
  return (
    <div
      className={cn('flex items-center justify-between py-6', className)}
      style={{ borderTop: '1px solid var(--border-hairline)' }}
    >
      <Button
        variant="ghost"
        size="md"
        onClick={onPrev}
        disabled={currentChapter <= 1}
        className="gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>
      <span className="font-mono text-[0.65rem] text-ink-muted">
        {currentChapter} / {totalChapters}
      </span>
      <Button
        variant="ghost"
        size="md"
        onClick={onNext}
        disabled={currentChapter >= totalChapters}
        className="gap-2"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
