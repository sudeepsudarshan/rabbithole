import { create } from 'zustand';

const MAX_HISTORY = 5;

interface NavHistoryState {
  history: string[];
  push: (path: string) => void;
  /** Return the most recent path in history that isn't `current`.
   *  Falls back to `fallback` when no prior path exists. */
  getReturnPath: (current: string, fallback: string) => string;
}

export const useNavHistory = create<NavHistoryState>((set, get) => ({
  history: [],

  push: (path) => {
    set((state) => {
      // Don't duplicate the current top of stack
      if (state.history[state.history.length - 1] === path) return state;
      const next = [...state.history, path];
      // Cap at MAX_HISTORY entries (drop oldest)
      return { history: next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next };
    });
  },

  getReturnPath: (current, fallback) => {
    const { history } = get();
    // Walk backwards — first entry ≠ current is the return target
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i] !== current) return history[i];
    }
    return fallback;
  },
}));
