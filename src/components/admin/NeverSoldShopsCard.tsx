import { AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import type { ShopNeverSold } from '../../types';

export function NeverSoldShopsCard({ shops }: { shops: ShopNeverSold[] }) {
  if (shops.length === 0) return null;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-[var(--color-cash-out)]" />
        <p className="font-display font-semibold text-sm">
          Jamais utilisées ({shops.length})
        </p>
      </div>
      <p className="text-xs text-[var(--color-ink-faint)] mb-3">
        Boutiques créées sans aucune vente enregistrée depuis — probable onboarding raté.
      </p>
      <div className="flex flex-col gap-2">
        {shops.map((shop) => (
          <div key={shop.shop_id} className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium truncate">{shop.shop_name}</p>
            <p className="text-xs text-[var(--color-ink-faint)] shrink-0">
              créée le {new Date(shop.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
