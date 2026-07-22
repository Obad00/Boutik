import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  PowerOff,
  Power,
  Copy,
  Check,
  ArrowLeft,
  Store,
  Pencil,
  LogOut,
  BarChart3,
  List,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useShopsStore } from '../../store/shopsStore';
import { CreateShopForm } from '../../components/admin/CreateShopForm';
import { PlatformStatsPanel } from '../../components/admin/PlatformStatsPanel';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { superadminAuthService } from '../../services/client';
import type { Shop } from '../../types';

const UNLOCK_KEY = 'boutik_superadmin_unlocked';
type Tab = 'shops' | 'stats';
type ShopFilter = 'active' | 'inactive';

export function SuperAdminPage() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === 'true');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const [tab, setTab] = useState<Tab>('shops');
  const [shopFilter, setShopFilter] = useState<ShopFilter>('active');

  const shops = useShopsStore((s) => s.shops);
  const fetchAll = useShopsStore((s) => s.fetchAll);
  const createShop = useShopsStore((s) => s.createShop);
  const updateShop = useShopsStore((s) => s.updateShop);
  const deactivateShop = useShopsStore((s) => s.deactivateShop);
  const reactivateShop = useShopsStore((s) => s.reactivateShop);

  const [formOpen, setFormOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Shop | null>(null);
  const [reactivateTarget, setReactivateTarget] = useState<Shop | null>(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [justCreated, setJustCreated] = useState<{ name: string; code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const visibleShops = shops.filter((s) => (shopFilter === 'active' ? s.is_active : !s.is_active));

  useEffect(() => {
    if (unlocked) fetchAll();
  }, [unlocked, fetchAll]);

  async function handleUnlock() {
    const session = await superadminAuthService.login(email, password);
    if (session) {
      sessionStorage.setItem(UNLOCK_KEY, 'true');
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  function handleLogout() {
    superadminAuthService.logout();
    sessionStorage.removeItem(UNLOCK_KEY);
    setUnlocked(false);
    setEmail('');
    setPassword('');
    setLogoutConfirmOpen(false);
  }

  function handleCopy(code: string) {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary)] px-6">
        <div className="w-full max-w-xs flex flex-col items-center text-center gap-4 bg-white rounded-[var(--radius-card-lg)] p-7 shadow-2xl">
          <div className="w-14 h-14 rounded-3xl bg-[var(--color-primary)] text-white flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="font-display font-bold text-lg">Espace Superadmin</p>
            <p className="text-sm text-[var(--color-ink-soft)]">Réservé à l'opérateur de la plateforme Boutik</p>
          </div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(false);
            }}
            className="text-center"
            autoFocus
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className="text-center"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="tap-scale text-[var(--color-ink-faint)]"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          {error && <p className="text-sm text-[var(--color-cash-out)]">Identifiants incorrects</p>}
          <Button fullWidth onClick={handleUnlock} disabled={!email || !password}>
            Déverrouiller
          </Button>
          <Link to="/login" className="text-xs text-[var(--color-ink-faint)] flex items-center gap-1 mt-1">
            <ArrowLeft size={12} /> Retour à la connexion boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] px-4 md:px-8 lg:px-12 pt-6 pb-10">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl">Superadmin</h1>
            <p className="text-sm text-[var(--color-ink-soft)]">
              {tab === 'shops' ? 'Créez et gérez les boutiques de la plateforme' : "Vue d'ensemble de toutes les boutiques"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {tab === 'shops' && (
              <Button size="sm" icon={<Plus size={16} />} onClick={() => { setEditingShop(null); setFormOpen(true); }}>
                Nouvelle boutique
              </Button>
            )}
            <button
              onClick={() => setLogoutConfirmOpen(true)}
              className="tap-scale w-9 h-9 rounded-xl bg-[var(--color-cash-out-soft)] text-[var(--color-cash-out)] flex items-center justify-center shrink-0"
              aria-label="Déconnexion"
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <div className="flex bg-black/[0.04] rounded-full p-1 text-sm font-semibold self-start">
          <button
            onClick={() => setTab('shops')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full tap-scale ${
              tab === 'shops' ? 'bg-white shadow-sm text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)]'
            }`}
          >
            <List size={14} /> Boutiques
          </button>
          <button
            onClick={() => setTab('stats')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full tap-scale ${
              tab === 'stats' ? 'bg-white shadow-sm text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)]'
            }`}
          >
            <BarChart3 size={14} /> Statistiques
          </button>
        </div>

        {tab === 'stats' && <PlatformStatsPanel />}

        {tab === 'shops' && justCreated && (
          <div className="bg-[var(--color-cash-in-soft)] rounded-2xl p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm text-[var(--color-ink)]">
                « {justCreated.name} » créée — code d'accès :
              </p>
              <p className="font-mono-num font-bold text-lg text-[var(--color-cash-in)]">{justCreated.code}</p>
            </div>
            <button
              onClick={() => handleCopy(justCreated.code)}
              className="tap-scale w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0"
            >
              {copied ? <Check size={16} className="text-[var(--color-cash-in)]" /> : <Copy size={16} />}
            </button>
          </div>
        )}

        {tab === 'shops' && (
          <>
            <div className="flex bg-black/[0.04] rounded-full p-1 text-xs font-semibold self-start">
              <button
                onClick={() => setShopFilter('active')}
                className={`px-3 py-1.5 rounded-full tap-scale ${
                  shopFilter === 'active' ? 'bg-white shadow-sm text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)]'
                }`}
              >
                Actives ({shops.filter((s) => s.is_active).length})
              </button>
              <button
                onClick={() => setShopFilter('inactive')}
                className={`px-3 py-1.5 rounded-full tap-scale ${
                  shopFilter === 'inactive' ? 'bg-white shadow-sm text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)]'
                }`}
              >
                Désactivées ({shops.filter((s) => !s.is_active).length})
              </button>
            </div>

            {visibleShops.length === 0 ? (
              <p className="text-sm text-[var(--color-ink-faint)] py-6 text-center">
                {shopFilter === 'active' ? 'Aucune boutique active.' : 'Aucune boutique désactivée.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {visibleShops.map((s) => (
                  <div
                    key={s.id}
                    className={`tap-scale flex flex-col gap-3 bg-[var(--color-surface)] rounded-[var(--radius-card)] p-4 shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)] ${
                      s.is_active ? '' : 'opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center shrink-0">
                        <Store size={17} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm truncate">{s.name}</p>
                          {!s.is_active && <Badge tone="neutral">Désactivée</Badge>}
                        </div>
                        <p className="text-xs text-[var(--color-ink-faint)] truncate">{s.address} · {s.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 bg-black/[0.04] rounded-full px-3 py-1.5 shrink-0">
                        <span className="font-mono-num font-semibold text-xs">{s.code}</span>
                        <button onClick={() => handleCopy(s.code)} className="tap-scale text-[var(--color-ink-faint)]">
                          <Copy size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => { setEditingShop(s); setFormOpen(true); }}
                          className="tap-scale w-8 h-8 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center"
                          aria-label="Modifier la boutique"
                        >
                          <Pencil size={14} />
                        </button>
                        {s.is_active ? (
                          <button
                            onClick={() => setDeactivateTarget(s)}
                            className="tap-scale w-8 h-8 rounded-full bg-[var(--color-cash-out-soft)] text-[var(--color-cash-out)] flex items-center justify-center"
                            aria-label="Désactiver la boutique"
                            title="Désactiver la boutique"
                          >
                            <PowerOff size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setReactivateTarget(s)}
                            className="tap-scale w-8 h-8 rounded-full bg-[var(--color-cash-in-soft)] text-[var(--color-cash-in)] flex items-center justify-center"
                            aria-label="Réactiver la boutique"
                            title="Réactiver la boutique"
                          >
                            <Power size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <CreateShopForm
          open={formOpen}
          shop={editingShop}
          onClose={() => setFormOpen(false)}
          onSubmit={async (input) => {
            if (editingShop) {
              await updateShop(editingShop.id, input);
            } else {
              const result = await createShop(input);
              setJustCreated({ name: result.shop.name, code: result.code });
            }
          }}
        />

        <ConfirmDialog
          open={!!deactivateTarget}
          title="Désactiver la boutique"
          message={`La boutique « ${deactivateTarget?.name} » ne sera plus accessible par son code, mais toutes ses données (produits, ventes, clients) restent conservées. Vous pourrez la réactiver à tout moment.`}
          confirmLabel="Désactiver"
          danger
          onConfirm={() => {
            if (deactivateTarget) deactivateShop(deactivateTarget.id);
            setDeactivateTarget(null);
          }}
          onCancel={() => setDeactivateTarget(null)}
        />

        <ConfirmDialog
          open={!!reactivateTarget}
          title="Réactiver la boutique"
          message={`Réactiver « ${reactivateTarget?.name} » ? La boutique redeviendra accessible avec son code actuel.`}
          confirmLabel="Réactiver"
          onConfirm={() => {
            if (reactivateTarget) reactivateShop(reactivateTarget.id);
            setReactivateTarget(null);
          }}
          onCancel={() => setReactivateTarget(null)}
        />

        <ConfirmDialog
          open={logoutConfirmOpen}
          title="Déconnexion"
          message="Voulez-vous vraiment vous déconnecter de l'espace superadmin ?"
          confirmLabel="Se déconnecter"
          danger
          onConfirm={handleLogout}
          onCancel={() => setLogoutConfirmOpen(false)}
        />
      </div>
    </div>
  );
}
