import { useEffect, useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { ShopSettings } from '../../types';

export function ShopSettingsForm({
  settings,
  onSubmit,
}: {
  settings: ShopSettings;
  onSubmit: (input: Partial<ShopSettings>) => Promise<void>;
}) {
  const [form, setForm] = useState(settings);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => setForm(settings), [settings]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await onSubmit(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      <Input label="Nom de la boutique" value={form.shop_name} onChange={(e) => setForm({ ...form, shop_name: e.target.value })} />
      <Input label="Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <Input label="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input
        label="Message de bas de ticket (optionnel)"
        value={form.receipt_footer ?? ''}
        onChange={(e) => setForm({ ...form, receipt_footer: e.target.value })}
      />
      <Input
        label="Code PIN admin"
        value={form.admin_pin}
        onChange={(e) => setForm({ ...form, admin_pin: e.target.value })}
        maxLength={6}
      />
      <Button onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Enregistrement…' : saved ? 'Enregistré ✓' : 'Enregistrer'}
      </Button>
    </Card>
  );
}
