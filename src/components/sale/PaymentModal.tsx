import { useState } from 'react';
import { Wallet, HandCoins, UserPlus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { Customer, PaymentMode } from '../../types';
import { formatFCFA } from '../../lib/currency';

interface Props {
  open: boolean;
  onClose: () => void;
  total: number;
  customers: Customer[];
  onConfirm: (mode: PaymentMode, customer?: { id?: string; name: string; phone?: string }) => void;
  isSubmitting?: boolean;
}

export function PaymentModal({ open, onClose, total, customers, onConfirm, isSubmitting }: Props) {
  const [mode, setMode] = useState<PaymentMode>('cash');
  const [customerId, setCustomerId] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [creatingNew, setCreatingNew] = useState(false);

  function reset() {
    setMode('cash');
    setCustomerId('');
    setNewName('');
    setNewPhone('');
    setCreatingNew(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleConfirm() {
    if (mode === 'cash') {
      onConfirm('cash');
      return;
    }
    if (creatingNew) {
      if (!newName.trim()) return;
      onConfirm('credit', { name: newName.trim(), phone: newPhone.trim() || undefined });
    } else {
      const customer = customers.find((c) => c.id === customerId);
      if (!customer) return;
      onConfirm('credit', { id: customer.id, name: customer.name });
    }
  }

  const canConfirm = mode === 'cash' || (creatingNew ? newName.trim().length > 0 : customerId.length > 0);

  return (
    <Modal open={open} onClose={handleClose} title="Encaisser la vente">
      <div className="flex flex-col gap-5">
        <div className="text-center py-2">
          <p className="text-sm text-[var(--color-ink-soft)] mb-1">Montant à encaisser</p>
          <p className="font-display font-extrabold text-3xl font-mono-num">{formatFCFA(total)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode('cash')}
            className={`tap-scale flex flex-col items-center gap-2 py-4 rounded-2xl border-2 ${
              mode === 'cash' ? 'border-[var(--color-cash-in)] bg-[var(--color-cash-in-soft)]' : 'border-transparent bg-black/[0.03]'
            }`}
          >
            <Wallet size={22} className="text-[var(--color-cash-in)]" />
            <span className="font-semibold text-sm">Comptant</span>
          </button>
          <button
            onClick={() => setMode('credit')}
            className={`tap-scale flex flex-col items-center gap-2 py-4 rounded-2xl border-2 ${
              mode === 'credit' ? 'border-[var(--color-credit)] bg-[var(--color-credit-soft)]' : 'border-transparent bg-black/[0.03]'
            }`}
          >
            <HandCoins size={22} className="text-[var(--color-credit)]" />
            <span className="font-semibold text-sm">Crédit (ardoise)</span>
          </button>
        </div>

        {mode === 'credit' && (
          <div className="flex flex-col gap-3">
            {!creatingNew ? (
              <>
                <label className="text-sm font-medium text-[var(--color-ink-soft)]">Client</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/[0.03] border border-transparent focus:border-[var(--color-accent)] focus:outline-none"
                >
                  <option value="">Sélectionner un client…</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.phone ? `— ${c.phone}` : ''}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setCreatingNew(true)}
                  className="tap-scale flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] self-start"
                >
                  <UserPlus size={16} /> Nouveau client
                </button>
              </>
            ) : (
              <>
                <Input label="Nom du client" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
                <Input
                  label="Téléphone (optionnel)"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  type="tel"
                />
                <button
                  onClick={() => setCreatingNew(false)}
                  className="text-sm font-semibold text-[var(--color-ink-soft)] self-start"
                >
                  ← Choisir un client existant
                </button>
              </>
            )}
          </div>
        )}

        <Button size="lg" fullWidth onClick={handleConfirm} disabled={!canConfirm || isSubmitting}>
          {isSubmitting ? 'Traitement…' : 'Valider la vente'}
        </Button>
      </div>
    </Modal>
  );
}
