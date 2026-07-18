import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Customer } from '../../types';
import { formatFCFA } from '../../lib/currency';

interface Props {
  customer: Customer | null;
  onClose: () => void;
  onSubmit: (customerId: string, customerName: string, amount: number) => Promise<void>;
}

export function CreditPaymentForm({ customer, onClose, onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!customer) return null;

  async function handleSubmit() {
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    setSubmitting(true);
    try {
      await onSubmit(customer!.id, customer!.name, amt);
      setAmount('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={!!customer} onClose={onClose} title={`Remboursement — ${customer.name}`}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-[var(--color-ink-soft)]">
          Dette actuelle : <span className="font-semibold text-[var(--color-credit)]">{formatFCFA(customer.current_debt)}</span>
        </p>
        <Input label="Montant remboursé (FCFA)" type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
        <button onClick={() => setAmount(String(customer.current_debt))} className="text-sm font-semibold text-[var(--color-accent)] self-start">
          Rembourser la totalité
        </button>
        <Button size="lg" fullWidth onClick={handleSubmit} disabled={submitting || !amount}>
          {submitting ? 'Enregistrement…' : 'Enregistrer le remboursement'}
        </Button>
      </div>
    </Modal>
  );
}
