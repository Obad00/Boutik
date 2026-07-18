import { useEffect, useMemo, useState } from 'react';
import { Wallet, HandCoins, History as HistoryIcon } from 'lucide-react';
import { useShop } from '../hooks/useShop';
import { useOrdersStore } from '../store/ordersStore';
import { formatFCFA } from '../lib/currency';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';

type FilterMode = 'all' | 'cash' | 'credit';

export function SalesHistoryPage() {
  const { shop_id } = useShop();
  const orders = useOrdersStore((s) => s.orders);
  const fetchAll = useOrdersStore((s) => s.fetchAll);

  const [dateFilter, setDateFilter] = useState(new Date().toISOString().slice(0, 10));
  const [modeFilter, setModeFilter] = useState<FilterMode>('all');
  const [showAllDates, setShowAllDates] = useState(false);

  useEffect(() => {
    if (shop_id) fetchAll(shop_id);
  }, [shop_id, fetchAll]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesDate = showAllDates || o.created_at.slice(0, 10) === dateFilter;
      const matchesMode = modeFilter === 'all' || o.payment_mode === modeFilter;
      return matchesDate && matchesMode;
    });
  }, [orders, dateFilter, modeFilter, showAllDates]);

  const dayTotal = filtered.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="px-4 md:px-6 pt-4 md:pt-6 pb-4 max-w-2xl mx-auto flex flex-col gap-4">
      <h1 className="font-display font-bold text-xl">Historique des ventes</h1>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setShowAllDates(false);
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-surface)] shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)] border border-transparent focus:border-[var(--color-accent)] focus:outline-none text-sm"
          />
          <button
            onClick={() => setShowAllDates((v) => !v)}
            className={`tap-scale px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
              showAllDates ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-ink-soft)]'
            }`}
          >
            Toutes dates
          </button>
        </div>

        <div className="flex gap-2">
          {(['all', 'cash', 'credit'] as FilterMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setModeFilter(m)}
              className={`tap-scale px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                modeFilter === m ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-ink-soft)]'
              }`}
            >
              {m === 'all' ? 'Tous' : m === 'cash' ? 'Comptant' : 'Crédit'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-black/[0.03] rounded-2xl px-4 py-3">
        <span className="text-sm font-medium text-[var(--color-ink-soft)]">
          {filtered.length} vente{filtered.length > 1 ? 's' : ''}
        </span>
        <span className="font-mono-num font-bold">{formatFCFA(dayTotal)}</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<HistoryIcon size={22} />} title="Aucune vente" subtitle="Aucune vente ne correspond à ces filtres." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((o) => (
            <div key={o.id} className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-[0_2px_12px_-4px_rgba(19,26,44,0.08)]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[var(--color-ink-faint)]">
                  {new Date(o.created_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
                {o.payment_mode === 'cash' ? (
                  <Badge tone="success">
                    <Wallet size={11} /> Comptant
                  </Badge>
                ) : (
                  <Badge tone="credit">
                    <HandCoins size={11} /> Crédit
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[var(--color-ink-soft)] mb-2 truncate">
                {o.items.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                {o.customer_name ? ` — ${o.customer_name}` : ''}
              </p>
              <p className="font-mono-num font-bold text-lg">{formatFCFA(o.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
