import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { CashMovementType } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (type: CashMovementType, amount: number, reason: string) => Promise<void>;
}

export function CashMovementForm({ open, onClose, onSubmit }: Props) {
  const [type, setType] = useState<CashMovementType>('out');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setType('out');
    setAmount('');
    setReason('');
  }

  async function handleSubmit() {
    const amt = Number(amount);
    if (!amt || amt <= 0 || !reason.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(type, amt, reason.trim());
      reset();
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Mouvement de caisse"
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setType('in')}
            className={`tap-scale py-3 rounded-2xl border-2 font-semibold text-sm ${
              type === 'in' ? 'border-[var(--color-cash-in)] bg-[var(--color-cash-in-soft)] text-[var(--color-cash-in)]' : 'border-transparent bg-black/[0.03] text-[var(--color-ink-soft)]'
            }`}
          >
            Entrée
          </button>
          <button
            onClick={() => setType('out')}
            className={`tap-scale py-3 rounded-2xl border-2 font-semibold text-sm ${
              type === 'out' ? 'border-[var(--color-cash-out)] bg-[var(--color-cash-out-soft)] text-[var(--color-cash-out)]' : 'border-transparent bg-black/[0.03] text-[var(--color-ink-soft)]'
            }`}
          >
            Sortie
          </button>
        </div>
        <Input label="Montant (FCFA)" type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
        <Input
          label="Motif"
          placeholder={type === 'out' ? 'Ex: Achat fournisseur, retrait…' : 'Ex: Apport personnel…'}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button size="lg" fullWidth onClick={handleSubmit} disabled={submitting || !amount || !reason.trim()}>
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </Modal>
  );
}
