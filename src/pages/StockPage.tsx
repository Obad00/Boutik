import { useEffect, useState } from 'react';
import { useShop } from '../hooks/useShop';
import { useProductsStore } from '../store/productsStore';
import { useStockMovementsStore } from '../store/stockMovementsStore';
import { StockList } from '../components/stock/StockList';
import { RestockForm } from '../components/stock/RestockForm';
import { StockMovementHistory } from '../components/stock/StockMovementHistory';
import { ProductSearchBar } from '../components/sale/ProductSearchBar';
import type { Product } from '../types';

type Tab = 'list' | 'history';

export function StockPage() {
  const { shop_id } = useShop();
  const products = useProductsStore((s) => s.products);
  const categories = useProductsStore((s) => s.categories);
  const fetchProducts = useProductsStore((s) => s.fetchAll);

  const movements = useStockMovementsStore((s) => s.movements);
  const fetchMovements = useStockMovementsStore((s) => s.fetchAll);
  const restock = useStockMovementsStore((s) => s.restock);

  const [search, setSearch] = useState('');
  const [restockTarget, setRestockTarget] = useState<Product | null>(null);
  const [tab, setTab] = useState<Tab>('list');

  useEffect(() => {
    if (!shop_id) return;
    fetchProducts(shop_id);
    fetchMovements(shop_id);
  }, [shop_id, fetchProducts, fetchMovements]);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  async function handleRestock(productId: string, quantity: number) {
    if (!shop_id) return;
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    await restock(shop_id, productId, product.name, quantity);
    await fetchProducts(shop_id);
  }

  return (
    <div className="px-4 md:px-6 pt-4 md:pt-6 pb-4 max-w-4xl mx-auto flex flex-col gap-4">
      <h1 className="font-display font-bold text-xl">Stock</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('list')}
          className={`tap-scale px-4 py-2 rounded-full text-sm font-semibold ${tab === 'list' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-ink-soft)]'}`}
        >
          Articles
        </button>
        <button
          onClick={() => setTab('history')}
          className={`tap-scale px-4 py-2 rounded-full text-sm font-semibold ${tab === 'history' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-ink-soft)]'}`}
        >
          Historique
        </button>
      </div>

      {tab === 'list' ? (
        <>
          <ProductSearchBar value={search} onChange={setSearch} />
          <StockList products={filtered} categories={categories} onRestock={setRestockTarget} />
        </>
      ) : (
        <StockMovementHistory movements={movements} />
      )}

      <RestockForm
        product={restockTarget}
        onClose={() => setRestockTarget(null)}
        onSubmit={(id, qty) => handleRestock(id, qty)}
      />
    </div>
  );
}
