import { create } from 'zustand';
import type { PlatformStats } from '../types';
import { platformStatsService } from '../services/client';

interface PlatformStatsState {
  stats: PlatformStats | null;
  isLoading: boolean;
  error: boolean;
  fetchStats: () => Promise<void>;
}

export const usePlatformStatsStore = create<PlatformStatsState>((set) => ({
  stats: null,
  isLoading: false,
  error: false,

  fetchStats: async () => {
    set({ isLoading: true, error: false });
    try {
      const stats = await platformStatsService.getStats();
      set({ stats, isLoading: false });
    } catch {
      set({ isLoading: false, error: true });
    }
  },
}));
