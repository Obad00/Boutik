import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight, Store, StoreIcon, Receipt, Wallet } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatFCFACompact } from '../../lib/currency';
import type { PlatformStatsOverview } from '../../types';

export function PlatformKpiCards({ overview }: { overview: PlatformStatsOverview }) {
  return (
    <div className="flex flex-col gap-3">
      <Card raised className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white">
        <p className="text-white/60 text-sm font-medium mb-1">Chiffre d'affaires plateforme</p>
        <p className="font-display font-extrabold text-4xl font-mono-num mb-1">
          {formatFCFACompact(overview.revenue_total)} <span className="text-lg font-semibold opacity-60">FCFA</span>
        </p>
        <p className="text-white/60 text-xs mb-4">
          {overview.sales_count.toLocaleString('fr-FR')} vente{overview.sales_count > 1 ? 's' : ''} · panier moyen{' '}
          {formatFCFACompact(overview.average_basket)} FCFA
        </p>
        <div className="flex gap-3">
          <div className="flex-1 bg-white/10 rounded-2xl p-3.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--color-cash-in)]/25 flex items-center justify-center shrink-0">
              <ArrowUpRight size={16} className="text-[#5CE0A0]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-white/50">Comptant</p>
              <p className="font-mono-num font-semibold text-sm truncate">{formatFCFACompact(overview.revenue_cash)}</p>
            </div>
          </div>
          <div className="flex-1 bg-white/10 rounded-2xl p-3.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--color-credit)]/25 flex items-center justify-center shrink-0">
              <ArrowDownRight size={16} className="text-[#C4A8FF]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-white/50">Crédit</p>
              <p className="font-mono-num font-semibold text-sm truncate">{formatFCFACompact(overview.revenue_credit)}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card raised className="bg-gradient-to-br from-[var(--color-credit)] to-[#6D42D9] text-white">
          <Wallet size={18} className="text-white/60 mb-1.5" />
          <p className="text-white/70 text-xs font-medium mb-0.5">Créances en cours</p>
          <p className="font-display font-extrabold text-xl font-mono-num">
            {formatFCFACompact(overview.total_debt)} <span className="text-xs font-semibold opacity-60">FCFA</span>
          </p>
        </Card>
        <Card raised className="bg-gradient-to-br from-[#0F7B5C] to-[#17A363] text-white">
          <Receipt size={18} className="text-white/60 mb-1.5" />
          <p className="text-white/70 text-xs font-medium mb-0.5">Valeur de stock déclarée</p>
          <p className="font-display font-extrabold text-xl font-mono-num">
            {formatFCFACompact(overview.stock_value_total)} <span className="text-xs font-semibold opacity-60">FCFA</span>
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          icon={<Store size={16} />}
          label="Boutiques actives"
          value={overview.shops_active.toLocaleString('fr-FR')}
          hint={`${overview.shops_inactive} désactivée${overview.shops_inactive > 1 ? 's' : ''}`}
        />
        <StatTile
          icon={<StoreIcon size={16} />}
          label="Nouvelles boutiques"
          value={overview.shops_new_this_month.toLocaleString('fr-FR')}
          hint={`${overview.shops_new_this_week} sur 7 derniers jours`}
        />
      </div>
    </div>
  );
}

function StatTile({ icon, label, value, hint }: { icon: ReactNode; label: string; value: string; hint: string }) {
  return (
    <Card className="flex flex-col gap-1.5">
      <div className="w-8 h-8 rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center">
        {icon}
      </div>
      <p className="text-xs text-[var(--color-ink-soft)]">{label}</p>
      <p className="font-display font-bold text-lg font-mono-num">{value}</p>
      <p className="text-[11px] text-[var(--color-ink-faint)]">{hint}</p>
    </Card>
  );
}
