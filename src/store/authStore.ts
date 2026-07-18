import { create } from 'zustand';
import type { AuthSession } from '../types';
import { authService } from '../services/client';

interface AuthState {
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  init: () => void;
  login: (shopCode: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: false,
  error: null,

  init: () => {
    const session = authService.getSession();
    if (session) set({ session });
  },

  login: async (shopCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.loginWithShopCode(shopCode);
      if (!session) {
        set({ isLoading: false, error: 'Code boutique invalide. Vérifiez et réessayez.' });
        return false;
      }
      set({ session, isLoading: false });
      return true;
    } catch {
      set({ isLoading: false, error: 'Une erreur est survenue. Réessayez.' });
      return false;
    }
  },

  logout: () => {
    authService.logout();
    set({ session: null });
  },
}));
