'use client';
import { Check } from 'lucide-react';
import { Episode } from '@/types/episode';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { getTemplateById } from '@/lib/templates';
import BackLink from '@/components/nav/BackLink';

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
    <aside className="w-70 shrink-0 sticky top-14 h-[calc(100svh-56px)] overflow-y-auto hidden lg:flex flex-col border-r border-hairline p-5 gap-5">
      {/* Back */}
      <BackLink fallback="/episodes" fallbackLabel="All episodes" />

      {/* Template badge */}
      {template && (
        <Badge variant="accent" accentColor={template.accentColor}>
          Template {template.id} · {template.name}
        </Badge>
      )}

      {/* Episode info */}
      <div>
        <h2 className="font-serif text-base text-ink-primary leading-snug mb-1">
          {episode.title}
        </h2>
        <p className="font-mono text-[0.65rem] text-ink-muted">
          {episode.dateContext}
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[0.65rem] text-ink-muted">Progress</span>
          <span className="font-mono text-[0.65rem] text-accent-mustard">{progress}%</span>
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
                  ? 'bg-[var(--state-hover)] text-accent-mustard border border-hairline'
                  : isCompleted
                  ? 'text-ink-secondary hover:bg-[var(--state-hover)] hover:text-ink-primary'
                  : 'text-ink-muted hover:bg-[var(--state-hover)] hover:text-ink-secondary'
              )}
            >
              <span
                className={cn(
                  'mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-colors',
                  isActive
                    ? 'border-accent-mustard bg-accent-mustard text-page'
                    : isCompleted
                    ? 'border-ink-muted'
                    : 'border-hairline'
                )}
              >
                {isActive ? (
                  <span className="w-1.5 h-1.5 bg-page rounded-full" />
                ) : isCompleted ? (
                  <Check className="w-2.5 h-2.5 text-ink-muted" />
                ) : null}
              </span>
              <div>
                <div className="font-mono text-[0.6rem] text-ink-faint mb-0.5">
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
