import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { QuantitySelector } from './QuantitySelector';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { formatFCFA } from '../../lib/currency';

export function Cart({ onCheckout }: { onCheckout: () => void }) {
  const lines = useCartStore((s) => s.lines);
  const increment = useCartStore((s) => s.incrementLine);
  const decrement = useCartStore((s) => s.decrementLine);
  const removeLine = useCartStore((s) => s.removeLine);
  const total = useCartStore((s) => s.total());

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag size={24} />}
        title="Panier vide"
        subtitle="Touchez un article pour commencer une vente."
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 no-scrollbar">
        {lines.map((line) => (
          <div key={line.product_id} className="flex items-center gap-3 bg-black/[0.02] rounded-2xl p-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[var(--color-ink)] truncate">{line.product_name}</p>
              <p className="font-mono-num text-xs text-[var(--color-ink-faint)]">
                {formatFCFA(line.unit_price)} / {line.unit}
              </p>
            </div>
            <QuantitySelector
              quantity={line.quantity}
              onIncrement={() => increment(line.product_id)}
              onDecrement={() => decrement(line.product_id)}
            />
            <button
              onClick={() => removeLine(line.product_id)}
              className="tap-scale w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-cash-out)] hover:bg-[var(--color-cash-out-soft)]"
              aria-label="Retirer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-4 mt-2 border-t border-[var(--color-border)] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-medium text-[var(--color-ink-soft)]">Total</span>
          <span className="font-display font-bold text-2xl font-mono-num">{formatFCFA(total)}</span>
        </div>
        <Button size="lg" fullWidth onClick={onCheckout}>
          Encaisser
        </Button>
      </div>
    </div>
  );
}
