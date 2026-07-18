import { AlertTriangle, PackagePlus } from 'lucide-react';
import type { Product, Category } from '../../types';
import { UNIT_LABELS } from '../../types';
import { formatFCFA } from '../../lib/currency';
import { Badge } from '../ui/Badge';

interface Props {
  products: Product[];
  categories: Category[];
  onRestock: (product: Product) => void;
}

export function StockList({ products, categories, onRestock }: Props) {
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—';

  return (
    <>
      {/* Vue carte empilée — mobile */}
      <div className="flex flex-col gap-2.5 lg:hidden">
        {products.map((p) => {
          const low = p.stock_quantity <= p.stock_alert_threshold;
          return (
            <div key={p.id} className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)] flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{p.name}</p>
                <p className="text-xs text-[var(--color-ink-faint)]">{catName(p.category_id)} · {formatFCFA(p.price_sell)}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  {low && (
                    <Badge tone={p.stock_quantity <= 0 ? 'danger' : 'warning'}>
                      <AlertTriangle size={11} /> {p.stock_quantity} {UNIT_LABELS[p.unit]}
                    </Badge>
                  )}
                  {!low && (
                    <span className="text-xs text-[var(--color-ink-soft)]">
                      {p.stock_quantity} {UNIT_LABELS[p.unit]} en stock
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => onRestock(p)}
                className="tap-scale w-10 h-10 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center shrink-0"
                aria-label="Réapprovisionner"
              >
                <PackagePlus size={17} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Vue tableau — tablette/desktop */}
      <div className="hidden lg:block bg-[var(--color-surface)] rounded-[var(--radius-card)] overflow-hidden shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--color-ink-faint)] border-b border-[var(--color-border)]">
              <th className="px-5 py-3 font-medium">Article</th>
              <th className="px-5 py-3 font-medium">Catégorie</th>
              <th className="px-5 py-3 font-medium">Prix</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const low = p.stock_quantity <= p.stock_alert_threshold;
              return (
                <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3 text-[var(--color-ink-soft)]">{catName(p.category_id)}</td>
                  <td className="px-5 py-3 font-mono-num">{formatFCFA(p.price_sell)}</td>
                  <td className="px-5 py-3">
                    {low ? (
                      <Badge tone={p.stock_quantity <= 0 ? 'danger' : 'warning'}>
                        <AlertTriangle size={11} /> {p.stock_quantity} {UNIT_LABELS[p.unit]}
                      </Badge>
                    ) : (
                      <span>{p.stock_quantity} {UNIT_LABELS[p.unit]}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => onRestock(p)}
                      className="tap-scale inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] text-xs font-semibold"
                    >
                      <PackagePlus size={13} /> Réapprovisionner
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
