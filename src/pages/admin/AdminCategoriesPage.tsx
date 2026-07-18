import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useShop } from '../../hooks/useShop';
import { useProductsStore } from '../../store/productsStore';
import { CategoryForm } from '../../components/admin/CategoryForm';
import { Button } from '../../components/ui/Button';
import type { Category } from '../../types';

export function AdminCategoriesPage() {
  const { shop_id } = useShop();
  const categories = useProductsStore((s) => s.categories);
  const fetchAll = useProductsStore((s) => s.fetchAll);
  const createCategory = useProductsStore((s) => s.createCategory);
  const updateCategory = useProductsStore((s) => s.updateCategory);
  const removeCategory = useProductsStore((s) => s.removeCategory);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  useEffect(() => {
    if (shop_id) fetchAll(shop_id);
  }, [shop_id, fetchAll]);

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
          Nouvelle catégorie
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 bg-[var(--color-surface)] rounded-2xl p-3.5 shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)]">
            <p className="flex-1 font-semibold text-sm">{c.name}</p>
            <button
              onClick={() => {
                setEditing(c);
                setFormOpen(true);
              }}
              className="tap-scale w-8 h-8 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center shrink-0"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => shop_id && removeCategory(shop_id, c.id)}
              className="tap-scale w-8 h-8 rounded-full bg-[var(--color-cash-out-soft)] text-[var(--color-cash-out)] flex items-center justify-center shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <CategoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        category={editing}
        onSubmit={async (name) => {
          if (!shop_id) return;
          if (editing) await updateCategory(shop_id, editing.id, name);
          else await createCategory(shop_id, name);
        }}
      />
    </div>
  );
}
