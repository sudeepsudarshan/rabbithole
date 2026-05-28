'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Episode } from '@/types/episode';
import { Template } from '@/types/template';
import { RabbitHolePrompt } from '@/types/episode';
import { useEpisodeStore } from '@/store/episodeStore';
import EpisodeSidebar from '@/components/episode/EpisodeSidebar';
import ChapterContent from '@/components/episode/ChapterContent';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import BackLink from '@/components/nav/BackLink';

interface EpisodePageClientProps {
  episode: Episode;
  template: Template;
  initialChapter: number;
}

export default function EpisodePageClient({
  episode,
  template,
  initialChapter,
}: EpisodePageClientProps) {
  const [currentChapterNum, setCurrentChapterNum] = useState(initialChapter);
  const router = useRouter();
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();
  const { markChapterComplete, getEpisodeProgress, setCurrentEpisode } = useEpisodeStore();

  const progress = getEpisodeProgress(episode.slug);
  const currentChapter = episode.chapters.find(c => c.number === currentChapterNum)!;

  useEffect(() => {
    setCurrentEpisode(episode.slug);
  }, [episode.slug, setCurrentEpisode]);

  const goToChapter = (num: number) => {
    const validNum = Math.max(1, Math.min(episode.chapters.length, num));
    // Mark current as complete when navigating away
    markChapterComplete(episode.slug, currentChapterNum);
    setCurrentChapterNum(validNum);
    // Update URL without full navigation
    router.replace(`${pathname}?chapter=${validNum}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: shouldReduce ? 'auto' : 'smooth' });
  };

  const handlePromptClick = (prompt: RabbitHolePrompt) => {
    // Scroll to dive window and populate it
    const diveEl = document.getElementById('dive-window');
    if (diveEl) {
      diveEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const progressPercent = Math.round(
    (progress.completedChapters.length / episode.chapters.length) * 100
  );

  return (
    <div className="flex min-h-[calc(100svh-56px)]">
      {/* Sidebar */}
      <EpisodeSidebar
        episode={episode}
        currentChapter={currentChapterNum}
        completedChapters={progress.completedChapters}
        onChapterSelect={goToChapter}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile back + chapter strip */}
        <div className="lg:hidden border-b border-hairline bg-page/90 sticky top-14 z-30">
          <div className="px-4 pt-2">
            <BackLink fallback="/episodes" fallbackLabel="All episodes" className="text-xs" />
          </div>
          <div className="flex gap-1 px-4 py-2 overflow-x-auto scrollbar-hide">
            {episode.chapters.map(ch => (
              <button
                key={ch.id}
                onClick={() => goToChapter(ch.number)}
                className={`
                  shrink-0 px-3 py-1.5 rounded-full text-xs font-mono transition-colors whitespace-nowrap
                  ${ch.number === currentChapterNum
                    ? 'bg-accent-rust text-elevated'
                    : progress.completedChapters.includes(ch.number)
                    ? 'text-ink-secondary border border-hairline'
                    : 'bg-transparent text-ink-muted border border-hairline'
                  }
                `}
                title={ch.title}
              >
                Ch.{ch.number}
                {ch.number === currentChapterNum && (
                  <span className="ml-1 hidden xs:inline opacity-80">– {ch.title.length > 16 ? ch.title.slice(0, 15) + '…' : ch.title}</span>
                )}
              </button>
            ))}
          </div>
          <ProgressBar value={progressPercent} className="h-0.5 rounded-none" />
        </div>

        {/* Chapter content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapterNum}
            initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? {} : { opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-2xl mx-auto px-6 py-10"
          >
            <ChapterContent
              episode={episode}
              chapter={currentChapter}
              template={template}
              onPrevChapter={() => goToChapter(currentChapterNum - 1)}
              onNextChapter={() => goToChapter(currentChapterNum + 1)}
              onPromptClick={handlePromptClick}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
