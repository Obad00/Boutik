import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useShop } from '../../hooks/useShop';
import { useProductsStore } from '../../store/productsStore';
import { ProductForm } from '../../components/admin/ProductForm';
import { Button } from '../../components/ui/Button';
import { formatFCFA } from '../../lib/currency';
import { UNIT_LABELS } from '../../types';
import type { Product } from '../../types';

export function AdminProductsPage() {
  const { shop_id } = useShop();
  const products = useProductsStore((s) => s.products);
  const categories = useProductsStore((s) => s.categories);
  const fetchAll = useProductsStore((s) => s.fetchAll);
  const createProduct = useProductsStore((s) => s.createProduct);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  const removeProduct = useProductsStore((s) => s.removeProduct);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    if (shop_id) fetchAll(shop_id);
  }, [shop_id, fetchAll]);

  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—';

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
          Nouvel article
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-3 bg-[var(--color-surface)] rounded-2xl p-3.5 shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)]">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{p.name}</p>
              <p className="text-xs text-[var(--color-ink-faint)]">
                {catName(p.category_id)} · {formatFCFA(p.price_sell)} · {p.stock_quantity} {UNIT_LABELS[p.unit]}
              </p>
            </div>
            <button
              onClick={() => {
                setEditing(p);
                setFormOpen(true);
              }}
              className="tap-scale w-8 h-8 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center shrink-0"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => shop_id && removeProduct(shop_id, p.id)}
              className="tap-scale w-8 h-8 rounded-full bg-[var(--color-cash-out-soft)] text-[var(--color-cash-out)] flex items-center justify-center shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editing}
        categories={categories}
        onSubmit={async (input) => {
          if (!shop_id) return;
          if (editing) await updateProduct(shop_id, editing.id, input);
          else await createProduct(shop_id, input);
        }}
      />
    </div>
  );
}
