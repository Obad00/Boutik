import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Product } from '../../types';
import { UNIT_LABELS } from '../../types';

interface Props {
  product: Product | null;
  onClose: () => void;
  onSubmit: (productId: string, quantity: number, cost?: number) => Promise<void>;
}

export function RestockForm({ product, onClose, onSubmit }: Props) {
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!product) return null;

  async function handleSubmit() {
    const qty = Number(quantity);
    if (!qty || qty <= 0) return;
    setSubmitting(true);
    try {
      await onSubmit(product!.id, qty, cost ? Number(cost) : undefined);
      setQuantity('');
      setCost('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={!!product} onClose={onClose} title={`Réapprovisionner — ${product.name}`}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-[var(--color-ink-soft)]">
          Stock actuel : <span className="font-semibold text-[var(--color-ink)]">{product.stock_quantity} {UNIT_LABELS[product.unit]}</span>
        </p>
        <Input
          label={`Quantité ajoutée (${UNIT_LABELS[product.unit]})`}
          type="number"
          inputMode="decimal"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          autoFocus
        />
        <Input
          label="Coût d'achat total (optionnel)"
          type="number"
          inputMode="decimal"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        <Button size="lg" fullWidth onClick={handleSubmit} disabled={submitting || !quantity}>
          {submitting ? 'Enregistrement…' : "Ajouter au stock"}
        </Button>
      </div>
    </Modal>
  );
}
