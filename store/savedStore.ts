import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavedStore {
  savedIds: string[];
  toggle: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useSavedStore = create<SavedStore>()(
  persist(
    (set, get) => ({
      savedIds: [],
      toggle: (id) =>
        set((s) => ({
          savedIds: s.savedIds.includes(id)
            ? s.savedIds.filter((x) => x !== id)
            : [...s.savedIds, id],
        })),
      isSaved: (id) => get().savedIds.includes(id),
    }),
    { name: 'dtrh-saved' }
  )
);
