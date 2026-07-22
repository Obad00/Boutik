import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '../ui/Card';
import { formatFCFACompact } from '../../lib/currency';
import type { PlatformStatsTrends } from '../../types';

type RevenueRange = 'day' | 'month';

function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
}

const tickStyle = { fontSize: 11, fill: 'var(--color-ink-faint)' };
const gridStroke = 'var(--color-border)';

export function PlatformTrendCharts({ trends }: { trends: PlatformStatsTrends }) {
  const [revenueRange, setRevenueRange] = useState<RevenueRange>('day');

  const revenueData =
    revenueRange === 'day'
      ? trends.revenue_by_day.map((r) => ({ label: formatDayLabel(r.date), value: r.total }))
      : trends.revenue_by_month.map((r) => ({ label: formatMonthLabel(r.month), value: r.total }));

  const newShopsData = trends.new_shops_by_month.map((r) => ({ label: formatMonthLabel(r.month), value: r.count }));

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="font-display font-semibold text-sm">Chiffre d'affaires</p>
          <div className="flex bg-black/[0.04] rounded-full p-0.5 text-xs font-semibold">
            <button
              onClick={() => setRevenueRange('day')}
              className={`px-2.5 py-1 rounded-full tap-scale ${
                revenueRange === 'day' ? 'bg-white shadow-sm text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)]'
              }`}
            >
              30 jours
            </button>
            <button
              onClick={() => setRevenueRange('month')}
              className={`px-2.5 py-1 rounded-full tap-scale ${
                revenueRange === 'month' ? 'bg-white shadow-sm text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)]'
              }`}
            >
              12 mois
            </button>
          </div>
        </div>
        <div className="h-48 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" tick={tickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
              <YAxis
                tick={tickStyle}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => formatFCFACompact(v)}
                width={56}
              />
              <Tooltip
                formatter={(value) => [`${formatFCFACompact(Number(value))} FCFA`, 'CA']}
                contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)', fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <p className="font-display font-semibold text-sm mb-3">Nouvelles boutiques par mois</p>
        <div className="h-40 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={newShopsData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" tick={tickStyle} axisLine={{ stroke: gridStroke }} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
              <Tooltip
                formatter={(value) => [Number(value), 'Nouvelles boutiques']}
                contentStyle={{ borderRadius: 12, border: '1px solid var(--color-border)', fontSize: 12 }}
              />
              <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
