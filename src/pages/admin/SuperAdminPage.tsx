import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Plus, Trash2, Copy, Check, ArrowLeft, Store, Pencil, LogOut } from 'lucide-react';
import { useShopsStore } from '../../store/shopsStore';
import { CreateShopForm } from '../../components/admin/CreateShopForm';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PLATFORM_CONFIG } from '../../services/mock/db';
import type { Shop } from '../../types';

const UNLOCK_KEY = 'boutik_superadmin_unlocked';

export function SuperAdminPage() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === 'true');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const shops = useShopsStore((s) => s.shops);
  const fetchAll = useShopsStore((s) => s.fetchAll);
  const createShop = useShopsStore((s) => s.createShop);
  const updateShop = useShopsStore((s) => s.updateShop);
  const removeShop = useShopsStore((s) => s.removeShop);

  const [formOpen, setFormOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Shop | null>(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [justCreated, setJustCreated] = useState<{ name: string; code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (unlocked) fetchAll();
  }, [unlocked, fetchAll]);

  function handleUnlock() {
    if (pin === PLATFORM_CONFIG.superadmin_pin) {
      sessionStorage.setItem(UNLOCK_KEY, 'true');
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(UNLOCK_KEY);
    setUnlocked(false);
    setPin('');
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
            type="password"
            inputMode="numeric"
            placeholder="Code PIN superadmin"
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
          <Link to="/login" className="text-xs text-[var(--color-ink-faint)] flex items-center gap-1 mt-1">
            <ArrowLeft size={12} /> Retour à la connexion boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] px-4 md:px-6 pt-6 pb-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl">Superadmin — Boutiques</h1>
            <p className="text-sm text-[var(--color-ink-soft)]">Créez et gérez les boutiques de la plateforme</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" icon={<Plus size={16} />} onClick={() => { setEditingShop(null); setFormOpen(true); }}>
              Nouvelle boutique
            </Button>
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

        {justCreated && (
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

        <div className="flex flex-col gap-2.5">
          {shops.map((s) => (
            <div key={s.id} className="flex items-center gap-3 bg-[var(--color-surface)] rounded-2xl p-4 shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center shrink-0">
                <Store size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{s.name}</p>
                <p className="text-xs text-[var(--color-ink-faint)] truncate">{s.address} · {s.phone}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-black/[0.04] rounded-full px-3 py-1.5 shrink-0">
                <span className="font-mono-num font-semibold text-xs">{s.code}</span>
                <button onClick={() => handleCopy(s.code)} className="tap-scale text-[var(--color-ink-faint)]">
                  <Copy size={12} />
                </button>
              </div>
              <button
                onClick={() => { setEditingShop(s); setFormOpen(true); }}
                className="tap-scale w-8 h-8 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center shrink-0"
                aria-label="Modifier la boutique"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setDeleteTarget(s)}
                className="tap-scale w-8 h-8 rounded-full bg-[var(--color-cash-out-soft)] text-[var(--color-cash-out)] flex items-center justify-center shrink-0"
                aria-label="Supprimer la boutique"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

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
          open={!!deleteTarget}
          title="Supprimer la boutique"
          message={`Voulez-vous vraiment supprimer « ${deleteTarget?.name} » ? Cette action est irréversible et son code d'accès cessera de fonctionner.`}
          confirmLabel="Supprimer"
          danger
          onConfirm={() => {
            if (deleteTarget) removeShop(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
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
