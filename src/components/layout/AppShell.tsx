import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useShop } from '../../hooks/useShop';
import { useAuthStore } from '../../store/authStore';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { BluetoothStatus } from './BluetoothStatus';

export function AppShell() {
  const { shop } = useShop();
  const logout = useAuthStore((s) => s.logout);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--color-canvas)]">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-3 bg-[var(--color-canvas)]/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0">
              <img src="/icons/boutik-icon-monochrome.svg" alt="" className="w-4 h-4" />
            </div>
            <p className="font-display font-bold truncate">{shop?.name ?? 'Boutik'}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <BluetoothStatus compact />
            <NavLink
              to="/admin"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/5 text-[var(--color-ink-soft)] tap-scale"
            >
              <Settings size={18} />
            </NavLink>
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--color-cash-out-soft)] text-[var(--color-cash-out)] tap-scale"
              aria-label="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main className="flex-1 pb-24 lg:pb-8">
          <Outlet />
        </main>

        <BottomNav />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Déconnexion"
        message="Voulez-vous vraiment vous déconnecter ? Vous devrez ressaisir le code boutique pour vous reconnecter."
        confirmLabel="Se déconnecter"
        danger
        onConfirm={logout}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
