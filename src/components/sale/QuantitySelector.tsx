import { Minus, Plus } from 'lucide-react';

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  unit,
}: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  unit?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 bg-black/[0.04] rounded-full px-1 py-1">
      <button
        onClick={onDecrement}
        className="tap-scale w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-[var(--color-ink)]"
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <span className="font-mono-num font-semibold text-sm min-w-[2.5rem] text-center">
        {quantity}
        {unit ? <span className="text-[10px] text-[var(--color-ink-faint)] ml-0.5">{unit}</span> : null}
      </span>
      <button
        onClick={onIncrement}
        className="tap-scale w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-[var(--color-ink)]"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
