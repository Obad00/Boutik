import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useShop } from '../../hooks/useShop';
import { useCustomersStore } from '../../store/customersStore';
import { CustomerForm } from '../../components/admin/CustomerForm';
import { Button } from '../../components/ui/Button';
import { formatFCFA } from '../../lib/currency';
import type { Customer } from '../../types';

export function AdminCustomersPage() {
  const { shop_id } = useShop();
  const customers = useCustomersStore((s) => s.customers);
  const fetchAll = useCustomersStore((s) => s.fetchAll);
  const createCustomer = useCustomersStore((s) => s.createCustomer);
  const updateCustomer = useCustomersStore((s) => s.updateCustomer);
  const removeCustomer = useCustomersStore((s) => s.removeCustomer);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  useEffect(() => {
    if (shop_id) fetchAll(shop_id);
  }, [shop_id, fetchAll]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Nouveau client
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {customers.map((c) => (
          <div key={c.id} className="flex items-center gap-3 bg-[var(--color-surface)] rounded-2xl p-3.5 shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)]">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{c.name}</p>
              <p className="text-xs text-[var(--color-ink-faint)]">
                {c.phone ?? 'Pas de téléphone'} · Dette : {formatFCFA(c.current_debt)}
              </p>
            </div>
            <button
              onClick={() => {
                setEditing(c);
                setFormOpen(true);
              }}
              className="tap-scale w-8 h-8 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center shrink-0"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => shop_id && removeCustomer(shop_id, c.id)}
              className="tap-scale w-8 h-8 rounded-full bg-[var(--color-cash-out-soft)] text-[var(--color-cash-out)] flex items-center justify-center shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <CustomerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        customer={editing}
        onSubmit={async (input) => {
          if (!shop_id) return;
          if (editing) await updateCustomer(shop_id, editing.id, input);
          else await createCustomer(shop_id, input);
        }}
      />
    </div>
  );
}
