import { AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import type { ShopNeverSold } from '../../types';

export function NeverSoldShopsCard({ shops }: { shops: ShopNeverSold[] }) {
  if (shops.length === 0) return null;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle size={16} className="text-[var(--color-cash-out)]" />
        <p className="font-display font-semibold text-sm">
          Jamais utilisées ({shops.length})
        </p>
      </div>
      <p className="text-xs text-[var(--color-ink-faint)] mb-3">
        Boutiques créées sans aucune vente enregistrée depuis — probable onboarding raté.
      </p>
      <div className="flex flex-wrap gap-2">
        {shops.map((shop) => (
          <div
            key={shop.shop_id}
            className="flex items-center gap-2 bg-[var(--color-cash-out-soft)] rounded-full pl-1.5 pr-3 py-1.5"
          >
            <div className="w-6 h-6 rounded-full bg-white text-[var(--color-cash-out)] flex items-center justify-center shrink-0">
              <AlertTriangle size={11} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--color-ink)] truncate">{shop.shop_name}</p>
              <p className="text-[10px] text-[var(--color-ink-faint)]">
                créée le {new Date(shop.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
