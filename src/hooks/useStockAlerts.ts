import { useMemo } from 'react';
import { useProductsStore } from '../store/productsStore';

export function useStockAlerts() {
  const products = useProductsStore((s) => s.products);
  return useMemo(() => products.filter((p) => p.stock_quantity <= p.stock_alert_threshold), [products]);
}
