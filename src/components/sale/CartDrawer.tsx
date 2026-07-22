import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { Cart } from './Cart';
import { Modal } from '../ui/Modal';
import { formatFCFA } from '../../lib/currency';

export function CartDrawer({
  open,
  onOpenChange,
  onCheckout,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckout: () => void;
}) {
  const lines = useCartStore((s) => s.lines);
  const total = useCartStore((s) => s.total());
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);

  if (lines.length === 0) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => onOpenChange(true)}
          className="lg:hidden tap-scale fixed bottom-[5.5rem] left-4 right-4 z-30 bg-[var(--color-primary)] text-white rounded-2xl px-5 py-4 shadow-xl flex items-center justify-between"
        >
          <span className="flex items-center gap-2 font-semibold text-sm">
            <ShoppingBag size={18} />
            {count} article{count > 1 ? 's' : ''}
          </span>
          <span className="font-mono-num font-bold">{formatFCFA(total)}</span>
        </button>
      )}
      <div className="lg:hidden">
        <Modal open={open} onClose={() => onOpenChange(false)} title="Panier">
          <div className="h-[60vh]">
            <Cart
              onCheckout={() => {
                onOpenChange(false);
                onCheckout();
              }}
            />
          </div>
        </Modal>
      </div>
    </>
  );
}
