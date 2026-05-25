import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  mobileMenuOpen: boolean;
  activeFilter: string;
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  setMobileMenuOpen: (open: boolean) => void;
  setActiveFilter: (filter: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      mobileMenuOpen: false,
      activeFilter: 'all',
      sidebarOpen: false,
      theme: 'dark',
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setActiveFilter: (filter) => set({ activeFilter: filter }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    {
      name: 'rh-ui',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
