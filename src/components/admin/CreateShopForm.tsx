import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { CreateShopInput } from '../../services/interfaces';
import type { Shop } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  shop?: Shop | null;
  onSubmit: (input: CreateShopInput) => Promise<void>;
}

export function CreateShopForm({ open, onClose, shop, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(shop?.name ?? '');
      setAddress(shop?.address ?? '');
      setPhone(shop?.phone ?? '');
    }
  }, [open, shop]);

  async function handleSubmit() {
    if (!name.trim() || !address.trim() || !phone.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), address: address.trim(), phone: phone.trim() });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={shop ? 'Modifier la boutique' : 'Créer une boutique'}>
      <div className="flex flex-col gap-4">
        <Input label="Nom de la boutique" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        <Input label="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input label="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Button size="lg" fullWidth onClick={handleSubmit} disabled={submitting || !name.trim() || !address.trim() || !phone.trim()}>
          {submitting ? 'Enregistrement…' : shop ? 'Enregistrer les modifications' : 'Créer la boutique'}
        </Button>
      </div>
    </Modal>
  );
}
