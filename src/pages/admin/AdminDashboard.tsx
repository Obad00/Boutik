import { useEffect, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Lock, Package, Tags, Users, Settings as SettingsIcon } from 'lucide-react';
import { useShop } from '../../hooks/useShop';
import { useSettingsStore } from '../../store/settingsStore';
import { authService } from '../../services/client';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const ADMIN_UNLOCK_KEY = 'boutik_admin_unlocked';

const sections = [
  { path: '/admin/produits', label: 'Produits', icon: Package },
  { path: '/admin/categories', label: 'Catégories', icon: Tags },
  { path: '/admin/clients', label: 'Clients', icon: Users },
  { path: '/admin/parametres', label: 'Paramètres', icon: SettingsIcon },
];

export function AdminDashboard() {
  const { shop_id } = useShop();
  const fetchSettings = useSettingsStore((s) => s.fetch);
  const location = useLocation();

  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(ADMIN_UNLOCK_KEY) === 'true');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (shop_id) fetchSettings(shop_id);
  }, [shop_id, fetchSettings]);

  async function handleUnlock() {
    const valid = await authService.verifyAdminPin(pin);
    if (valid) {
      sessionStorage.setItem(ADMIN_UNLOCK_KEY, 'true');
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="w-full max-w-xs flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-[var(--color-primary)] text-white flex items-center justify-center">
            <Lock size={22} />
          </div>
          <div>
            <p className="font-display font-bold text-lg">Accès Admin</p>
            <p className="text-sm text-[var(--color-ink-soft)]">Entrez le code PIN pour continuer</p>
          </div>
          <Input
            type="password"
            inputMode="numeric"
            placeholder="Code PIN"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            className="text-center tracking-widest"
            autoFocus
          />
          {error && <p className="text-sm text-[var(--color-cash-out)]">Code incorrect</p>}
          <Button fullWidth onClick={handleUnlock} disabled={!pin}>
            Déverrouiller
          </Button>
        </div>
      </div>
    );
  }

  const isRoot = location.pathname === '/admin' || location.pathname === '/admin/';

  return (
    <div className="px-4 md:px-6 pt-4 md:pt-6 pb-4 max-w-4xl mx-auto flex flex-col gap-4">
      <h1 className="font-display font-bold text-xl">Administration</h1>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {sections.map((s) => (
          <NavLink
            key={s.path}
            to={s.path}
            className={({ isActive }) =>
              `tap-scale shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${
                isActive ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-ink-soft)]'
              }`
            }
          >
            <s.icon size={15} />
            {s.label}
          </NavLink>
        ))}
      </div>

      {isRoot ? (
        <p className="text-sm text-[var(--color-ink-soft)]">Choisissez une section à gérer ci-dessus.</p>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
