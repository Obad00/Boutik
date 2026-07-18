import { Phone } from 'lucide-react';
import type { Customer } from '../../types';
import { formatFCFA } from '../../lib/currency';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { HandCoins } from 'lucide-react';

export function CustomerCreditList({ customers, onSelect }: { customers: Customer[]; onSelect: (c: Customer) => void }) {
  const withDebt = customers.filter((c) => c.current_debt > 0).sort((a, b) => b.current_debt - a.current_debt);

  if (withDebt.length === 0) {
    return <EmptyState icon={<HandCoins size={22} />} title="Aucun crédit en cours" subtitle="Les clients ayant une ardoise apparaîtront ici." />;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {withDebt.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c)}
          className="tap-scale text-left flex items-center gap-3 bg-[var(--color-surface)] rounded-2xl p-4 shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)]"
        >
          <div className="w-10 h-10 rounded-full bg-[var(--color-credit-soft)] text-[var(--color-credit)] flex items-center justify-center font-display font-bold shrink-0">
            {c.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{c.name}</p>
            {c.phone && (
              <p className="text-xs text-[var(--color-ink-faint)] flex items-center gap-1">
                <Phone size={11} /> {c.phone}
              </p>
            )}
          </div>
          <Badge tone="credit">{formatFCFA(c.current_debt)}</Badge>
        </button>
      ))}
    </div>
  );
}
