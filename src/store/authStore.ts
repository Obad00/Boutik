import { create } from 'zustand';
import type { AuthSession } from '../types';
import { authService } from '../services/client';

interface AuthState {
  session: AuthSession | null;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;
  init: () => void;
  login: (shopCode: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  // Vrai jusqu'à ce que init() ait relu sessionStorage — RequireAuth doit
  // attendre ça avant de décider de rediriger vers /login, sinon le premier
  // rendu (session encore null) redirige avant que init() n'ait tourné
  // (useEffect s'exécute après le commit, et l'effet interne de <Navigate>
  // se déclenche avant celui d'App car il est plus profond dans l'arbre).
  isInitializing: true,
  isLoading: false,
  error: null,

  init: () => {
    const session = authService.getSession();
    set({ session, isInitializing: false });
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
