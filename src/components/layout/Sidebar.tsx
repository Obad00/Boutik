import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart, Package, Wallet, HandCoins, History, Settings, LogOut, Store } from 'lucide-react';
import { useShop } from '../../hooks/useShop';
import { useAuthStore } from '../../store/authStore';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { BluetoothStatus } from './BluetoothStatus';

const ICONS = { ShoppingCart, Package, Wallet, HandCoins, History };

const items = [
  { key: 'sale', label: 'Vente', path: '/', icon: 'ShoppingCart' as const },
  { key: 'stock', label: 'Stock', path: '/stock', icon: 'Package' as const },
  { key: 'cash', label: 'Caisse', path: '/caisse', icon: 'Wallet' as const },
  { key: 'credit', label: 'Crédits', path: '/credits', icon: 'HandCoins' as const },
  { key: 'history', label: 'Historique', path: '/historique', icon: 'History' as const },
];

export function Sidebar() {
  const { shop } = useShop();
  const logout = useAuthStore((s) => s.logout);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[var(--color-primary)] text-white h-screen sticky top-0 px-4 py-6">
      <div className="flex items-center gap-2.5 px-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
          <Store size={18} />
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold leading-tight truncate">{shop?.name ?? 'Boutik'}</p>
          <p className="text-xs text-white/50 truncate">{shop?.address}</p>
        </div>
      </div>

      <div className="px-2 mb-6">
        <BluetoothStatus variant="dark" />
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-2xl font-medium text-sm tap-scale ${
                  isActive ? 'bg-white text-[var(--color-primary)]' : 'text-white/70 hover:bg-white/10'
                }`
              }
            >
              <Icon size={19} strokeWidth={2.2} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 pt-4 border-t border-white/10">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-3 rounded-2xl font-medium text-sm tap-scale ${
              isActive ? 'bg-white text-[var(--color-primary)]' : 'text-white/70 hover:bg-white/10'
            }`
          }
        >
          <Settings size={19} strokeWidth={2.2} />
          Admin
        </NavLink>
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex items-center gap-3 px-3.5 py-3 rounded-2xl font-medium text-sm text-white/70 hover:bg-white/10 tap-scale"
        >
          <LogOut size={19} strokeWidth={2.2} />
          Déconnexion
        </button>
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
    </aside>
  );
}
