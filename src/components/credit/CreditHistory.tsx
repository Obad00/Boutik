import type { CreditPayment } from '../../types';
import { formatFCFA } from '../../lib/currency';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';
import { History } from 'lucide-react';

export function CreditHistory({
  open,
  onClose,
  customerName,
  payments,
}: {
  open: boolean;
  onClose: () => void;
  customerName: string;
  payments: CreditPayment[];
}) {
  return (
    <Modal open={open} onClose={onClose} title={`Historique — ${customerName}`}>
      {payments.length === 0 ? (
        <EmptyState icon={<History size={22} />} title="Aucun remboursement" subtitle="Les remboursements de ce client apparaîtront ici." />
      ) : (
        <div className="flex flex-col gap-2">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-black/[0.03] rounded-2xl p-3.5">
              <p className="text-xs text-[var(--color-ink-faint)]">
                {new Date(p.created_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="font-mono-num font-semibold text-sm text-[var(--color-cash-in)]">+{formatFCFA(p.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
