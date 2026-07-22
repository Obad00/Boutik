import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import { useAuthStore } from '../store/authStore';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useShop();
  const isInitializing = useAuthStore((s) => s.isInitializing);

  // Tant que la session n'a pas fini d'être relue depuis sessionStorage,
  // ne pas rediriger — sinon on redirige vers /login sur la seule base de
  // l'état initial (non authentifié) avant que init() ait eu la chance de
  // s'exécuter. Rediriger seulement une fois la vérification terminée ET
  // confirmée négative.
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-canvas)]">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center animate-pulse">
          <img src="/icons/boutik-icon-monochrome.svg" alt="" className="w-6 h-6" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
