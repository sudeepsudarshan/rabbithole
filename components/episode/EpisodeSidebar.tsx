'use client';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { Episode } from '@/types/episode';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { getTemplateById } from '@/lib/templates';

interface EpisodeSidebarProps {
  episode: Episode;
  currentChapter: number;
  completedChapters: number[];
  onChapterSelect: (chapter: number) => void;
}

export default function EpisodeSidebar({
  episode,
  currentChapter,
  completedChapters,
  onChapterSelect,
}: EpisodeSidebarProps) {
  const template = getTemplateById(episode.templateId);
  const progress = Math.round((completedChapters.length / episode.chapters.length) * 100);

  return (
    <aside className="w-70 shrink-0 sticky top-14 h-[calc(100svh-56px)] overflow-y-auto hidden lg:flex flex-col border-r border-border p-5 gap-5">
      {/* Back */}
      <Link
        href="/episodes"
        className="flex items-center gap-2 text-xs text-paper-faint hover:text-paper transition-colors font-sans"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All episodes
      </Link>

      {/* Template badge */}
      {template && (
        <Badge variant="accent" accentColor={template.accentColor}>
          Template {template.id} · {template.name}
        </Badge>
      )}

      {/* Episode info */}
      <div>
        <h2 className="font-serif italic text-base text-paper leading-snug mb-1">
          {episode.title}
        </h2>
        <p className="font-mono text-[0.65rem] text-paper-faint">
          {episode.dateContext}
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[0.65rem] text-paper-faint">Progress</span>
          <span className="font-mono text-[0.65rem] text-gold">{progress}%</span>
        </div>
        <ProgressBar value={progress} size="md" />
      </div>

      {/* Chapter list */}
      <nav className="flex-1 space-y-1" aria-label="Chapter navigation">
        {episode.chapters.map((chapter) => {
          const isActive = chapter.number === currentChapter;
          const isCompleted = completedChapters.includes(chapter.number);

          return (
            <button
              key={chapter.id}
              onClick={() => onChapterSelect(chapter.number)}
              className={cn(
                'w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-md transition-all text-xs font-sans min-h-[44px]',
                isActive
                  ? 'bg-gold-faint text-gold'
                  : isCompleted
                  ? 'text-paper-muted hover:bg-white/5 hover:text-paper'
                  : 'text-paper-faint hover:bg-white/5 hover:text-paper-muted'
              )}
            >
              <span
                className={cn(
                  'mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-colors',
                  isActive
                    ? 'border-gold bg-gold text-ink'
                    : isCompleted
                    ? 'border-paper-muted/50 bg-paper-muted/20'
                    : 'border-border'
                )}
              >
                {isActive ? (
                  <span className="w-1.5 h-1.5 bg-ink rounded-full" />
                ) : isCompleted ? (
                  <Check className="w-2.5 h-2.5 text-paper-muted" />
                ) : null}
              </span>
              <div>
                <div className="font-mono text-[0.6rem] opacity-60 mb-0.5">
                  Ch. {chapter.number}
                </div>
                <div className="leading-tight">{chapter.title}</div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
