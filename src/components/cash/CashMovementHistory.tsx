import { ArrowDownCircle, ArrowUpCircle, History } from 'lucide-react';
import type { CashMovement } from '../../types';
import { formatFCFA } from '../../lib/currency';
import { EmptyState } from '../ui/EmptyState';

export function CashMovementHistory({ movements }: { movements: CashMovement[] }) {
  if (movements.length === 0) {
    return <EmptyState icon={<History size={22} />} title="Aucun mouvement" subtitle="Les ventes et dépenses de caisse apparaîtront ici." />;
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
            <p className="font-medium text-sm truncate">{m.reason}</p>
            <p className="text-[11px] text-[var(--color-ink-faint)]">
              {new Date(m.created_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <p className={`font-mono-num font-semibold text-sm shrink-0 ${m.type === 'in' ? 'text-[var(--color-cash-in)]' : 'text-[var(--color-cash-out)]'}`}>
            {m.type === 'in' ? '+' : '-'}{formatFCFA(m.amount)}
          </p>
        </div>
      ))}
    </div>
  );
}
