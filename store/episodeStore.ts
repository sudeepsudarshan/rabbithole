import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EpisodeState {
  currentEpisodeSlug: string | null;
  currentChapter: number;
  progress: Record<string, { lastChapter: number; completedChapters: number[] }>;
  setCurrentEpisode: (slug: string) => void;
  setCurrentChapter: (chapter: number) => void;
  markChapterComplete: (slug: string, chapter: number) => void;
  getEpisodeProgress: (slug: string) => { lastChapter: number; completedChapters: number[] };
}

export const useEpisodeStore = create<EpisodeState>()(
  persist(
    (set, get) => ({
      currentEpisodeSlug: null,
      currentChapter: 1,
      progress: {},

      setCurrentEpisode: (slug) => set({ currentEpisodeSlug: slug }),

      setCurrentChapter: (chapter) => set({ currentChapter: chapter }),

      markChapterComplete: (slug, chapter) => {
        const current = get().progress[slug] || { lastChapter: 1, completedChapters: [] };
        const completedChapters = Array.from(new Set([...current.completedChapters, chapter]));
        set({
          progress: {
            ...get().progress,
            [slug]: {
              lastChapter: Math.max(current.lastChapter, chapter),
              completedChapters,
            },
          },
        });
      },

      getEpisodeProgress: (slug) => {
        return get().progress[slug] || { lastChapter: 1, completedChapters: [] };
      },
    }),
    { name: 'episode-storage' }
  )
);
