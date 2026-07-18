import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Customer, CustomerInput } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSubmit: (input: CustomerInput) => Promise<void>;
}

export function CustomerForm({ open, onClose, customer, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(customer?.name ?? '');
    setPhone(customer?.phone ?? '');
  }, [customer, open]);

  async function handleSubmit() {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), phone: phone.trim() || undefined });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={customer ? 'Modifier le client' : 'Nouveau client'}>
      <div className="flex flex-col gap-4">
        <Input label="Nom" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        <Input label="Téléphone (optionnel)" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Button size="lg" fullWidth onClick={handleSubmit} disabled={submitting || !name.trim()}>
          {submitting ? 'Enregistrement…' : customer ? 'Enregistrer' : 'Ajouter'}
        </Button>
      </div>
    </Modal>
  );
}
