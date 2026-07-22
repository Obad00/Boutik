import { NavLink } from 'react-router-dom';
import { ShoppingCart, Package, Wallet, HandCoins, History } from 'lucide-react';

const ICONS = { ShoppingCart, Package, Wallet, HandCoins, History };

const items = [
  { key: 'sale', label: 'Vente', path: '/', icon: 'ShoppingCart' as const },
  { key: 'stock', label: 'Stock', path: '/stock', icon: 'Package' as const },
  { key: 'cash', label: 'Caisse', path: '/caisse', icon: 'Wallet' as const },
  { key: 'credit', label: 'Crédits', path: '/credits', icon: 'HandCoins' as const },
  { key: 'history', label: 'Historique', path: '/historique', icon: 'History' as const },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-md border-t border-[var(--color-border)] safe-bottom lg:hidden">
      <div className="flex items-stretch justify-around">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2.5 tap-scale ${
                  isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink-faint)]'
                }`
              }
            >
              <Icon size={22} strokeWidth={2.2} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
