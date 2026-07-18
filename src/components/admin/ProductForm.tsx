import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Product, ProductInput, Category, ProductUnit } from '../../types';
import { UNIT_LABELS } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSubmit: (input: ProductInput) => Promise<void>;
}

const emptyForm: ProductInput = {
  name: '',
  price_sell: 0,
  price_buy: undefined,
  category_id: '',
  unit: 'piece',
  stock_quantity: 0,
  stock_alert_threshold: 5,
};

export function ProductForm({ open, onClose, product, categories, onSubmit }: Props) {
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price_sell: product.price_sell,
        price_buy: product.price_buy,
        category_id: product.category_id,
        unit: product.unit,
        stock_quantity: product.stock_quantity,
        stock_alert_threshold: product.stock_alert_threshold,
      });
    } else {
      setForm({ ...emptyForm, category_id: categories[0]?.id ?? '' });
    }
  }, [product, categories, open]);

  async function handleSubmit() {
    if (!form.name.trim() || !form.category_id || form.price_sell <= 0) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={product ? 'Modifier l\'article' : 'Nouvel article'}>
      <div className="flex flex-col gap-4">
        <Input label="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Prix de vente"
            type="number"
            inputMode="decimal"
            value={form.price_sell || ''}
            onChange={(e) => setForm({ ...form, price_sell: Number(e.target.value) })}
          />
          <Input
            label="Prix d'achat (optionnel)"
            type="number"
            inputMode="decimal"
            value={form.price_buy ?? ''}
            onChange={(e) => setForm({ ...form, price_buy: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        <Select label="Catégorie" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select label="Unité" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value as ProductUnit })}>
          {Object.entries(UNIT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Stock initial"
            type="number"
            inputMode="decimal"
            value={form.stock_quantity || ''}
            onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })}
          />
          <Input
            label="Seuil d'alerte"
            type="number"
            inputMode="decimal"
            value={form.stock_alert_threshold || ''}
            onChange={(e) => setForm({ ...form, stock_alert_threshold: Number(e.target.value) })}
          />
        </div>
        <Button size="lg" fullWidth onClick={handleSubmit} disabled={submitting || !form.name.trim() || !form.category_id}>
          {submitting ? 'Enregistrement…' : product ? 'Enregistrer' : 'Ajouter l\'article'}
        </Button>
      </div>
    </Modal>
  );
}
