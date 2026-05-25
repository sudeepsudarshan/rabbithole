import { create } from 'zustand';

interface UIState {
  mobileMenuOpen: boolean;
  activeFilter: string;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveFilter: (filter: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  activeFilter: 'all',
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}));
