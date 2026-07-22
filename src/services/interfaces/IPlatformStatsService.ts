import type { PlatformStats } from '../../types';

export interface IPlatformStatsService {
  getStats(): Promise<PlatformStats>;
}
