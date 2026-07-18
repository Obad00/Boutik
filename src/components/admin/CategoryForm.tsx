import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Category } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  onSubmit: (name: string) => Promise<void>;
}

export function CategoryForm({ open, onClose, category, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(category?.name ?? '');
  }, [category, open]);

  async function handleSubmit() {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(name.trim());
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}>
      <div className="flex flex-col gap-4">
        <Input label="Nom de la catégorie" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        <Button size="lg" fullWidth onClick={handleSubmit} disabled={submitting || !name.trim()}>
          {submitting ? 'Enregistrement…' : category ? 'Enregistrer' : 'Ajouter'}
        </Button>
      </div>
    </Modal>
  );
}
