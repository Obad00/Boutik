import { create } from 'zustand';
import type { ShopSettings } from '../types';
import { settingsService } from '../services/client';

interface SettingsState {
  settings: ShopSettings | null;
  isLoading: boolean;
  fetch: (shop_id: string) => Promise<void>;
  update: (shop_id: string, input: Partial<ShopSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: false,

  fetch: async (shop_id) => {
    set({ isLoading: true });
    const settings = await settingsService.get(shop_id);
    set({ settings, isLoading: false });
  },

  update: async (shop_id, input) => {
    const settings = await settingsService.update(shop_id, input);
    set({ settings });
    void get();
  },
}));
