'use client';

import { useEpisodeStore } from '@/store/episodeStore';
import { Episode } from '@/types/episode';

export function useEpisodeProgress(episode: Episode) {
  const { progress, markChapterComplete, setCurrentChapter } = useEpisodeStore();
  const episodeProgress = progress[episode.slug] || {
    lastChapter: 1,
    completedChapters: [],
  };

  const totalChapters = episode.chapters.length;
  const completedCount = episodeProgress.completedChapters.length;
  const progressPercent = Math.round((completedCount / totalChapters) * 100);
  const isComplete = completedCount === totalChapters;

  const goToChapter = (chapterNumber: number) => {
    setCurrentChapter(chapterNumber);
  };

  const completeChapter = (chapterNumber: number) => {
    markChapterComplete(episode.slug, chapterNumber);
  };

  return {
    episodeProgress,
    totalChapters,
    completedCount,
    progressPercent,
    isComplete,
    goToChapter,
    completeChapter,
  };
}
