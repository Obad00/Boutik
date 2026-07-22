import { useEffect } from 'react';
import { BarChart3, AlertCircle } from 'lucide-react';
import { usePlatformStatsStore } from '../../store/platformStatsStore';
import { EmptyState } from '../ui/EmptyState';
import { PlatformKpiCards } from './PlatformKpiCards';
import { PlatformTrendCharts } from './PlatformTrendCharts';
import { ShopRankingTable } from './ShopRankingTable';
import { NeverSoldShopsCard } from './NeverSoldShopsCard';

export function PlatformStatsPanel() {
  const stats = usePlatformStatsStore((s) => s.stats);
  const isLoading = usePlatformStatsStore((s) => s.isLoading);
  const error = usePlatformStatsStore((s) => s.error);
  const fetchStats = usePlatformStatsStore((s) => s.fetchStats);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle size={22} />}
        title="Impossible de charger les statistiques"
        subtitle="Vérifiez la connexion au serveur puis réessayez."
      />
    );
  }

  if (isLoading || !stats) {
    return (
      <EmptyState
        icon={<BarChart3 size={22} />}
        title="Chargement des statistiques…"
        subtitle="Agrégation des données de toutes les boutiques en cours."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <PlatformKpiCards overview={stats.overview} />
      <PlatformTrendCharts trends={stats.trends} />
      <ShopRankingTable rankings={stats.rankings} />
      <NeverSoldShopsCard shops={stats.rankings.shops_never_sold} />
    </div>
  );
}
