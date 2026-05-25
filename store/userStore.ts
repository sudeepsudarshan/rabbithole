import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface UserState {
  user: User | null;
  loading: boolean;
  rabbitHoleCount: number;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  incrementRabbitHoleCount: () => void;
  resetRabbitHoleCount: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: true,
  rabbitHoleCount: 0,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  incrementRabbitHoleCount: () => set({ rabbitHoleCount: get().rabbitHoleCount + 1 }),
  resetRabbitHoleCount: () => set({ rabbitHoleCount: 0 }),
}));
