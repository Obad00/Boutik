import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatFCFACompact } from '../../lib/currency';
import type { PlatformStatsRankings } from '../../types';

type SortBy = 'revenue' | 'sales_count';

export function ShopRankingTable({ rankings }: { rankings: PlatformStatsRankings }) {
  const [sortBy, setSortBy] = useState<SortBy>('revenue');

  const rows = sortBy === 'revenue' ? rankings.top_shops_by_revenue : rankings.top_shops_by_sales_count;
  const inactiveIds = new Set(rankings.shops_inactive_14d.map((s) => s.shop_id));

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-[var(--color-warning)]" />
          <p className="font-display font-semibold text-sm">Top 10 boutiques</p>
        </div>
        <div className="flex bg-black/[0.04] rounded-full p-0.5 text-xs font-semibold">
          <button
            onClick={() => setSortBy('revenue')}
            className={`px-2.5 py-1 rounded-full tap-scale ${
              sortBy === 'revenue' ? 'bg-white shadow-sm text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)]'
            }`}
          >
            Par CA
          </button>
          <button
            onClick={() => setSortBy('sales_count')}
            className={`px-2.5 py-1 rounded-full tap-scale ${
              sortBy === 'sales_count' ? 'bg-white shadow-sm text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)]'
            }`}
          >
            Par ventes
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-[var(--color-ink-faint)] py-4 text-center">Aucune vente enregistrée pour l'instant</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {rows.map((shop, i) => (
            <div key={shop.shop_id} className="flex items-center gap-3 py-1.5">
              <span className="w-6 text-center text-xs font-mono-num font-semibold text-[var(--color-ink-faint)] shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm truncate">{shop.shop_name}</p>
                  {inactiveIds.has(shop.shop_id) && (
                    <Badge tone="warning">Inactif 14j+</Badge>
                  )}
                </div>
                <p className="text-xs text-[var(--color-ink-faint)]">
                  {shop.sales_count.toLocaleString('fr-FR')} vente{shop.sales_count > 1 ? 's' : ''}
                </p>
              </div>
              <p className="font-mono-num font-semibold text-sm shrink-0">{formatFCFACompact(shop.revenue)} FCFA</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
