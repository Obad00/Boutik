import type { IPlatformStatsService } from '../interfaces';
import type { PlatformStats } from '../../types';
import { apiFetch } from './http';

class ApiPlatformStatsService implements IPlatformStatsService {
  async getStats(): Promise<PlatformStats> {
    return apiFetch<PlatformStats>('/superadmin/stats', { scope: 'superadmin' });
  }
}

export const platformStatsService = new ApiPlatformStatsService();
