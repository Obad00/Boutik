import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import type { StockMovement } from '../../types';
import { EmptyState } from '../ui/EmptyState';
import { History } from 'lucide-react';

export function StockMovementHistory({ movements }: { movements: StockMovement[] }) {
  if (movements.length === 0) {
    return <EmptyState icon={<History size={22} />} title="Aucun mouvement" subtitle="L'historique des entrées et sorties de stock apparaîtra ici." />;
  }

  return (
    <div className="flex flex-col gap-2">
      {movements.map((m) => (
        <div key={m.id} className="flex items-center gap-3 bg-[var(--color-surface)] rounded-2xl p-3.5 shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)]">
          {m.type === 'in' ? (
            <ArrowUpCircle size={20} className="text-[var(--color-cash-in)] shrink-0" />
          ) : (
            <ArrowDownCircle size={20} className="text-[var(--color-cash-out)] shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{m.product_name}</p>
            <p className="text-xs text-[var(--color-ink-faint)]">{m.reason}</p>
          </div>
          <div className="text-right shrink-0">
            <p className={`font-mono-num font-semibold text-sm ${m.type === 'in' ? 'text-[var(--color-cash-in)]' : 'text-[var(--color-cash-out)]'}`}>
              {m.type === 'in' ? '+' : '-'}{m.quantity}
            </p>
            <p className="text-[10px] text-[var(--color-ink-faint)]">
              {new Date(m.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
