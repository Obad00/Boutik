import { Plus } from 'lucide-react';
import type { Product } from '../../types';
import { UNIT_LABELS } from '../../types';
import { formatFCFA } from '../../lib/currency';

interface Props {
  products: Product[];
  onAdd: (product: Product) => void;
}

export function ProductGrid({ products, onAdd }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
      {products.map((p) => {
        const outOfStock = p.stock_quantity <= 0;
        const low = !outOfStock && p.stock_quantity <= p.stock_alert_threshold;
        return (
          <button
            key={p.id}
            onClick={() => !outOfStock && onAdd(p)}
            disabled={outOfStock}
            className="tap-scale text-left bg-[var(--color-surface)] rounded-2xl p-3.5 shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)] flex flex-col gap-2 disabled:opacity-50"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-[14px] leading-snug text-[var(--color-ink)] line-clamp-2">{p.name}</p>
              <span className="tap-scale shrink-0 w-7 h-7 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center">
                <Plus size={15} strokeWidth={2.5} />
              </span>
            </div>
            <p className="font-mono-num font-bold text-[15px] text-[var(--color-ink)]">{formatFCFA(p.price_sell)}</p>
            <p className={`text-xs ${outOfStock ? 'text-[var(--color-cash-out)] font-semibold' : low ? 'text-[var(--color-warning)] font-semibold' : 'text-[var(--color-ink-faint)]'}`}>
              {outOfStock ? 'Rupture de stock' : `${p.stock_quantity} ${UNIT_LABELS[p.unit]} en stock`}
            </p>
          </button>
        );
      })}
    </div>
  );
}
