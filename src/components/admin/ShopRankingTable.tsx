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
  const maxRevenue = Math.max(1, ...rows.map((r) => r.revenue));

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-3">
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
        <p className="text-sm text-[var(--color-ink-faint)] py-4 px-5 pb-5 text-center">
          Aucune vente enregistrée pour l'instant
        </p>
      ) : (
        <>
          {/* Vue carte empilée — mobile/tablette */}
          <div className="flex flex-col gap-1.5 lg:hidden px-5 pb-5">
            {rows.map((shop, i) => (
              <div key={shop.shop_id} className="flex items-center gap-3 py-1.5">
                <span className="w-6 text-center text-xs font-mono-num font-semibold text-[var(--color-ink-faint)] shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm truncate">{shop.shop_name}</p>
                    {inactiveIds.has(shop.shop_id) && <Badge tone="warning">Inactif 14j+</Badge>}
                  </div>
                  <p className="text-xs text-[var(--color-ink-faint)]">
                    {shop.sales_count.toLocaleString('fr-FR')} vente{shop.sales_count > 1 ? 's' : ''}
                  </p>
                </div>
                <p className="font-mono-num font-semibold text-sm shrink-0">{formatFCFACompact(shop.revenue)} FCFA</p>
              </div>
            ))}
          </div>

          {/* Vue tableau — desktop, avec barre de magnitude relative */}
          <table className="hidden lg:table w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-ink-faint)] border-b border-[var(--color-border)]">
                <th className="px-5 py-2.5 font-medium w-10">#</th>
                <th className="px-5 py-2.5 font-medium">Boutique</th>
                <th className="px-5 py-2.5 font-medium">Ventes</th>
                <th className="px-5 py-2.5 font-medium text-right">Chiffre d'affaires</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((shop, i) => (
                <tr key={shop.shop_id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-5 py-2.5 font-mono-num font-semibold text-[var(--color-ink-faint)]">{i + 1}</td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">{shop.shop_name}</span>
                      {inactiveIds.has(shop.shop_id) && <Badge tone="warning">Inactif 14j+</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-2.5 text-[var(--color-ink-soft)]">
                    {shop.sales_count.toLocaleString('fr-FR')}
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="relative">
                      <div
                        className="absolute inset-y-0 right-0 bg-[var(--color-accent-soft)] rounded-md"
                        style={{ width: `${Math.round((shop.revenue / maxRevenue) * 100)}%` }}
                      />
                      <p className="relative font-mono-num font-semibold text-right py-1 px-2">
                        {formatFCFACompact(shop.revenue)} FCFA
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Card>
  );
}
