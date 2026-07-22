import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight, Store, Plus, AlertTriangle, PauseCircle, Wallet, Gauge } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatFCFACompact } from '../../lib/currency';
import type { PlatformStatsOverview } from '../../types';

interface Props {
  overview: PlatformStatsOverview;
  neverSoldCount: number;
  inactive14dCount: number;
}

export function PlatformKpiCards({ overview, neverSoldCount, inactive14dCount }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-2.5">
        <p className="text-[11px] font-bold tracking-wide uppercase text-[var(--color-cash-in)]">Argent</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <Card
            raised
            className="md:col-span-2 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white"
          >
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

          <StatTile
            icon={<Gauge size={16} />}
            iconTone="accent"
            label="Panier moyen"
            value={`${formatFCFACompact(overview.average_basket)} FCFA`}
            hint={`sur ${overview.sales_count.toLocaleString('fr-FR')} ventes`}
          />
          <StatTile
            icon={<Wallet size={16} />}
            iconTone="credit"
            label="Créances en cours"
            value={`${formatFCFACompact(overview.total_debt)} FCFA`}
            hint="toutes boutiques"
          />

          <div className="col-span-full bg-gradient-to-r from-[var(--color-cash-in-soft)] to-transparent border border-[var(--color-border)] rounded-[var(--radius-card)] px-5 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-cash-in-soft)] text-[var(--color-cash-in)] flex items-center justify-center shrink-0">
                <Store size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Valeur de stock déclarée</p>
                <p className="text-[11px] text-[var(--color-ink-faint)] truncate">
                  Produits avec prix d'achat renseigné uniquement
                </p>
              </div>
            </div>
            <p className="font-display font-bold text-lg font-mono-num shrink-0">
              {formatFCFACompact(overview.stock_value_total)} FCFA
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2.5">
        <p className="text-[11px] font-bold tracking-wide uppercase text-[var(--color-accent)]">Activité</p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatTile
            icon={<Store size={16} />}
            iconTone="cash-in"
            label="Boutiques actives"
            value={overview.shops_active.toLocaleString('fr-FR')}
            hint={`${overview.shops_inactive} désactivée${overview.shops_inactive > 1 ? 's' : ''}`}
          />
          <StatTile
            icon={<Plus size={16} />}
            iconTone="accent"
            label="Nouvelles (30 j)"
            value={overview.shops_new_this_month.toLocaleString('fr-FR')}
            hint={`${overview.shops_new_this_week} sur 7 derniers jours`}
          />
          <StatTile
            icon={<AlertTriangle size={16} />}
            iconTone="warning"
            label="Jamais vendu"
            value={neverSoldCount.toLocaleString('fr-FR')}
            hint="onboarding à relancer"
          />
          <StatTile
            icon={<PauseCircle size={16} />}
            iconTone="danger"
            label="Inactives 14j+"
            value={inactive14dCount.toLocaleString('fr-FR')}
            hint="signal de churn"
          />
        </div>
      </section>
    </div>
  );
}

type IconTone = 'accent' | 'credit' | 'cash-in' | 'warning' | 'danger';

const iconToneClasses: Record<IconTone, string> = {
  accent: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
  credit: 'bg-[var(--color-credit-soft)] text-[var(--color-credit)]',
  'cash-in': 'bg-[var(--color-cash-in-soft)] text-[var(--color-cash-in)]',
  warning: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  danger: 'bg-[var(--color-cash-out-soft)] text-[var(--color-cash-out)]',
};

function StatTile({
  icon,
  iconTone,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  iconTone: IconTone;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="flex flex-col gap-1.5">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconToneClasses[iconTone]}`}>{icon}</div>
      <p className="text-xs text-[var(--color-ink-soft)]">{label}</p>
      <p className="font-display font-bold text-lg font-mono-num">{value}</p>
      <p className="text-[11px] text-[var(--color-ink-faint)]">{hint}</p>
    </Card>
  );
}
